import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import jwt from 'jsonwebtoken';
import pool from 'utils/db';

const bcrypt = require('bcrypt');

// The value I used and add in .env file
// ACCESS_TOKEN_SECRET=d4bbdad0d47cf552c0d669941097eb02
// REFRESH_TOKEN_SECRET=d251a84f3d83e51f68db56bea902f295

const generateTokens = (ID: number) => {
  const accessToken = jwt.sign({ ID }, process.env.ACCESS_TOKEN_SECRET || '', {
    expiresIn: 86400,
  });
  const refreshToken = jwt.sign({ ID }, process.env.REFRESH_TOKEN_SECRET || '');
  return { accessToken, refreshToken };
};

const storeTokens = (
  res: NextApiResponse,
  accessToken: string,
  refreshToken: string,
  ID: number,
) =>
  pool
    .query('UPDATE "User" SET Token=$1, RefreshToken=$2 WHERE ID=$3', [
      accessToken,
      refreshToken,
      ID,
    ])
    .catch((err: any) => {
      res.status(500).send(err);
    });

const handler = nextConnect<NextApiRequest, NextApiResponse>({
  onNoMatch(req, res) {
    res.status(405).json({
      error: `Method ${req.method} Not Found or Not Allowed`,
    });
  },
}).post((req, res) => {
  const { Email, Password } = req.body;
  pool
    .query(
      `SELECT "ID", "Name", "Password", "Email" FROM "User" WHERE "User"."Email"=$1`,
      [Email],
    )
    .then((result: any) => {
      if (result.rowCount > 0) {
        const { ID } = result.rows[0];
        const hashedPassword = result.rows[0].password;
        if (bcrypt.compareSync(Password, hashedPassword)) {
          const { accessToken, refreshToken } = generateTokens(ID);
          storeTokens(res, accessToken, refreshToken, ID);
          res
            .status(200)
            .send({ success: true, tokens: { accessToken, refreshToken } });
        } else
          res
            .status(400)
            .json({ success: false, message: 'Something Incorrect' });
      } else
        res.status(400).json({ success: false, message: 'email not found' });
    })
    .catch((err: any) => {
      if (err) res.status(500).json(err);
    });
});

export default handler;

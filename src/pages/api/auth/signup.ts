import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import bcrypt from 'bcrypt';
import moment from 'moment';
import pool from 'utils/db';

import { createSupplier, createBuyer } from './user';

const errHandler = (promise: any) => {
  return promise
    .then((data: any) => [data, undefined])
    .catch((err: any) => Promise.resolve([undefined, err]));
};
const checkEmaiExist = async (Email: string) => {
  let result = null;
  result = await pool.query(
    `SELECT EXISTS (SELECT * FROM "User" WHERE "Email"='${Email}');`,
  );

  return result.rows[0].exists;
};

const handler = nextConnect().post(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { Type, Password, Name, Email, ABN, Logo } = req.body;
    let exists = null;
    try {
      exists = await checkEmaiExist(Email);
    } catch (err) {
      return res.status(500).json({ err });
    }

    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: 'Email is already taken!' });
    }

    const hashedPassword = bcrypt.hashSync(Password as string, 10);
    if (Type === 'supplier') {
      const { State_ID, City_ID } = req.body;
      const [SupplierID, supplierIDErr] = await errHandler(
        createSupplier(Name, ABN, Logo, State_ID, City_ID),
      );
      if (supplierIDErr)
        return res.status(500).json({ message: 'Something wrong' });

      try {
        const result = await pool.query(
          `INSERT INTO "User" ("Name", "Password", "Email", "Supplier_ID", "CreatedAt") VALUES ('${Name}', '${hashedPassword}', '${Email}', '${SupplierID}', '${moment().format(
            'YYYY-MM-DD',
          )}');`,
        );
        if (result) res.status(200).json({ success: true });
      } catch (err) {
        return res.status(500).json({ err });
      }
    } else if (Type === 'buyer') {
      const [BuyerID, BuyerIDErr] = await errHandler(
        createBuyer(Name, ABN, Logo),
      );
      if (BuyerIDErr)
        return res
          .status(500)
          .json({ success: false, message: 'Something wrong' });
      try {
        const result = await pool.query(
          `INSERT INTO "User" ("Name", "Password", "Email", "Buyer_ID", "CreatedAt") VALUES ('${Name}', '${hashedPassword}', '${Email}', '${BuyerID}', '${moment().format(
            'YYYY-MM-DD',
          )}');`,
        );
        if (result) return res.status(200).json({ succes: true });
      } catch (err) {
        return res
          .status(500)
          .json({ success: false, message: 'Something wrong' });
      }
    }
    return res.status(500).json({ message: 'something resally wrong' });
  },
);

export default handler;

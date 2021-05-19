import moment from 'moment';
import pool from 'utils/db';

const createSupplier = async (
  Name: string,
  ABN: number,
  Logo: string,
  State_ID: number,
  City_ID: number,
) => {
  const result = await pool.query(
    `INSERT INTO "Supplier" ("Name", "ABN", "Logo", "State_ID", "City_ID", "CreatedAt") VALUES ('${Name}', '${ABN}', '${Logo}', '${State_ID}', '${City_ID}', '${moment().format(
      'YYYY-MM-DD',
    )}') RETURNING "ID";`,
  );
  return result.rows[0].ID;
};

const createBuyer = async (Name: string, ABN: number, Logo: string) => {
  const result = await pool.query(
    `INSERT INTO "Buyer" ("Name", "ABN", "Logo", "CreatedAt") VALUES ('${Name}', '${ABN}', '${Logo}', '${moment().format(
      'YYYY-MM-DD',
    )}') RETURNING "ID";`,
  );
  return result.rows[0].ID;
};

// const createBuyer = async (
//   Name: string,
//   ABN: number,
//   Logo: string,
// ) => {
//   let result = null;
//   try {
//     result = await pool.query(
//       `INSERT INTO "Buyer" ("Name", "ABN", "Logo", "CreatedAt") VALUES ('${Name}', '${ABN}', '${Logo}', '${moment().format(
//         'YYYY-MM-DD',
//       )}') RETURNING "ID";`,
//     );
//   } catch (err) {
//     throw err;
//   }
//   return result.rows[0].ID;
// };

export { createSupplier, createBuyer };

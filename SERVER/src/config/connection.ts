// import { Sequelize } from "sequelize";
// import { envs } from "./envs";

// export const sequelize = new Sequelize(envs.DATABASE_URL, {
//   dialect: "postgres",
//   logging: false,
// });

import { Sequelize } from "sequelize";

const isProduction = process.env.NODE_ENV === 'production';

export const sequelize = new Sequelize(
  process.env.DATABASE_URL as string,
  {
    dialect: "postgres",
    logging: false,
    dialectOptions: isProduction
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
  }
);
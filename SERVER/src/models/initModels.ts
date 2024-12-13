import { sequelize } from "@config/connection";
import { User } from "./User";
import { OTP } from "./OTP";
import { Account } from "./account";
import { Transaction } from "./transaction";

export const initModels = () => {

  User.initModel(sequelize);
  OTP.initModel(sequelize);
  Account.initModel(sequelize);
  Transaction.initModel(sequelize);

  Account.belongsTo(User, { 
    foreignKey: 'userId',
    as: 'user'
  });
  
  User.hasMany(Account, { 
    foreignKey: 'userId',
    as: 'accounts' 
  });

  OTP.belongsTo(User, {
    foreignKey: 'userEmail',
    targetKey: 'email',
    as: 'user'
  });

  User.hasMany(OTP, {
    foreignKey: 'userEmail',
    sourceKey: 'email', 
    as: 'otps'
  });

  Transaction.belongsTo(Account, {
    foreignKey: 'fromAccountId',
    as: 'sourceAccount'
  });
  
  Transaction.belongsTo(Account, {
    foreignKey: 'toAccountId',
    as: 'destinationAccount'
  });
};

initModels();

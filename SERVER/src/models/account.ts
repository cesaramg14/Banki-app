import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface AccountAttributes {
  id: number;
  userId: number;
  balance: number;
  accountNumber: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AccountInput extends Optional<AccountAttributes, "id"> {}

export class Account extends Model<AccountAttributes, AccountInput> implements AccountAttributes {
  public id!: number;
  public userId!: number;
  declare balance: number; 
  public accountNumber!: string;
  public active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize) {
    Account.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        balance: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 0
        },
        accountNumber: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
        }
      },
      {
        sequelize,
        tableName: "accounts"
      }
    );
  }
}
import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface TransactionAttributes {
  id: number;
  fromAccountId: number; 
  toAccountId: number;
  amount: number;
  type: 'TRANSFER' | 'DEPOSIT' | 'WITHDRAWAL';
  status: 'COMPLETED' | 'FAILED' | 'PENDING';
  description?: string;
  suspicious:boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TransactionInput extends Optional<TransactionAttributes, "id"> {}


export class Transaction extends Model<TransactionAttributes, TransactionInput> {
  declare id: number; 
  declare fromAccountId: string;
  declare toAccountId: string;
  declare amount: number;
  declare type: 'TRANSFER' | 'DEPOSIT' | 'WITHDRAWAL';
  declare status: 'COMPLETED' | 'FAILED' | 'PENDING';
  declare description?: string;
  declare suspicious: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static initModel(sequelize: Sequelize) {
    Transaction.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        fromAccountId: {
          type: DataTypes.INTEGER, 
          allowNull: false,
        },
        toAccountId: {
          type: DataTypes.INTEGER, 
          allowNull: false,
        },
        amount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        type: {
          type: DataTypes.ENUM('TRANSFER', 'DEPOSIT', 'WITHDRAWAL'),
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM('COMPLETED', 'FAILED', 'PENDING'),
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        suspicious: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        }
      },
      {
        sequelize,
        tableName: "transactions"
      }
    );
  }

  static associate(models: any) {
    Transaction.belongsTo(models.Account, {
      foreignKey: 'fromAccountId',
      as: 'sourceAccount'
    });
    
    Transaction.belongsTo(models.Account, {
      foreignKey: 'toAccountId',
      as: 'destinationAccount'
    });
  }
}
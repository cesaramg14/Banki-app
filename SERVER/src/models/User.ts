import { DataTypes, Model, Optional, Sequelize } from "sequelize";

// Atributos del modelo User
export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  img: string;
  active:boolean;
  role:string;
  updatedAt?: Date;
  createdAt?: Date;
}

// Define el tipo del objeto que se pasa a User.create()
export interface UserInput extends Optional<UserAttributes, "id" | "img" | "role" | "active"> {}

export class User extends Model<UserAttributes, UserInput> {
  static initModel(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        img: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        active:{
          type: DataTypes.BOOLEAN,
          defaultValue:true},

        role: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "cliente"
        }
      },
      {
        timestamps: true,
        sequelize: sequelize,
        modelName: "user",
        paranoid: false,
      }
    );
  }
}

User.prototype.toJSON = function () {
  const { password, ...values } = this.get();
  return values;
};

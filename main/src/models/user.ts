import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db';

class User extends Model {
  public id!: number;
  public email!: string;
  public username!: string;
  public firstName!: string;
  public lastName!: string;
  public password!: string;
}

export interface UserModel {
  id: number,
  email: string,
  username: string,
  firstName: string,
  lastName: string,
  password: string
};

User.init(
  {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 255]
        }
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [0, 255]
        }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [0, 255]
        }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: 'user',
    timestamps: false
  }
);

export { User };
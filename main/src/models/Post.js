import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const post = sequelize.define('post',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true
        },
        body: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        timestamps: false
    }
);
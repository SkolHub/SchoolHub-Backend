import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const User_Organization = sequelize.define('user_organization',
    {
        role: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        timestamps: false,
    }
);
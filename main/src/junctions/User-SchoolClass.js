import { sequelize } from "../db.js";

export const User_SchoolClass = sequelize.define('user_schoolclass',
    { },
    {
        timestamps: false,
    }
);
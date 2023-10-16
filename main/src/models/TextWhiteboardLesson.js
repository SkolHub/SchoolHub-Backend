import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

export const TextWhiteboardLesson = sequelize.define('textwhiteboardlesson',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        data: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
    {
        timestamps: false
    }
);
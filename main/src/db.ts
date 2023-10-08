import { Sequelize } from "sequelize";

export const sequelize = new Sequelize('postgres://postgres:test12345@localhost:5432/schoolhub');

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const constants_1 = require("../config/constants");
const sequelize = new sequelize_1.Sequelize(constants_1.DB_NAME, constants_1.DB_USER, constants_1.DB_PASS, {
    host: constants_1.DB_HOST,
    port: constants_1.DB_PORT,
    dialect: "postgres",
});
exports.default = sequelize;

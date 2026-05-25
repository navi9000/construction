"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = initUnit;
const sequelize_1 = require("sequelize");
class Unit extends sequelize_1.Model {
}
function initUnit(sequelize) {
    Unit.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    }, { sequelize, modelName: "unit" });
    return Unit;
}

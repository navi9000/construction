"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = initEntry;
const sequelize_1 = require("sequelize");
class Entry extends sequelize_1.Model {
}
function initEntry(sequelize) {
    Entry.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        date: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        amount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        unit_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        job_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        worker_name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
    }, { sequelize, modelName: "entry" });
    return Entry;
}

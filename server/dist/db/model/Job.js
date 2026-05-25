"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = initJob;
const sequelize_1 = require("sequelize");
class Job extends sequelize_1.Model {
}
function initJob(sequelize) {
    Job.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
    }, { sequelize, modelName: "job" });
    return Job;
}

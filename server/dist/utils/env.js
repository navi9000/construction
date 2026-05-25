"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = env;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
function env(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`No parameter ${name}`);
    }
    return value;
}

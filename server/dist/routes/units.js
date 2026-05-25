"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
const validate_1 = require("../middlewares/validate");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.post("/", (0, validate_1.validate)([
    (0, express_validator_1.body)("name", "Название меры измерения обязательно и должно быть строкой")
        .isString()
        .isLength({ min: 1 })
        .escape(),
]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        const data = yield db_1.Unit.create({ name });
        return res.status(201).json({
            is_success: true,
            data,
        });
    }
    catch (error) {
        if (error instanceof sequelize_1.UniqueConstraintError) {
            return res.status(409).json({
                is_success: false,
                errors: [["name", "Название меры измерения должно быть уникальным"]],
            });
        }
        console.error("Failed to create unit:", error);
        return res.status(500).json({
            is_success: false,
            errors: [["server", "Не удалось добавить новую меру измерения"]],
        });
    }
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const units = yield db_1.Unit.findAll({
            order: [["name", "ASC"]],
            attributes: ["id", "name"],
        });
        return res.json({
            is_success: true,
            data: units,
        });
    }
    catch (error) {
        console.error("Failed to fetch units:", error);
        return res.status(500).json({
            is_success: false,
            errors: [["server", "Не удалось загрузить меры измерения"]],
        });
    }
}));
exports.default = router;

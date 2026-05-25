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
const express_validator_1 = require("express-validator");
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
const validate_1 = require("../middlewares/validate");
const router = (0, express_1.Router)();
const findUnitsByIds = (unitIds) => __awaiter(void 0, void 0, void 0, function* () {
    const uniqueUnitIds = [...new Set(unitIds)];
    const units = yield db_1.Unit.findAll({
        where: {
            id: uniqueUnitIds,
        },
        attributes: ["id", "name"],
    });
    return {
        units,
        missingUnitIds: uniqueUnitIds.filter((unitId) => !units.some((unit) => unit.id === unitId)),
    };
});
router.post("/", (0, validate_1.validate)([
    (0, express_validator_1.body)("name", "Необходимо указать название работ")
        .isString()
        .isLength({ min: 1 })
        .trim()
        .escape(),
    (0, express_validator_1.body)("unit_ids", "Необходимо добавить хотя бы одну меру измерения").isArray({ min: 1 }),
]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const unitIds = req.body.unit_ids.map(Number);
    const transaction = yield db_1.sequelize.transaction();
    try {
        const { units, missingUnitIds } = yield findUnitsByIds(unitIds);
        if (missingUnitIds.length > 0) {
            yield transaction.rollback();
            return res.status(404).json({
                is_success: false,
                errors: [
                    [
                        "unit_ids",
                        `Не найдены меры измерения со следующими id: ${missingUnitIds.join(", ")}`,
                    ],
                ],
            });
        }
        const job = yield db_1.Job.create({ name }, { transaction });
        yield job.addUnits(units, { transaction });
        yield transaction.commit();
        return res.status(201).json({
            is_success: true,
            data: {
                id: job.id,
                name: job.name,
                units,
            },
        });
    }
    catch (error) {
        yield transaction.rollback();
        console.error("Failed to create job:", error);
        if (error instanceof sequelize_1.UniqueConstraintError) {
            return res.status(409).json({
                is_success: false,
                errors: [["name", "Название вида работы должно быть уникальным"]],
            });
        }
        return res.status(500).json({
            is_success: false,
            errors: [["server", "Не удалось создать новый вид работ"]],
        });
    }
}));
router.get("/", (0, validate_1.validate)([(0, express_validator_1.query)("page").isNumeric().optional().escape()]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const page = Number((_a = req.query.page) !== null && _a !== void 0 ? _a : 1);
    const limit = 10;
    const offset = (page - 1) * limit;
    if (!Number.isInteger(page) || page < 1) {
        return res.status(400).json({
            is_success: false,
            errors: [
                ["page", "Номер страницы должен быть целым положительным числом"],
            ],
        });
    }
    try {
        const { count, rows } = yield db_1.Job.findAndCountAll({
            attributes: ["id", "name"],
            distinct: true,
            include: [
                {
                    model: db_1.Unit,
                    attributes: ["id", "name"],
                    through: {
                        attributes: [],
                    },
                },
            ],
            limit,
            offset,
            order: [["name", "ASC"]],
        });
        return res.json({
            is_success: true,
            data: rows,
            meta: {
                page,
                per_page: limit,
                total: count,
                total_pages: Math.ceil(count / limit),
            },
        });
    }
    catch (error) {
        console.error("Failed to fetch jobs:", error);
        return res.status(500).json({
            is_success: false,
            errors: [["server", "Не удалось загрузить список видов работ"]],
        });
    }
}));
router.put("/:job_id", (0, validate_1.validate)([
    (0, express_validator_1.param)("job_id", "Параметр job_id должен быть целым положительным числом").isInt({ min: 1 }),
    (0, express_validator_1.body)("name", "Название работы должно быть непустой строкой")
        .optional()
        .isString()
        .isLength({ min: 1 })
        .escape(),
    (0, express_validator_1.body)("units", "Поле units должно содержать объект с опциональными параметрами added и removed")
        .optional()
        .isObject(),
    (0, express_validator_1.body)("units.added", "Массив units.added должен содержать набор целых положительных чисел")
        .optional()
        .isArray(),
    (0, express_validator_1.body)("units.added.*", "Массив units.added должен содержать набор целых положительных чисел")
        .optional()
        .isInt({ min: 1 }),
    (0, express_validator_1.body)("units.removed", "Массив units.removed должен содержать набор целых положительных чисел")
        .optional()
        .isArray(),
    (0, express_validator_1.body)("units.removed.*", "Массив units.removed должен содержать набор целых положительных чисел")
        .optional()
        .isInt({ min: 1 }),
]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const jobId = Number(req.params.job_id);
    const addedUnitIds = ((_b = (_a = req.body.units) === null || _a === void 0 ? void 0 : _a.added) !== null && _b !== void 0 ? _b : []).map(Number);
    const removedUnitIds = ((_d = (_c = req.body.units) === null || _c === void 0 ? void 0 : _c.removed) !== null && _d !== void 0 ? _d : []).map(Number);
    const hasName = Object.prototype.hasOwnProperty.call(req.body, "name");
    const hasUnitChanges = addedUnitIds.length > 0 || removedUnitIds.length > 0;
    if (!hasName && !hasUnitChanges) {
        return res.status(400).json({
            is_success: false,
            errors: [["body", "Необходимо указать значения для изменения"]],
        });
    }
    const transaction = yield db_1.sequelize.transaction();
    try {
        const job = yield db_1.Job.findByPk(jobId, { transaction });
        if (!job) {
            yield transaction.rollback();
            return res.status(404).json({
                is_success: false,
                errors: [["job_id", "Вид работ не найден"]],
            });
        }
        const unitIds = [...addedUnitIds, ...removedUnitIds];
        const { units, missingUnitIds } = yield findUnitsByIds(unitIds);
        if (missingUnitIds.length > 0) {
            yield transaction.rollback();
            return res.status(404).json({
                is_success: false,
                errors: [
                    [
                        "unit",
                        `Не найдены меры измерения со следующими id: ${missingUnitIds.join(", ")}`,
                    ],
                ],
            });
        }
        if (hasName) {
            job.name = req.body.name;
            yield job.save({ transaction });
        }
        const addedUnits = units.filter((unit) => addedUnitIds.includes(unit.id));
        const removedUnits = units.filter((unit) => removedUnitIds.includes(unit.id));
        if (addedUnits.length > 0) {
            yield job.addUnits(addedUnits, { transaction });
        }
        if (removedUnits.length > 0) {
            yield job.removeUnits(removedUnits, { transaction });
        }
        const updatedJob = yield db_1.Job.findByPk(jobId, {
            attributes: ["id", "name"],
            include: [
                {
                    model: db_1.Unit,
                    attributes: ["id", "name"],
                    through: {
                        attributes: [],
                    },
                },
            ],
            transaction,
        });
        yield transaction.commit();
        return res.json({
            is_success: true,
            data: updatedJob,
        });
    }
    catch (error) {
        yield transaction.rollback();
        console.error("Failed to update job:", error);
        if (error instanceof sequelize_1.UniqueConstraintError) {
            return res.status(409).json({
                is_success: false,
                errors: [["name", "Название вида работы должно быть уникальным"]],
            });
        }
        return res.status(500).json({
            is_success: false,
            errors: [["server", "Не удалось изменить вид работ"]],
        });
    }
}));
exports.default = router;

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
const db_1 = require("../db");
const validate_1 = require("../middlewares/validate");
const router = (0, express_1.Router)();
const entryIncludes = [
    {
        model: db_1.Job,
        attributes: ["id", "name"],
    },
    {
        model: db_1.Unit,
        attributes: ["id", "name"],
    },
];
router.post("/", (0, validate_1.validate)([
    (0, express_validator_1.body)("date", "Укажите дату")
        .isString()
        .isLength({ min: 1 })
        .trim()
        .escape(),
    (0, express_validator_1.body)("amount", "Укажите количество").isInt({ min: 1 }),
    (0, express_validator_1.body)("unit_id", "Выберите единицу измерения").isInt({ min: 1 }),
    (0, express_validator_1.body)("job_id", "Выберите вид работ").isInt({ min: 1 }),
    (0, express_validator_1.body)("worker_name", "Укажите ФИО исполнителя")
        .isString()
        .isLength({ min: 1 })
        .trim()
        .escape(),
]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const entryData = {
        date: req.body.date,
        amount: Number(req.body.amount),
        unit_id: Number(req.body.unit_id),
        job_id: Number(req.body.job_id),
        worker_name: req.body.worker_name,
    };
    const transaction = yield db_1.sequelize.transaction();
    try {
        const [job, unit] = yield Promise.all([
            db_1.Job.findByPk(entryData.job_id),
            db_1.Unit.findByPk(entryData.unit_id),
        ]);
        if (!job) {
            yield transaction.rollback();
            return res.status(404).json({
                is_success: false,
                errors: [["job_id", "Вид работ не найден"]],
            });
        }
        if (!unit) {
            yield transaction.rollback();
            return res.status(404).json({
                is_success: false,
                errors: [["unit_id", "Единица измерения не найдена"]],
            });
        }
        const entry = yield db_1.Entry.create(entryData, { transaction });
        const createdEntry = yield db_1.Entry.findByPk(entry.id, {
            include: entryIncludes,
            transaction,
        });
        return res.status(201).json({
            is_success: true,
            data: createdEntry,
        });
    }
    catch (error) {
        yield transaction.rollback();
        console.error("Failed to create entry:", error);
        return res.status(500).json({
            is_success: false,
            errors: [["server", "Не удалось создать новую запись"]],
        });
    }
}));
router.get("/", (0, validate_1.validate)([
    (0, express_validator_1.query)("page", "page must be a positive integer")
        .optional()
        .isInt({ min: 1 })
        .escape(),
]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const page = Number((_a = req.query.page) !== null && _a !== void 0 ? _a : 1);
    const limit = 10;
    const offset = (page - 1) * limit;
    try {
        const { count, rows } = yield db_1.Entry.findAndCountAll({
            attributes: [
                "id",
                "date",
                "amount",
                "unit_id",
                "job_id",
                "worker_name",
            ],
            include: entryIncludes,
            limit,
            offset,
            order: [["id", "DESC"]],
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
        console.error("Failed to fetch entries:", error);
        return res.status(500).json({
            is_success: false,
            errors: [["server", "Не удалось получить список записей"]],
        });
    }
}));
router.put("/:entry_id", (0, validate_1.validate)([
    (0, express_validator_1.param)("entry_id", "Неверный формат параметра entry_id").isInt({ min: 1 }),
    (0, express_validator_1.body)("date", "Неверный формат даты")
        .optional()
        .isString()
        .isLength({ min: 1 })
        .trim()
        .escape(),
    (0, express_validator_1.body)("amount", "Количество должно быть ").optional().isNumeric(),
    (0, express_validator_1.body)("unit_id", "Выберите единицу измерения").optional().isInt({ min: 1 }),
    (0, express_validator_1.body)("job_id", "Выберите вид работ").optional().isInt({ min: 1 }),
    (0, express_validator_1.body)("worker_name", "Укажите ФИО исполнителя")
        .optional()
        .isString()
        .isLength({ min: 1 })
        .trim()
        .escape(),
]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const entryId = Number(req.params.entry_id);
    const updateData = {};
    for (const field of ["date", "worker_name"]) {
        if (Object.prototype.hasOwnProperty.call(req.body, field)) {
            updateData[field] = req.body[field];
        }
    }
    for (const field of ["amount", "unit_id", "job_id"]) {
        if (Object.prototype.hasOwnProperty.call(req.body, field)) {
            updateData[field] = Number(req.body[field]);
        }
    }
    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
            is_success: false,
            errors: [["body", "Необходимо изменить хотя бы одно значение"]],
        });
    }
    try {
        const entry = yield db_1.Entry.findByPk(entryId);
        if (!entry) {
            return res.status(404).json({
                is_success: false,
                errors: [["entry_id", "Запись не найдена"]],
            });
        }
        const [job, unit] = yield Promise.all([
            updateData.job_id
                ? db_1.Job.findByPk(updateData.job_id)
                : Promise.resolve(true),
            updateData.unit_id
                ? db_1.Unit.findByPk(updateData.unit_id)
                : Promise.resolve(true),
        ]);
        if (!job) {
            return res.status(404).json({
                is_success: false,
                errors: [["job_id", "Вид работ не найден"]],
            });
        }
        if (!unit) {
            return res.status(404).json({
                is_success: false,
                errors: [["unit_id", "Единица измерения не найдена"]],
            });
        }
        yield entry.update(updateData);
        const updatedEntry = yield db_1.Entry.findByPk(entryId, {
            include: entryIncludes,
        });
        return res.json({
            is_success: true,
            data: updatedEntry,
        });
    }
    catch (error) {
        console.error("Failed to update entry:", error);
        return res.status(500).json({
            is_success: false,
            errors: [["server", "Не удалось обновить запись"]],
        });
    }
}));
router.delete("/:entry_id", (0, validate_1.validate)([
    (0, express_validator_1.param)("entry_id", "Неверный формат параметра entry_id").isInt({ min: 1 }),
]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const entryId = Number(req.params.entry_id);
    try {
        const entry = yield db_1.Entry.findByPk(entryId);
        if (!entry) {
            return res.status(404).json({
                is_success: false,
                errors: [["entry_id", "Запись не найдена"]],
            });
        }
        yield entry.destroy();
        return res.json({
            is_success: true,
            data: {
                id: entryId,
            },
        });
    }
    catch (error) {
        console.error("Failed to delete entry:", error);
        return res.status(500).json({
            is_success: false,
            errors: [["server", "Не удалось удалить запись"]],
        });
    }
}));
exports.default = router;

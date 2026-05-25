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
const findUnitsByIds = (unitIds) => __awaiter(void 0, void 0, void 0, function* () {
    const uniqueUnitIds = [...new Set(unitIds)];
    const units = yield db_1.Unit.findAll({
        where: {
            id: uniqueUnitIds,
        },
    });
    return {
        units,
        missingUnitIds: uniqueUnitIds.filter((unitId) => !units.some((unit) => unit.id === unitId)),
    };
});
router.post("/", (0, validate_1.validate)([
    (0, express_validator_1.body)("name", "name must be a non-empty string")
        .isString()
        .isLength({ min: 1 })
        .escape(),
    (0, express_validator_1.body)("unit_ids", "unit_ids must be a non-empty array of positive integers")
        .isArray({ min: 1 }),
    (0, express_validator_1.body)("unit_ids.*", "unit_ids must contain only positive integers").isInt({
        min: 1,
    }),
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
                errors: [["unit_ids", `Units not found: ${missingUnitIds.join(", ")}`]],
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
        return res.status(500).json({
            is_success: false,
            errors: [["server", "Failed to create job"]],
        });
    }
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const page = Number((_a = req.query.page) !== null && _a !== void 0 ? _a : 1);
    const limit = 10;
    const offset = (page - 1) * limit;
    if (!Number.isInteger(page) || page < 1) {
        return res.status(400).json({
            is_success: false,
            errors: [["page", "page must be a positive integer"]],
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
            order: [["id", "ASC"]],
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
            errors: [["server", "Failed to fetch jobs"]],
        });
    }
}));
router.patch("/:job_id", (0, validate_1.validate)([
    (0, express_validator_1.param)("job_id", "job_id must be a positive integer").isInt({ min: 1 }),
    (0, express_validator_1.body)("name", "name must be a non-empty string")
        .optional()
        .isString()
        .isLength({ min: 1 })
        .escape(),
    (0, express_validator_1.body)("unit", "unit must be an object").optional().isObject(),
    (0, express_validator_1.body)("unit.added", "unit.added must be an array of positive integers")
        .optional()
        .isArray(),
    (0, express_validator_1.body)("unit.added.*", "unit.added must contain only positive integers")
        .optional()
        .isInt({ min: 1 }),
    (0, express_validator_1.body)("unit.removed", "unit.removed must be an array of positive integers")
        .optional()
        .isArray(),
    (0, express_validator_1.body)("unit.removed.*", "unit.removed must contain only positive integers")
        .optional()
        .isInt({ min: 1 }),
]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const jobId = Number(req.params.job_id);
    const addedUnitIds = ((_b = (_a = req.body.unit) === null || _a === void 0 ? void 0 : _a.added) !== null && _b !== void 0 ? _b : []).map(Number);
    const removedUnitIds = ((_d = (_c = req.body.unit) === null || _c === void 0 ? void 0 : _c.removed) !== null && _d !== void 0 ? _d : []).map(Number);
    const hasName = Object.prototype.hasOwnProperty.call(req.body, "name");
    const hasUnitChanges = addedUnitIds.length > 0 || removedUnitIds.length > 0;
    if (!hasName && !hasUnitChanges) {
        return res.status(400).json({
            is_success: false,
            errors: [["body", "Provide name or unit changes to update"]],
        });
    }
    const transaction = yield db_1.sequelize.transaction();
    try {
        const job = yield db_1.Job.findByPk(jobId, { transaction });
        if (!job) {
            yield transaction.rollback();
            return res.status(404).json({
                is_success: false,
                errors: [["job_id", "Job not found"]],
            });
        }
        const unitIds = [...addedUnitIds, ...removedUnitIds];
        const { units, missingUnitIds } = yield findUnitsByIds(unitIds);
        if (missingUnitIds.length > 0) {
            yield transaction.rollback();
            return res.status(404).json({
                is_success: false,
                errors: [["unit", `Units not found: ${missingUnitIds.join(", ")}`]],
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
        return res.status(500).json({
            is_success: false,
            errors: [["server", "Failed to update job"]],
        });
    }
}));
router.post("/:job_id/units", (0, validate_1.validate)([
    (0, express_validator_1.param)("job_id", "job_id must be a positive integer").isInt({ min: 1 }),
    (0, express_validator_1.body)("unit_id", "unit_id must be a positive integer").isInt({ min: 1 }),
]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jobId = Number(req.params.job_id);
    const unitId = Number(req.body.unit_id);
    try {
        const [job, unit] = yield Promise.all([
            db_1.Job.findByPk(jobId),
            db_1.Unit.findByPk(unitId),
        ]);
        if (!job) {
            return res.status(404).json({
                is_success: false,
                errors: [["job_id", "Job not found"]],
            });
        }
        if (!unit) {
            return res.status(404).json({
                is_success: false,
                errors: [["unit_id", "Unit not found"]],
            });
        }
        yield job.addUnit(unit);
        return res.status(201).json({
            is_success: true,
            data: {
                job_id: jobId,
                unit_id: unitId,
            },
        });
    }
    catch (error) {
        console.error("Failed to associate job with unit:", error);
        return res.status(500).json({
            is_success: false,
            errors: [["server", "Failed to associate job with unit"]],
        });
    }
}));
exports.default = router;

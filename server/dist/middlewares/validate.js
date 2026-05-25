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
exports.validate = void 0;
const validate = (validations) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = [];
        for (const validation of validations) {
            const result = yield validation.run(req);
            if (!result.isEmpty()) {
                errors.push(...result
                    .array()
                    .map((error) => {
                    var _a;
                    return [
                        (_a = error === null || error === void 0 ? void 0 : error.path) !== null && _a !== void 0 ? _a : "unknown",
                        error.msg,
                    ];
                }));
            }
        }
        if (errors.length > 0) {
            return res.status(400).json({
                is_success: false,
                errors,
            });
        }
        next();
    });
};
exports.validate = validate;

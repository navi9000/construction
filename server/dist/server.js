"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const units_1 = __importDefault(require("./routes/units"));
const jobs_1 = __importDefault(require("./routes/jobs"));
const entries_1 = __importDefault(require("./routes/entries"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/units", units_1.default);
app.use("/jobs", jobs_1.default);
app.use("/entries", entries_1.default);
app.get("/", (req, res) => {
    res.json({
        is_success: true,
        message: "Hello world",
    });
});
exports.default = app;

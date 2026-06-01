"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const formatZodError_1 = require("../utils/formatZodError");
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                res.status(400).json({ error: (0, formatZodError_1.formatZodError)(error) });
                return;
            }
            res.status(400).json({ error: 'Validation failed' });
        }
    };
};
exports.validate = validate;

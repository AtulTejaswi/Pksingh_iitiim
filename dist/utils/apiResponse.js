"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const successResponse = (data) => {
    return {
        success: true,
        data,
    };
};
exports.successResponse = successResponse;
const errorResponse = (error) => {
    return {
        success: false,
        error,
    };
};
exports.errorResponse = errorResponse;

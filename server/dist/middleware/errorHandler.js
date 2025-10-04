"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    if (err instanceof mongoose_1.Error.ValidationError) {
        const messages = Object.values(err.errors).map(e => e.message);
        res.status(400).json({ message: messages.join(', ') });
        return;
    }
    if (err.code === 11000 && err.keyPattern) {
        const field = Object.keys(err.keyPattern)[0];
        res.status(400).json({ message: `${field} already exists` });
        return;
    }
    if (err.name === 'JsonWebTokenError') {
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
    if (err.name === 'TokenExpiredError') {
        res.status(401).json({ message: 'Token expired' });
        return;
    }
    res.status(err.statusCode || 500).json({
        message: err.message || 'Server Error'
    });
};
exports.default = errorHandler;

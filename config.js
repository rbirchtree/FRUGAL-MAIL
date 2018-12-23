'use strict';
exports.DATABASE_URL =
    process.env.MONGODB_URI ||
    global.DATABASE_URL; 
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY;

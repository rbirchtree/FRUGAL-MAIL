'use strict';
exports.DATABASE_URL =
    process.env.MONGODB_URI ||
    global.DATABASE_URL ||
    'mongodb://admin:password@ds229549.mlab.com:29549/fru';
    global.TEST_DATBASE_URL || 'mongodb://admin:admin@ds257579.mlab.com:57579/tester'
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY;

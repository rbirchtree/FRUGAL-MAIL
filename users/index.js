'use strict';
const {User, Mail} = require('./models');
const {router} = require('./router');
const {mailRouter} = require('./mailRouter');
module.exports = {User, router, mailRouter};
//get rid of index file
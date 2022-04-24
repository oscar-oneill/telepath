require('dotenv').config()
const snoowrap = require("snoowrap");

const otherRequester = new snoowrap({
    userAgent: process.env.userAgent,
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    username: process.env.username,
    password: process.env.password,
});

module.exports = otherRequester
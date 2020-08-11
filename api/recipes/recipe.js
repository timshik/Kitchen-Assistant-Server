const express = require("../../server/server").express;
const app = require("../../server/server").server;
const utils = require("../../server/server").utils;
const router = express.Router();
const user = require("../../modules/user/user").object;




module.exports = {
    api: router
}
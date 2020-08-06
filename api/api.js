const express = require("../server/server").express;
const app = require("../server/server").server;
const router = express.Router();
const user = require("./users/user").user_api;

router.use("/user", user);

module.exports = {
    router: router
}
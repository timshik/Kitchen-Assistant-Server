const express = require("../../server/server").express;
const app = require("../../server/server").server;
const utils = require("../../server/server").utils;
const router = express.Router();
const user = require("../../modules/user/user").object;

router.post('/login', function(request, response) {
    user.login(request.body.email, request.body.password, response)
});

router.post('/register', function(request, response) {
    user.register(request.body.email, request.body.password, response);
});

module.exports = {
    user_api: router
}
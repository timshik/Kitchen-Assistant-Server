const express = require("../../server/server").express;
const app = require("../../server/server").server;
const utils = require("../../server/server").utils;
const router = express.Router();
const user = require("../../modules/user/user").object;

// router.param('name', function(request, response, next, name) {
//     request.name = name;
//     next();
// })

router.post('/login', function(request, response) {
    let res = utils.error("EMAIL_PASSWORD_INCORRECT");
    if (user.login(request.body.email, request.body.password)) {
        res = utils.success(true);
    }

    response.status(res.status);
    response.send(res);
});

router.post('/register', function(request, response) {
    let res = utils.error("EMAIL_OR_PASSWORD_ALREADY_EXISTS");
    if (result = user.register(request.body.email, request.body.password)) {
        res = utils.success(result);
    }

    response.status(res.status);
    response.send(res);
});

module.exports = {
    user_api: router
}
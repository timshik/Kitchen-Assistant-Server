const express = require("../../server/server").express;
const app = require("../../server/server").server;
const router = express.Router();

router.param('name', function(request, response, next, name) {
    request.name = name;
    next();
})

router.get('/add/:name', function(request, response) {
    response.send("in add user: " + request.name);
});

router.get('/login', function(request, response) {
    console.log("here");
    response.send("In login, " + JSON.parse(request)); 
});

module.exports = {
    user_api: router
}
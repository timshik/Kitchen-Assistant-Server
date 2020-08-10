const express = require("../server/server").express;
const app = require("../server/server").server;
const router = express.Router();
const user = require("./users/user").user_api;
const recipes = require("./recipes/recipe").api;

router.use("/user", user);
router.use("/recipes", recipes);

module.exports = {
    router: router
}
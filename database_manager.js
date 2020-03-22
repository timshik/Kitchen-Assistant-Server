
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "81.19.215.6",
    user: "idohayun_kitchenapp",
    database: "idohayun_kitchenapp",
    password: "q7dP$)@aC5KQ"
});

module.exports = {
    db: con
}
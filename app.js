const client = require('./db/database_manager').client;
var cors = require('cors');
var app = require("./server/server").server;
var api = require("./api/api").router;

app.get('/', function (req, res) {
    client.connect(function(err, client) {
        if (err) {
            res.send({
                "database connection" : "failed",
                "error" : err.name,
                "error msg" : err.message
            });
        } else {
            res.send({
                "database connection" : "success",
            })
        }
    })
});

app.use('/api', api);

app.get('/help', function (req, res) {
    res.send({ page: 'help', result: 'kitchen helper'});
});
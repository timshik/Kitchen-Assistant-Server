// in sublime
var cors = require('cors');
const client = require('./database_manager').client;
var express = require('express');
var port = process.env.PORT || 3000;
var app = express();

app.use(cors())

app.get('/', function (req, res) {
    client.connect(function(err, client) {
        if (err) {
            res.send(JSON.stringify({
                "database connection" : "failed",
                "error" : err
            }));
        } else {
            res.send(JSON.stringify({
                "database connection" : "success",
            }))
        }
    })
});

app.get('/help', function (req, res) {
    res.send({ page: 'help', result: 'kitchen helper'});
});

app.listen(port, function () {
    console.log('Example app listening on port !');
});
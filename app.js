// in sublime
var cors = require('cors');
const database = require('./database_manager').db;
var express = require('express');
var port = process.env.PORT || 3000;
var app = express();

database.connect(function(err) {
    if (err) 
        console.log("Not connected, error: " + err);
    console.log("Connected!");
});

app.use(cors())

app.get('/', function (req, res) {
    res.send({ Hello: 'World'});
});

app.get('/help', function (req, res) {
    res.send({ page: 'help', result: 'kitchen helper'});
});

app.listen(port, function () {
    console.log('Example app listening on port !');
});
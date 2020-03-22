// in sublime
var cors = require('cors');
const database = require('./database_manager');
var express = require('express');
var port = process.env.PORT || 3000;
var app = express();

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
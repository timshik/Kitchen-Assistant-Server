const client = require('./db/database_manager').client;
var cors = require('cors');
const bodyParser = require('body-parser');
const { request } = require('express');
const { utils } = require('./server/server');
var app = require("./server/server").server;
var api = require("./api/api").router;

app.get('/', function (req, res) {
    client(function(err, client) {
        if (err) {
            utils.error(res, err.message);
            return;
        }
        utils.success(res, {'message' : 'Connected to DB finish successfully! All API paramters are OK!'});
    })
});

// Parse application json requests
app.use(bodyParser.json());

// Middleware function
app.use(function (req, res, next) {
    //TODO add token for defined users in API ?? 
    next();
});

app.use('/api', api);
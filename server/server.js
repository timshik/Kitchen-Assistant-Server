const express = require('express');
const app = express();
var port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log('Example app listening on port !');
});

const utils = {
    error: function(response, text) {
        response.status(400);
        response.send({'error' : text});
    },
    success: function(response, text) {
        response.status(200);
        response.send(text);
    }
}

module.exports = {
    server: app,
    utils: utils,
    express: express
}
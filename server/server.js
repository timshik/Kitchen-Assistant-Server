const express = require('express');
const app = express();
var port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log('Example app listening on port !');
});

const utils = {
    error: function(code) {
        return {
            'error': code,
            'status': 400
        }
    },
    success: function(code) {
        return {
            'error': code,
            'status': 200
        }
    }
}

module.exports = {
    server: app,
    utils: utils,
    express: express
}
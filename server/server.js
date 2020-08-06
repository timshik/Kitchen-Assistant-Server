const express = require('express');
const app = express();
var port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log('Example app listening on port !');
});

module.exports = {
    server: app,
    express: express
}
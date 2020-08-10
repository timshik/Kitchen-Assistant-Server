const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const assert = require('assert');
require('dotenv').config()
// Connection URL

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const manager = mongoose.connection;
manager.on('error', console.error.bind(console, 'connection error: '));
const dbManager = function(callback) {
    manager.once('open', callback);
}

module.exports = {
    client: dbManager,
    manager: manager,
}
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const assert = require('assert');
require('dotenv').config()

// Some technical and ewuuu code, defined some parameters to DB connections
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const manager = mongoose.connection;
manager.on('error', console.error.bind(console, 'connection error: '));
const dbManager = function(callback) {
    manager.once('open', callback);
}

module.exports = {
    client: dbManager,
    mongoose: mongoose, // using to defined new Schemes
    manager: manager,   // using to send\recieve data from DB (accessable to 'collection' object)
}//"hi"
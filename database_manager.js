const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
require('dotenv').config()
// Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

module.exports = {
    client: client
}
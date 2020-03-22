const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
 
// Connection URL
const uri = "mongodb://heroku_bh9rr17h:kitchen_assistant3@ds119060.mlab.com:19060/heroku_bh9rr17h";
const client = new MongoClient(uri);


module.exports = {
    client: client
}
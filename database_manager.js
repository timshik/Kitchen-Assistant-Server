const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
 
// Connection URL
const uri = "mongodb://heroku_bh9rr17h:kitchen_assistant3@ds119060.mlab.com:19060/heroku_bh9rr17h";
const client = new MongoClient(uri);
client.connect();
// // Use connect method to connect to the server
// MongoClient.connect(uri, function(err, client) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");
 
//   const db = client.db(dbName);
 
//   client.close();
// });
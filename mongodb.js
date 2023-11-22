const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);
const database = "cafe";

async function dbConnect() {
  let result = await client.connect();
  let db = result.db(database);
  let collection = db.collection("dish");
  return collection;
}

module.exports = dbConnect;

const { MongoClient, ObjectID } = require("mongodb");
const uri = "mongodb://localhost/";
const client = new MongoClient(uri, { useUnifiedTopology: true });
client.connect();
const db = client.db('og-bot');

module.exports = {
    client: MongoClient,
    ObjectID: ObjectID,
    database: db,
    collections: {
        karmaSetup: db.collection("karmaSetup"),
        karmaData: db.collection("karmaData")
    }
    
}

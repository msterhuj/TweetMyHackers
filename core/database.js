const Hacker = require('./hacker').Hacker;

class database {

    constructor() {
        this.mongodb = require('mongodb');
        this.mongoUrl = "mongodb://localhost:27017";
        this.mongoClient = undefined;
    }

    connect() {
        return this.mongodb.MongoClient.connect(this.mongoUrl);
    }

    manager() {
        return this.mongoClient.db("TweetMyHacker").collection('hackers');
    }

    /*
        create hacker in db if not exist
        @param ip, session
     */
    createHacker(ip, session) {
        this.manager().findOne({ip: ip}, (err, result) => {
            if (!err && !result) {
                var hacker = new Hacker();
                hacker.session = session;
                hacker.ip = ip;
                this.manager().insertOne(hacker)
                console.log("Registered new hacker : ip -> " + hacker.ip + " session -> " + hacker.session)
            }
        })
    }

}
module.exports.mongo = database;
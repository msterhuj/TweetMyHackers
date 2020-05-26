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

    updateCredentials(ip, user, pass) {
        this.manager().findOne({ip: ip}, (err, result) => {
            if (!err && result) {
                this.manager().updateOne({ip: ip}, {$set: {user: user, pass: pass}});
                console.log("Updated with credential this ip -> " + result.ip);
            }
        })
    }

    runnedCommands(ip) {
        this.manager().findOne({ip: ip}, (err, result) => {
            if (!err && result) {
                var next = result.commandsCounter + 1;
                this.manager().updateOne({ip: ip}, {$set: {commandsCounter: next}});
                console.log("Updated command counter for this ip -> " + result.ip);
            }
        })
    }

    finish(ip, duration) {
        this.manager().findOne({ip: ip}, (err, result) => {
            if (!err && result) {
                var hacker = result
                hacker.sessionTime = duration;
                this.manager().removeOne({ip: ip}, (err, result) => {})
                this.tweetIt(hacker)
            }
        })
    }

    tweetIt(hacker) {
        console.log(hacker)
    }
}
module.exports.mongo = database;

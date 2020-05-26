const TailingReadableStream = require('tailing-stream');
const stream = TailingReadableStream.createReadStream('./log.json', {timeout: 0});

const database = require('./core/database')

var mongo = new database.mongo()

mongo.connect().then((client) => {
    mongo.mongoClient = client;
    execute();
});

function execute() {
    console.log("Watching file...")
    stream.on('data', buffer => {

        var data = JSON.parse(buffer.toString());
        console.log(data)
        switch (data.eventid) {
            case "cowrie.session.connect":
                // if hacker dosent exist create
                mongo.createHacker(data.src_ip, data.session)
                break;
            case "cowrie.session.closed":
                // delete hacker and tweet !
                break;
            case "cowrie.login.success":
                mongo.updateCredentials(data.src_ip, data.username, data.password)
                break;
            case "cowrie.login.failed":
                // what is possible ?
                break;
            case "cowrie.command.input":
                // count number of commands
                break;
            default:
                console.log("Other Events");
        }
    });
}

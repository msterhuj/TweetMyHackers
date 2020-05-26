class Hacker {

    constructor() {
        this.session = undefined;
        this.ip = undefined;
        this.user = undefined;
        this.pass = undefined;
        this.commandsCounter = 0;
        this.sessionTime = undefined;
    }
}
module.exports.Hacker = Hacker;

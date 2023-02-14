import * as colors from "colors";
import moment from "moment";
function getTime() {
    return moment().format("LLL");
}
export class Log {
    constructor(openned) {
        if (typeof openned !== "boolean") throw new Error("Value must be boolean");
        this.openned = openned;
    }
    message(message) {
        if (this.openned == false) return;
        console.log(`${`[${getTime()}]`.gray}${"[MESSAGE]".green} ${message}`);
    }
    log(message) {
        if (this.openned == false) return;
        console.log(`${`[${getTime()}]`.gray}${"[LOG]".yellow} ${message}`);
    }
    error(message) {
        if (this.openned == false) return;
        console.log(`${`[${getTime()}]`.gray}${"[ERROR]".red} ${message}`);
    }
}

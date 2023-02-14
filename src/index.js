const node_version = process.versions.node.split('.')[0];
if (node_version < 16) throw new Error('Requires Node 16 (or higher)');
else {
    const { Database } = (await import("nukleon")) // * Database Module
    const { Log } = (await import("./Builds/log.js"))  // * Logging
    const db = new Database("./database.json") // * Database
    globalThis.logger = new Log(new Database("./.settings.json").get("logging"));

    void async function () {
        await db.set("clientReady", "false"); if (!await db.get("wsPing")) await db.set("wsPing", "[]"); // * For WebServer
        (await import("dotenv/config")); // * ENV
        (await import("./Client/index.js")); // * STARTS CLIENT
        (await import("./Web/index.js")); // * WEB MANAGER
        (await import("./Builds/yotubeReminder.js")) // * YOTUBE REMINDER
    }();

}


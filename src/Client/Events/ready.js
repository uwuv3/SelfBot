const { Database } = (await import("nukleon")) // * Database Module
const db = new Database("./database.json");
const config = new Database("./.settings.json");
const { default: moment } = (await import("moment"));
client.on("ready", async () => {
    db.set("clientReady", "true");

    await client.user.setStatus("online")
    let token = await config.get("client").token
    if (!token || token?.length < 1) token = process.env["token"];
    if (!token || token?.length < 1) token = undefined//throw new Error("No token specified"); // TODO: after update will add normalLogin
    if (token) {
        logger.log(`LoginToken => Logged in as ${client.user.tag}`)
    } else logger.log(`NormalLogin => Logged in as ${client.user.tag}`);
    setInterval(async () => {
        const maxPing = await config.get("client").maxPing
        const old = JSON.parse(await db.get("wsPing")) ?? []
        const a = old[0] ?? { ping: 0, color: "#FFFFFF", date: "u1" }
        const b = old[1] ?? { ping: 0, color: "#FFFFFF", date: "u2" }
        const c = old[2] ?? { ping: 0, color: "#FFFFFF", date: "u3" }
        const d = old[3] ?? { ping: 0, color: "#FFFFFF", date: "u4" }
        const e = old[4] ?? { ping: 0, color: "#FFFFFF", date: "u5" }
        if ((Date.now() - parseInt(await db.get("lastCheck") ?? 0)) >= 300000) {
            let ping = client.ws.ping
            let color = "#FFFFFF"
            if (isNaN(ping)) ping = 0
            if (ping < maxPing / 4) color = "#3EFF00"

            if (ping > maxPing / 4 && ping < maxPing / 2 - 1) color = "#F7FF00"

            if (ping > maxPing / 2 && ping < maxPing) color = "#FF0000"

            await db.set("wsPing", JSON.stringify([b, c, d, e, { ping: ping, color: color, date: moment().format("MMMM Do h:mm:ss a") }]))
            await db.set("lastCheck", Date.now())
        }
    }, 5000)
});

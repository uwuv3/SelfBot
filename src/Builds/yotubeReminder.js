import { Util, WebhookClient } from "discord.js-selfbot-v13";

const { Database } = (await import("nukleon")),
    { default: Parser } = (await import("rss-parser")),
    config = new Database("./.settings.json"),
    database = new Database("./database.json"),
    configclient = config.get("client"),
    configyoutubereminder = config.get("youtubeReminder")
    , optTypes = ["console", "channel", "webhook"],
    parse = new Parser();
void async function () {
    if (configyoutubereminder.enabled !== true) return;
    configyoutubereminder.options.forEach(async (opt) => {
        if (!optTypes.includes(opt.type)) throw new Error("Unknown type: " + opt.type);
        if (opt.type !== optTypes[0] && !opt.typeReq) throw new Error("Missing typeReq");
        if (!opt.youtubeID) throw new Error("Missing youtubeID");
        if (opt.type === optTypes[0]) {
            if (!database.get(`youtubeReminder_${opt.type}_${opt.youtubeID}`)) await database.set(`youtubeReminder_${opt.type}_${opt.youtubeID}`, "[]")
            await consoleLogging(opt)
            setInterval(async () => await consoleLogging(opt), configyoutubereminder.everySync)
        }
        if (opt.type === optTypes[1]) {
            if (!database.get(`youtubeReminder_${opt.type}_${opt.youtubeID}`)) await database.set(`youtubeReminder_${opt.type}_${opt.youtubeID}`, "[]")
            if (configclient.enabled === false) throw new Error("Client is not enabled")
            await channelLogging(opt, opt.typeReq)
            setInterval(async () => await consoleLogging(opt), configyoutubereminder.everySync)
        }
        if (opt.type === optTypes[2]) {
            if (!database.get(`youtubeReminder_${opt.type}_${opt.youtubeID}`)) await database.set(`youtubeReminder_${opt.type}_${opt.youtubeID}`, "[]")
            await webhookLogging(opt, opt.typeReq)
            setInterval(async () => await webhookLogging(opt), configyoutubereminder.everySync)
        }
    })
}();
async function webhookLogging(opt, webhookURL) {
    let db = JSON.parse(database.get(`youtubeReminder_${opt.type}_${opt.youtubeID}`)) ?? [];
    const webhook = new WebhookClient({ url: webhookURL ?? opt.typeReq })
    if (!webhook) throw new Error("Webhook not found")
    const request = parse.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${opt.youtubeID}`)
    request.then(async response => {
        if (db.includes(response.items[0].link)) return;
        const data = response.items[0];
        db.push(data.link);
        database.set(`youtubeReminder_${opt.type}_${opt.youtubeID}`, JSON.stringify(db))
        await webhook.send(opt.message.replace(/{author}/g, data.author)
            .replace(/{title}/g, Util.escapeMarkdown(data.title))
            .replace(/{url}/g, data.link))

    });
    request.catch(error => { logger.error(`YotubeReminder => ${opt.id} => ${error}`) });
}
async function channelLogging(opt, channelID) {
    if (database.get("clientReady") === false) return;
    const channel = await client.channels.cache.get(channelID ?? opt.typeReq)
    if (!channel) throw new Error("Channel not found");
    let db = JSON.parse(database.get(`youtubeReminder_${opt.type}_${opt.youtubeID}`)) ?? []
    const request = parse.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${opt.youtubeID}`)
    request.then(response => {
        if (db.includes(response.items[0].link)) return;
        const data = response.items[0];
        db.push(data.link);
        database.set(`youtubeReminder_${opt.type}_${opt.youtubeID}`, JSON.stringify(db))
        channel.send(opt.message.replace(/{author}/g, data.author)
            .replace(/{title}/g, Util.escapeMarkdown(data.title))
            .replace(/{url}/g, data.link))

    });
    request.catch(error => { logger.error(`YotubeReminder => ${opt.id} => ${error}`) });

}
async function consoleLogging(opt) {
    let db = JSON.parse(database.get(`youtubeReminder_${opt.type}_${opt.youtubeID}`)) ?? []
    const request = parse.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${opt.youtubeID}`)
    request.then(response => {
        if (db.includes(response.items[0].link)) return;
        const data = response.items[0];
        db.push(data.link);
        database.set(`youtubeReminder_${opt.type}_${opt.youtubeID}`, JSON.stringify(db))
        console.log(opt.message.replace(/{author}/g, data.author)
            .replace(/{title}/g, Util.escapeMarkdown(data.title))
            .replace(/{url}/g, data.link))

    });
    request.catch(error => { logger.error(`YotubeReminder => ${opt.id} => ${error}`) });
}




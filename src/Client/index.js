const { Database } = (await import("nukleon"));
const { Client, Collection } = (await import("discord.js-selfbot-v13"));
const { readdirSync } = (await import("fs"));
const config = new Database("./.settings.json");
const configclient = await config.get("client")
if (configclient.enabled === false) logger.log("Disabled Client manager")
let token = configclient.token
if (!token || token?.length < 1) token = process.env["token"];
if (!token || token?.length < 1) token = undefined//throw new Error("No token specified"); // TODO: after update will add normalLogin
const client = new Client(await configclient.clientOptions ?? undefined)
void async function () {
    await client.checkUpdate();
    await client.customStatusAuto(client);
}();

globalThis.commands = new Collection();
globalThis.client = client
if (configclient.enabled === true && configclient.eventLoader === true) (await eventLoader())
if (configclient.enabled === true && configclient.commandLoader === true) (await commandLoader())
async function eventLoader() {
    readdirSync(`./src/Client/Events/`).forEach(async (file) => {
        if (!file.endsWith(".js")) return;
        const eventFile = (await import(`./Events/${file}`))
        logger.log(`EventLoader => Loaded event => ${file}`);
    });
}
async function commandLoader() {
    readdirSync(`./src/Client/Commands/`).forEach((folder) => {
        try {
            if (folder.endsWith(".js")) return;
            readdirSync(`./src/Client/Commands/${folder}`).forEach((file) => {
                if (!file.endsWith(".js")) return;
                import(`./Commands/${folder}/${file}`).then((f) => {
                    const command = f.default;
                    if (!command.name) return logger.error(`CommandLoader => ${file} has not command name`);
                    commands.set(command.name, command);
                    logger.log(`CommandLoader => Loaded command => ${file}`);
                });
            });
        } catch (error) {
            logger.error("CommandLoader => " + error);
        }
    });

}
if (configclient.enabled === true && token?.length > 1) {
    client.login(token).then(_ => {
        logger.log(`LoginToken => Trying to login with token`)
    }).catch(error => {
        logger.error(`LoginToken => Failed to login with token => ${error}`);
    });
} else if (configclient.enabled === true && process.env["normalLogin"]) {
    const log = process.env["normalLogin"].split(":");
    client.normalLogin(log[0], log[1]).then(_ => {
        logger.log(`NormalLogin => Trying to login with env`)
    }).catch(error => {
        logger.error(`NormalLogin => Failed to login with env => ${error}`);
    });
}
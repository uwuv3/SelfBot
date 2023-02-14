const { Database } = (await import("nukleon"));
const config = new Database("./.settings.json");
const clientconfig = config.get("client");
const prefix = clientconfig.prefix
const admins = clientconfig.admins
client.on("messageCreate", async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const [cmd, ...args] = message.content
        .slice(prefix.length)
        .trim()
        .split(" ");
    const command = commands.get(cmd.toLocaleLowerCase()) || commands.find(c => c.aliases?.includes(cmd.toLocaleLowerCase()))
    if (!command) return
    let blocked = false
    if (command.adminOnly) {
        if (!admins.includes(message.author.id)) blocked = true
    }
    if (message.author.id === client.user.id) blocked = false
    if (blocked) return
    try {
        logger.log(`CommandHandler => Used command => ${command.name}`)
        await command.callback(client, message, args);
    } catch (error) {
        logger.error(`CommandHandler => ${error}`)
    }
});

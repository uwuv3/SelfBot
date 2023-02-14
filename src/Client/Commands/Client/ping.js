import { MessageEmbed, WebEmbed } from "discord.js-selfbot-v13";
import { Database } from "nukleon";
const config = new Database("./.settings.json");
export default {
    name: "ping",
    aliases: ["ping"],
    adminOnly: true,
    /**
     *
     * @param {import("discord.js-selfbot-v13").Client} client
     * @param {import("discord.js-selfbot-v13").Message} message
     * @param {String[]} args
     */
    async callback(client, message, args) {
        const maxPing = config.get("client").maxPing
        const oldDate = new Date();
        let color = "BLACK";
        if (client.ws.ping < maxPing / 4) color = "GREEN";
        if (client.ws.ping > maxPing / 4 && client.ws.ping < maxPing / 2) color = "YELLOW";
        if (client.ws.ping > maxPing) color = "RED";
        if (message.editable) await message.edit("Sending ping");
        else {
            const msg = message.channel.send("Sending ping");
            setTimeout(async () => {
                (await msg).delete();
            }, 1000);
        }
        if (!message.guild)
            if (message.editable)
                await message.edit({
                    content: `Ping verilerim böyledir`,
                    embeds: [
                        new WebEmbed()
                            .setDescription(
                                `Websocket ping :<b>${client.ws.ping}ms</b>\nApi ping :<b>${new Date() - oldDate
                                }ms</b>`
                            )
                            .setAuthor({
                                name: message.author.tag,
                                iconURL: message.author.avatarURL({ dynamic: true }),
                            })
                            .setColor(color),
                    ],
                });
            else
                await message.channel.send({
                    content: `Ping verilerim böyledir`,
                    embeds: [
                        new WebEmbed()
                            .setDescription(
                                `Websocket ping :<b>${client.ws.ping}ms</b>\nApi ping :<b>${new Date() - oldDate
                                }ms</b>`
                            )
                            .setAuthor({
                                name: message.author.tag,
                                iconURL: message.author.avatarURL({ dynamic: true }),
                            })
                            .setColor(color),
                    ],
                });
        else if (message.member.permissions.has("EMBED_LINKS"))
            if (message.editable)
                await message.edit({
                    content: `Ping verilerim böyledir`,
                    embeds: [
                        new WebEmbed()
                            .setDescription(
                                `Websocket ping :<b>${client.ws.ping}ms</b>\nApi ping :<b>${new Date() - oldDate
                                }ms</b>`
                            )
                            .setAuthor({
                                name: message.author.tag,
                                iconURL: message.author.avatarURL({ dynamic: true }),
                            })
                            .setColor(color),
                    ],
                });
            else {
                if (message.deletable) message.delete();
                await message.channel.send({
                    content: `Ping verilerim böyledir`,
                    embeds: [
                        new WebEmbed()
                            .setDescription(
                                `Websocket ping :<b>${client.ws.ping}ms</b>\nApi ping :<b>${new Date() - oldDate
                                }ms</b>`
                            )
                            .setAuthor({
                                name: message.author.tag,
                                iconURL: message.author.avatarURL({ dynamic: true }),
                            })
                            .setColor(color),
                    ],
                });
            }
        else if (message.editable)
            await message.edit({
                content: `Ping verilerim böyledir\nApi ping :${client.ws.ping
                    }ms\nApi ping :${new Date() - oldDate}`,
            });
        else
            await message.edit({
                content: `Ping verilerim böyledir\nApi ping :<b>${client.ws.ping
                    }ms</b>\nApi ping :${new Date() - oldDate}`,
            });
    },
};

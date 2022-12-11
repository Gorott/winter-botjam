module.exports = {
        name: "ping",
        description: "Replies with bot ping.",
        run: async (interaction, client) => {
           interaction.reply(`I am online! ${Math.ceil(interaction.client.ws.ping)} ms.`)
        },
}
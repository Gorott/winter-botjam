const { players } = require("../db.js");

module.exports = (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;
            const player = await players.findOne({ user: interaction.user.id });
            if (!player && interaction.commandName != "start") return interaction.reply("You haven't started your snow shoveling adventure yet! Use `/start` to start your adventure.");
            try {
                await command.run(interaction, client, player);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
            }
        }
    });
}
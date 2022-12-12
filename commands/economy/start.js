const { players } = require("../../db.js");

module.exports = {
    name: "start",
    description: "Start your snow shoveling adventure.",
    run: async (interaction, client, player) => {
        if (player) return interaction.reply("You have already started your snow shoveling adventure!");
        player = await players.create({ user: interaction.user.id });
        await client.utils.AddItem(player, "shovel", 1);
        interaction.reply(`You have started your snow shoveling adventure!\nUse \`/guide\` to learn how to play.`);
    },
}
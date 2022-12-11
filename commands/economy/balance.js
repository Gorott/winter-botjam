const { players } = require("../../db.js");

module.exports = {
    name: "balance",
    description: "View your or someone else their balance.",
    options: [
        {
            name: "user",
            description: "The user you want to view the balance of.",
            required: false,
            type: 6,
        }
    ],
    run: async (interaction, client, user) => { 
        const target = interaction.options.getUser("user") || interaction.user;
        const player = await players.findOne({ user: target.id });
        if (!player) return interaction.reply("That user hasn't started their snow shoveling adventure yet!");
        const embed = {
            title: `${target.username}'s balance`,
            description: `**Wallet:** ${player.money.balance}\n**Bank:** ${player.money.bank}\n\n**Total:** ${player.money.balance + player.money.bank}`,
        }

        interaction.reply({ embeds: [embed] });
    }
}

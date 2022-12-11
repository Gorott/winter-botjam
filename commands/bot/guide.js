module.exports = {
    name: "guide",
    description: "View a detailed guide on how to play.",
    run: async (interaction, client) => {
        let embed = {
            title: "Snow Shoveling Guide",
            description: "Welcome to Snow Shoveling Simulator, in this guide you will learn the basics of the game.",
            fields: [
                {
                    name: "Basics",
                    value: "To start of your adventure use the \`/start\` command. This will give you a shovel. You can use the \`/shovel\` command to shovel snow and gain snowballs or find rare items. You can sell items with the \`/sell\` and use the snowballs on other players by using \`/throw\`, if you do so there is a small chance you will steal money or items from them.\n You can spend your money by using the \`/shop\` command to buy items and or upgrades. You can use the \`/inventory\` command to view your inventory and \`/profile\` to view your profile.",
                },
            ]
        };

        interaction.reply({ embeds: [embed] });
    }
}
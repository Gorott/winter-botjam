const items = require("../../data/items.js");

module.exports = {
    name: "upgrade",
    description: "Purchase upgrades.",
    options: [
        {
            name: "item",
            description: "The item you want to buy an upgrade for.",
            required: true,
            type: 3,
            choices: items.map((item) => item.upgrades ? ({ name: item.name, value: item.id }) : null).filter((item) => item !== null),
        },
    ],
    run: async (interaction, client, player) => {
        const item = interaction.options.getString("item"); 

        let row = { type: 1, components: [] };
        let upgrades = items.find((i) => i.id === item).upgrades;
        let embed = {
            title: `${items.find((i) => i.id === item).name} upgrades`,
            description: upgrades.map((upgrade) => {
                const upgradeLevel = player.upgrades[item][upgrade.type.toLowerCase()];
                return `**${upgrade.type}: ${upgradeLevel}/${upgrade.maxLevel} - ${upgradeLevel >= upgrade.maxLevel ? `MAXED` : `${upgrade.basePrice + (upgrade.basePrice * upgrade.priceMultiplier * upgradeLevel)} coins`}**\n${upgrade.description}`;
            }).join("\n"),
        }

        embed.description += `\n\n**Your balance:** ${player.money.balance}\n\n*Upgrades that are disabled are either maxed out or you don't have enough money.*`;
        for (const upgrade of upgrades) {
            const upgradeLevel = player.upgrades[item][upgrade.type.toLowerCase()];
            let button = { type: 2, style: 1, label: upgrade.type, custom_id: `upgrade_${item}_${upgrade.type.toLowerCase()}`};
            if (upgradeLevel >= upgrade.maxLevel || player.money.balance < upgrade.basePrice + (upgrade.basePrice * upgrade.priceMultiplier)) {
                button.disabled = true;
            }
            row.components.push(button);
        }


        interaction.reply({ embeds: [embed], components: [row] });
        let filter = (i) => i.isButton() === true
        let collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on("collect", async (button) => {
            if (button.user.id !== interaction.user.id) button.reply({ content: "This is not your button.", ephemeral: true })
            else {
                const upgrade = upgrades.find((upgrade) => upgrade.type.toLowerCase() === button.customId.split("_")[2]);
                const upgradeLevel = player.upgrades[item][upgrade.type.toLowerCase()];
                
                if (upgradeLevel === upgrade.maxLevel || player.money.balance < upgrade.basePrice + (upgrade.basePrice * upgrade.priceMultiplier * player.upgrades[item][upgrade.type.toLowerCase()])) {
                    button.reply({ content: "You can't buy this upgrade.", ephemeral: true });
                } else {
                    player.money.balance -= upgrade.basePrice + (upgrade.basePrice * upgrade.priceMultiplier * player.upgrades[item][upgrade.type.toLowerCase()]);
                    player.upgrades[item][upgrade.type.toLowerCase()]++;
                    button.reply({ content: `You have bought a ${upgrade.type} upgrade for ${items.find((i) => i.id === item).name}.`, ephemeral: true });
                    for (const component of row.components) {
                        component.disabled = true;
                    }
                    await interaction.editReply({ embeds: [embed], components: [row] });
                    await player.save();
                }
            }
        });


        collector.on("end", async () => {
            for (const component of row.components) {
                component.disabled = true;
            }
            await interaction.editReply({ embeds: [embed], components: [row] });
        });
    }
};


module.exports = {
    name: "shovel",
    description: "Shovel some snow.",
    run: async (interaction, client, player) => {
        if (!player.inventory.shovel) return interaction.reply("You don't have a shovel! Use `/shop` to buy one.");
        if (player.cooldowns.shovel > Date.now()) return interaction.reply("You can't shovel snow yet! You can shovel snow again in " + client.utils.formatTime(player.cooldowns.shovel - Date.now()) + ".");
        const random = Math.round((Math.random() * 100) * 10) / 10;
        if (random < 0) {
            const snowballs = Math.floor(Math.random() * 10 + 1) * client.utils.CalculateMultiplier(player.upgrades.shovel.fortune);  
            client.utils.AddItem(player, "snowballs", snowballs);
            interaction.reply(`You found ${snowballs} snowballs!`);
        } else if (random < 90) {
            item = client.utils.PickRandomItem();
            player = await client.utils.AddItem(player, item.id, 1);
        

            const snowballs = Math.floor(Math.random() * 10 + 1) * client.utils.CalculateMultiplier(player.upgrades.shovel.fortune);  
            player = await client.utils.AddItem(player, "snowballs", snowballs);

            interaction.reply("You found a " + item.name + "!, and found " + snowballs + " snowballs!");
        } else if (random < 91 - player.upgrades.shovel.durability * 0.1) {
            player = await client.utils.RemoveItem(player, "shovel", 1);
            interaction.reply("Your shovel broke!");
        }
        player.cooldowns.shovel = Date.now() + 10000 - player.upgrades.shovel.speed * 1000;
        await player.save();


    }
}
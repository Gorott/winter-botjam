const shop = require("../../data/items.js");

module.exports = {
  name: "shop",
  description: "View the shop.",
  options: [
    {
      name: "view",
      description: "View the shop.",
      type: 1,
      options: [
        {
          name: "page",
          description: "The page of the shop.",
          required: false,
          type: 3,
        },
      ],
    },
    {
      name: "buy",
      description: "Buy an item from the shop.",
      type: 1,
      options: [
        {
          name: "item",
          description: "The item you want to buy.",
          required: true,
          type: 3,
          choices: shop.map((item) => ({ name: item.name, value: item.id })),
        },
        {
          name: "amount",
          description: "The amount of items you want to buy.",
          required: false,
          type: 4,
        },
      ],
    },
    {
      name: "sell",
      description: "Sell items you do not want.",
      type: 1,
      options: [
        {
          name: "item",
          description: "The item you want to sell.",
          required: true,
          type: 3,
          choices: shop.map((item) => item.sellable ? ({ name: item.name, value: item.id }) : null).filter((i) => i !== null),
        },
        {
          name: "amount",
          description: "The amount of items you want to sell.",
          required: false,
          type: 4,
        },
      ],
    },
  ],
  run: async (interaction, client, player) => {

    const type = interaction.options.getSubcommand();
    const item = interaction.options.getString("item");
    const amount = interaction.options.getInteger("amount") || 1;
    const itemdata = shop.find((i) => i.id === item);

    switch (type) {
      case "view":
        const page = interaction.options.getString("page") || 1;
        let embeds = [{ fields: [] }];
        for (let shopitem in shop) {
          let item = shop[shopitem];

          if (embeds[embeds.length - 1].fields.length === 5) embeds.push({ fields: [] });
          embeds[embeds.length - 1].fields.push({ name: `${item.name} (${player.inventory[item.id] || 0}) - ${item.price}`, value: item.description });
        }
        if (page > embeds.length) return interaction.reply("That page doesn't exist!");
        await interaction.reply({ embeds: [embeds[page - 1]] });
        client.utils.paginator(interaction, embeds, page - 1);
        break;

      case "buy":
        if (!itemdata) return interaction.reply("That item doesn't exist!");
        if (player.money.balance < itemdata.price * amount) return interaction.reply("You don't have enough money to buy that item!");

        player.money.balance -= itemdata.price * amount;
        player = client.utils.AddItem(player, item, amount);
        await player.save();

        break;
      case "sell":
        if (!itemdata) return interaction.reply("That item doesn't exist!");
        if (!itemdata.sellable) return interaction.reply("You can't sell that item!");
        if (player.inventory[item] == undefined) return interaction.reply("You don't have any of that item to sell!")
        if (player.inventory[item] < amount) return interaction.reply("You don't have enough of that item to sell!");
        player.money.balance += itemdata.price * 0.8 * amount;
        player = client.utils.RemoveItem(player, item, amount);
        await player.save();
        interaction.reply(`You sold ${amount} ${itemdata.name} for ${itemdata.price * 0.8 * amount} coins!`);
        break;
    }
  },
};

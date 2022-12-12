const items = require("./data/items.js");
const { rarities } = require("./data/data.js");
const { players } = require("./db.js");


module.exports = {
    wait,
    formatTime,
    paginator,
    CalculateMultiplier,
    PickRandomItem,
    AddItem,
    RemoveItem,
}

function formatTime(ms) {
    const days = Math.floor(ms / 86400000);
    const hours = Math.floor(ms / 3600000) % 24;
    const minutes = Math.floor(ms / 60000) % 60;
    const seconds = Math.floor(ms / 1000) % 60;
    return `${days ? `${days}d ` : ""}${hours ? `${hours}h ` : ""}${minutes ? `${minutes}m ` : ""}${seconds ? `${seconds}s` : ""}`;
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function paginator(i, embeds, page, addButtons = true) {
    if (embeds.length <= 1) return

    // buttons
    let buttonBegin = { type: 2, style: 3, emoji: { name: "⏪" }, custom_id: "begin", disabled: (page == 0)}
    let buttonBack = { type: 2, style: 3, emoji: { name: "◀" }, custom_id: "back", disabled:  (page == 0)}
    let buttonNext = { type: 2, style: 3, emoji: { name: "▶" }, custom_id: "next", disabled: (page == embeds.length)}
    let buttonEnd = { type: 2, style: 3, emoji: { name: "⏩" }, custom_id: "end", disabled: (page == embeds.length)}

    // rows
    let activeRow = { type: 1, components: [buttonBegin, buttonBack, buttonNext, buttonEnd] }

    // adding buttons
    if (addButtons) i.editReply({ components: [activeRow] })

    // collecting interactions
    let filter = (interaction) => interaction.isButton() === true
    let collector = i.channel.createMessageComponentCollector({ filter, idle: 15 * 1000 })

    let p = --page

    collector.on("collect", async (button) => {
        if (button.user.id !== i.user.id) button.reply({ content: "This is not your message.", ephemeral: true })
        else {
            if (button.customId === "begin") p = 0
            else if (button.customId === "back") p--
            else if (button.customId === "next") p++
            else if (button.customId === "end") p = embeds.length - 1

            buttonBegin.disabled = (p == 0)
            buttonBack.disabled = (p == 0)
            buttonNext.disabled = (p == embeds.length - 1)
            buttonEnd.disabled = (p == embeds.length - 1)

            await button.update({ embeds: [embeds[p]], components: [activeRow] })
        }
    })
    collector.on("end", () => {
        buttonBegin.disabled = true
        buttonBack.disabled = true
        buttonNext.disabled = true
        buttonEnd.disabled = true
        i.editReply({ components: [activeRow] })
    })
}

function CalculateMultiplier(luckLevel) {
    if (luckLevel == 0) return 1;
    const maxMulti = luckLevel + 1;
    const chanceOfFailing = 2 / (luckLevel + 2);
    const remainingChance = 1 - chanceOfFailing;
    const chanceOfMulti = remainingChance / (maxMulti - 1);
    const random = Math.random();

    let multi;
    if (random < chanceOfFailing) {
        multi = 1;
    } else {
        const remainingRandom = random - chanceOfFailing;;
        multi = Math.floor(remainingRandom / chanceOfMulti) + 2;
    }

    return multi;
}

function PickRandomItem() {
    let random = Math.random() * 100;
    while (true) {
        for (const item of items) {
            if (item.rarity != undefined) {
                const probabilty = rarities[item.rarity];
                random -= probabilty;
            }

            if (random <= 0) return item;
        }
    }
}

async function AddItem(player, itemID, amount) {

    player.add(`inventory.${itemID}`, amount);

    const result = await player.save();

    if (result.error) {
        console.log(result.error)
    }

    return player;
}

function RemoveItem(player, itemID, amount) {
    if (player.inventory[itemID] == undefined) {
        return player;
    } else {
        player.inventory[itemID] -= amount;
    }
    return player
}
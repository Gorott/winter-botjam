const items = require("../data/items.js");
const mongoose = require("mongoose");
let list = {};

items.forEach(item => {
    list[item.id] = 0;
})

const schema = new mongoose.Schema({
    user: { type: String, unique: true, required: true },
    money: {
        balance: { type: Number, default: 0 },
        bank: { type: Number, default: 0 },
    },
    inventory: {
        type: Object,
        default: list,
    },
    upgrades: {
        shovel: {
            durability: { type: Number, default: 0 },
            speed: { type: Number, default: 0 },
            fortune: { type: Number, default: 0 },
        },
    },
    cooldowns: {
        shovel: { type: Number, default: 0 },
    }
})


module.exports = mongoose.model("players", schema);
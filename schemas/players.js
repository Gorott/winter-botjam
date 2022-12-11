const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    user: { type: String, unique: true, required: true },
    money: {
        balance: { type: Number, default: 0 },
        bank: { type: Number, default: 0 },
    },
    inventory: {
        snowballs: { type: Number, default: 0 },
        shovel: { type: Number, default: 1 },
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
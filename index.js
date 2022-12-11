console.log("Booting up...");
require("dotenv").config();

const { Client, GatewayIntentBits, Collection} = require("discord.js");
const fs = require("fs");
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,

]});

client.utils = require("./utils.js");

// Slash commands loader
client.commands = new Collection();
let commands = [];

const commandFolders = fs.readdirSync("./commands");
for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith(".js"));
  
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    if (command.name) {
      client.commands.set(command.name, command);
      commands.push(command);
    }
  }
}

// Event loader
let eventsFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"))
for (let file of eventsFiles) {
    require(`./events/${file}`)(client);
}

client.once("ready", async () => {
    console.log("Ready!");
    client.application.commands.set(commands, "1049955824291807274");
})

// Login
client.login(process.env.token);
const fs = require('fs');

const { PermissionsBitField } = require('discord.js');
const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest')
const dotenv = require('dotenv');

function loadCommands(client) {
    let commandsArray = [];
    let developersArray = [];

    const commandsFolder = fs.readdirSync("./commands");
    for(const folder of commandsFolder) {
        const commandFiles = fs.readdirSync(`./commands/${folder}`)
            .filter(file => file.endsWith('.js'));

        for(const file of commandFiles) {
            const commandFile = require(`../commands/${folder}/${file}`);

            client.commands.set(commandFile.data.name, commandFile);

            if(commandFile.developer) {
                developersArray.push(commandFile.data.toJSON());
            } else {
                commandsArray.push(commandFile.data.toJSON());
            }
        }
    }

    client.application.commands.set(commandsArray);

    const developerGuild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID);

    developerGuild.commands.set(developersArray);

    return console.log(`Loaded commands Succesfully!`);


};

module.exports = { loadCommands };
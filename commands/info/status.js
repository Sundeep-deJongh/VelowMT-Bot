const { SlashCommandBuilder, CommandInteraction, EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Bekijk de status van de server.'),

    async execute(interaction, client) {
        try {

        } catch (error) {
            console.log(error);
        }
    }
}
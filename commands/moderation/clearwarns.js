const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { QuickDB } = require("quick.db");
const dotenv = require('dotenv');
const axios = require('axios');
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clearhistory')
        .setDescription('Verwijder de history van een member.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('De member waarvan je de history wilt verwijderen.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('aantal')
                .setDescription('Het aantal dat je wilt verwijderen.')
                .setRequired(true))
                .setDefaultMemberPermissions(PermissionFlagsBits.ManageMembers),

    async execute(interaction, client) {
        try {

            const user = interaction.options.getUser('user');
            const warNum = interaction.options.getInteger('aantal');

            let warns = await db.get(`warns_${user}`);
            let bans = await db.get(`bans_${user}`);
            let kick = await db.get(`kick_${user}`);

            if (warns === null) warns = 0;
            if (bans === null) bans = 0;
            if (kick === null) kick = 0;

            if(warNum > warns) return await interaction.reply({
                content: "Je kan niet meer waarschuwingen verwijderen dan dat de member heeft!",
                ephemeral: true
            });
                

            let afterWarns = await db.sub(`warns_${user}`, warNum);

            const embed = new EmbedBuilder()
                .setColor(process.env.DEFAULT_EMBED_COLOR)
                .setDescription(`**${user.username}** heeft nu **${afterWarns}** waarschuwingen!`);

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });


        } catch (error) {
            console.log(error);
        };
    }
};
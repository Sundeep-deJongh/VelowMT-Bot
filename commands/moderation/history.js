const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { QuickDB } = require("quick.db");
const dotenv = require('dotenv');
const axios = require('axios');
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('history')
        .setDescription('Bekijk de history van een member.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('De member waarvan je de history wil controleren.')
                .setRequired(true))
                .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction, client) {
        try {

            const user = interaction.options.getUser('user');

            let warns = await db.get(`warns_${user}`);
            let bans = await db.get(`bans_${user}`);

            if (warns === null) warns = 0;
            if (bans === null) bans = 0;

            const embed = new EmbedBuilder()
                .setTitle(`History van ${user.username}`)
                .setColor(process.env.DEFAULT_EMBED_COLOR)
                .setThumbnail(process.env.DEFAULT_EMBED_THUMBNAIL)
                .addFields(
                    { name: 'Warns', value: warns + '', inline: false },
                    { name: 'Bans', value: bans + '', inline: false }
                )
                .setFooter({
                    text: 'aanvraag door: ' + interaction.user.username
                })
                .setTimestamp();

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });


        } catch (error) {
            console.log(error);
        };
    }
};
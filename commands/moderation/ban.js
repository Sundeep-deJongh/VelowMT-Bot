const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { QuickDB } = require("quick.db");
const dotenv = require('dotenv');
const axios = require('axios');
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('ban een member van de server.')
        .addUserOption(option =>
            option.setName('member')
                .setDescription('De member die je wilt verbannen.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reden')
                .setDescription('De reden van de ban.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction, client) {
        try {

            const user = interaction.options.getUser('member');
            const reden = interaction.options.getString('reden');
            const guild = interaction.guild;

            if (!reden) reden = 'Geen reden opgegeven.';

            const dmEmbed = new EmbedBuilder()
                .setTitle('Je bent verbannen van VelowMT!')
                .setDescription(`Je bent verbannen door ${interaction.user.username}!\n\nreden: ${reden}`)
                .setColor(process.env.DEFAULT_EMBED_COLOR)
                .setFooter({
                    text: '© VelowMT 2023 - Gemaakt door Sundeep'
                })
                .setTimestamp();

            const embed = new EmbedBuilder()
                .setColor(process.env.DEFAULT_EMBED_COLOR)
                .setDescription(`**${user.username}** is succesvol verbannen met de reden: **${reden}**`);

                const logEmbed = new EmbedBuilder()
                .setTitle('een member is verbannen!')
                .setColor(process.env.DEFAULT_EMBED_COLOR)
                .setThumbnail(process.env.DEFAULT_EMBED_THUMBNAIL)
                .addFields(
                    { name: 'Member', value: user.username, inline: false },
                    { name : 'ID', value: user.id, inline: false},
                    { name: 'Stafflid', value: interaction.user.username, inline: false },
                    { name: 'Reden', value: reden, inline: false },
                    { name: 'Datum', value: new Date().toLocaleDateString(), inline: false },
                    { name: 'Tijd', value: new Date().toLocaleTimeString(), inline: false }
                )
                .setFooter({
                    text: '© VelowMT 2023 - Gemaakt door Sundeep'
                });

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });

            await guild.members.ban({
                user: user,
                reason: reden
            }).catch(err => {
                return;
            })

            await user.send({
                embeds: [dmEmbed]
            }).catch(err => {
                return;
            });

            let channel = user.client.channels.cache.get(process.env.MODERATION_LOG_CHANNEL_ID);
            channel.send({ embeds: [logEmbed] });

            db.set(`bans_${user}`, 1);

        } catch (error) {
            console.log(error);
        };
    }
};
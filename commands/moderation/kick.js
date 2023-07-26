const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const dotenv = require('dotenv');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick een member van de discord server.')
        .addUserOption(option =>
            option.setName('member')
                .setDescription('De memeber die je wilt kicken.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addStringOption(option =>
            option.setName('reden')
                .setDescription('De reden van de kick.')
                .setRequired(true)),

    async execute(interaction, client) {
        try {

            const kickUser = interaction.options.getUser('member');
            const kickMember = interaction.guild.members.cache.get(kickUser.id);
            const reden = interaction.options.getString('reden');

            if (!kickMember) return await interaction.reply({
                content: "Deze member is niet gevonden!",
                ephemeral: true
            });

            if (!kickMember.kickable) return await interaction.reply({
                content: "Deze member kan niet gekickt worden!",
                ephemeral: true
            });

            if (!reden) reden = 'Geen reden opgegeven.';

            const dmEmbed = new EmbedBuilder()
                .setTitle('Je bent gekickt van VelowMT!')
                .setDescription(`Je bent gekickt door ${interaction.user.username}!\nreden: **${reden}**`)
                .setColor(process.env.DEFAULT_EMBED_COLOR)
                .setFooter({
                    text: '© VelowMT 2023 - Gemaakt door Sundeep'
                })
                .setTimestamp();

            const embed = new EmbedBuilder()
                .setColor(process.env.DEFAULT_EMBED_COLOR)
                .setDescription(`**${kickUser.username}** is succesvol gekickt met de reden: **${reden}**`);

            
            const logEmbed = new EmbedBuilder()
                .setTitle('een member is gekickt!')
                .setColor(process.env.DEFAULT_EMBED_COLOR)
                .setThumbnail(process.env.DEFAULT_EMBED_THUMBNAIL)
                .addFields(
                    { name: 'Member', value: kickUser.username, inline: false },
                    { name : 'ID', value: kickUser.id, inline: false},
                    { name: 'Stafflid', value: interaction.user.username, inline: false },
                    { name: 'Reden', value: reden, inline: false },
                    { name: 'Datum', value: new Date().toLocaleDateString(), inline: false },
                    { name: 'Tijd', value: new Date().toLocaleTimeString(), inline: false }
                )
                .setFooter({
                    text: '© VelowMT 2023 - Gemaakt door Sundeep'
                });

            await kickMember.send({
                embeds: [dmEmbed]
            }).catch(err => {
                return;
            });

            await kickMember.kick({
                reason: reden
            }).catch(err => {
                interaction.reply({
                    content: "Er ging iets mis!",
                    ephemeral: true
                });
            })

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });

            let channel = kickUser.client.channels.cache.get(process.env.MODERATION_LOG_CHANNEL_ID);
            channel.send({ embeds: [logEmbed] });

        } catch (error) {
            console.log(error);
        };
    }
};
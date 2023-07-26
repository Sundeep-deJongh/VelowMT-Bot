const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { QuickDB } = require("quick.db");
const dotenv = require('dotenv');
const axios = require('axios');
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('unban een member van de server.')
        .addStringOption(option =>
            option.setName('memberid')
                .setDescription('De id van de member die je wilt unbannen.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction, client) {
        try {

            const id = interaction.options.getString('memberid');
            const user = await client.users.fetch(id);
            const guild = interaction.guild;


            const embed = new EmbedBuilder()
                .setColor(process.env.DEFAULT_EMBED_COLOR)
                .setDescription(`<@${id}> is succesvol geunbanned!`);

                const logEmbed = new EmbedBuilder()
                .setTitle('een member is geunbanned!')
                .setColor(process.env.DEFAULT_EMBED_COLOR)
                .setThumbnail(process.env.DEFAULT_EMBED_THUMBNAIL)
                .addFields(
                    { name: 'Member', value: `<@${id}>`, inline: false },
                    { name : 'ID', value: user.id, inline: false},
                    { name: 'Stafflid', value: interaction.user.username, inline: false },
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

            await guild.members.unban({
                user: user,
            }).catch(err => {
                return;
            })

            let channel = user.client.channels.cache.get(process.env.MODERATION_LOG_CHANNEL_ID);
            channel.send({ embeds: [logEmbed] });
            
        } catch (error) {
            console.log(error);
        };
    }
};
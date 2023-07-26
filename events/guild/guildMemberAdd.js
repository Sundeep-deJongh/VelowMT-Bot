const { Events, EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {

        let role = member.guild.roles.cache.get(process.env.WELCOME_ROLE_ID);
        member.roles.add(role);

        let embed = new EmbedBuilder()
            .setTitle(`Welkom ${member.user.username}!`)
            .setDescription(`Welkom op de VelowMT discord server!\n\nJe bent de ${member.guild.memberCount}e speler op de server!`)
            .setThumbnail(member.user.displayAvatarURL())
            .setColor(process.env.DEFAULT_EMBED_COLOR)
            .setFooter({
                text: `© VelowMT 2023 - Gemaakt door Sundeep`,
            })
            .setTimestamp();

        let channel = member.client.channels.cache.get(process.env.WELCOME_CHANNEL_ID);
        channel.send({ embeds: [embed] });
    }
}
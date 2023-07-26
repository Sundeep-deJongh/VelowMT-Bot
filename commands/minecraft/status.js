const { SlashCommandBuilder, CommandInteraction, EmbedBuilder } = require('discord.js');
const { status } = require('minecraft-server-util');
const dotenv = require('dotenv');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Bekijk de status van de server.'),

    async execute(interaction, client) {
        try {

            const serverIP = process.env.SERVER_IP;
            const serverPort = parseInt(process.env.SERVER_PORT); 

            const response = await status(serverIP, serverPort);
            
            const embed = new EmbedBuilder()
                .setTitle('Server Status van VelowMT')
                .setColor(process.env.DEFAULT_EMBED_COLOR)
                .setThumbnail(process.env.DEFAULT_EMBED_THUMBNAIL)
                .addFields(
                    { name: 'Server IP', value: `play.velowmt.nl` },
                    { name: 'Server Versie', value: `${response.version.name}` },
                    { name: 'Online Spelers', value: `${response.players.online}` + '/' + `${response.players.max}` },
                    { name: 'Motd', value: `${response.motd.clean}` },
                    { name: 'Status', value: `${response.online}` ? '🟢 Online' : '🔴 Offline' }
                    )
                .setFooter({
                    text: 'Aangevraagd door ' + interaction.user.username
                })
                .setTimestamp();

                interaction.reply({ 
                    embeds: [embed],
                    ephemeral: true
                 });

        } catch (error) {
            console.log(error);
        }
    }
}
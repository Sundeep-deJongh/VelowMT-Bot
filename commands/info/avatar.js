const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const dotenv = require('dotenv');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Haal de profielfoto van een member op.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('De user waarvan je het profielfoto wil ophalen.')
                .setRequired(true)
        ),

    async execute(interaction, client, args) {
        try {

            const user = interaction.options.get('user')?.user || interaction.user;

            const embed = new EmbedBuilder()
                .setTitle('Profielfoto van ' + user.username)
                .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }))
                .setColor(process.env.EMBED_COLOR)
                .setFooter({
                    text: 'Aangevraagd door ' + interaction.user.username
                })
                .setTimestamp();

                const formats = ['png', 'jpg', 'webp', 'gif'];
                const components = [];

                formats.forEach((format) => {

                    let imageOptions = { 
                        extension: format, 
                        forceStatic: format == 'gif' ? false : true 
                    };

                    if(user.avatar == null && format !== 'png') return;
                    if(!user.avatar.startsWith('a_') && format == 'gif') return;

                    components.push(
                        new ButtonBuilder()
                        .setLabel(format.toUpperCase())
                        .setStyle('Link')
                        .setURL(user.displayAvatarURL(imageOptions))
                    )
                });
                
                const row = new ActionRowBuilder()
                .addComponents(components);
            
            interaction.reply({
                embeds: [embed],
                components: [row],
                ephemeral: true
            });

        } catch (error) {
            console.log(error);
        };
    }
};
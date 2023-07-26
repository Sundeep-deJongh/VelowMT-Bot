const { SlashCommandBuilder, CommandInteraction, EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skin')
        .setDescription('Haal de skin van een speler op.')
        .addStringOption(option =>
            option.setName('user')
                .setDescription('De minecraft naam van de skin die je wilt ophalen.')
                .setRequired(true)
        ),

    async execute(interaction, client) {
        try {

            interaction.reply({
                content: "Skin aan het laden...",
                ephemeral: true
            })
                .then(async () => {
                    axios.get('https://api.mojang.com/users/profiles/minecraft/' + interaction.options.getString('user'))
                        .then(function (response) {
                            if (response.data.id != null) {

                                const embed = new EmbedBuilder()
                                    .setTitle('Skin van ' + interaction.options.getString('user'))
                                    .setDescription(`Klik [hier](https://visage.surgeplay.com/skin/${response.data.id}) om de skin te downloaden.`)
                                    .setThumbnail('https://visage.surgeplay.com/skin/' + response.data.id)
                                    .setImage('https://visage.surgeplay.com/full/' + response.data.id)
                                    .setColor(process.env.DEFAULT_EMBED_COLOR)
                                    .setFooter({
                                        text: 'Aangevraagd door ' + interaction.user.username
                                    })
                                    .setTimestamp();

                                interaction.editReply({
                                    embeds: [embed],
                                    ephemeral: true
                                });

                            } else {
                                interaction.editReply({
                                    content: "Gebruiker niet gevonden!",
                                    ephemeral: true
                                });
                            };
                        })
                        .catch(function (error) {
                            interaction.editReply({
                                content: "Er ging iets mis",
                                ephemeral: true
                            });
                            console.log(error);
                        });
                });

        } catch (error) {
            console.log(error);
        };
    }
};
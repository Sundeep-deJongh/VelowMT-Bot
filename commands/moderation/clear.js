const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const dotenv = require('dotenv');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Verwijder een aantal berichten uit de chat.')
        .addIntegerOption(option =>
            option.setName('aantal')
                .setDescription('het aantal berichten dat je wil verwijderen (Maximaal 100).')
                .setRequired(true))
                .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction, client) {
        try {
                
                interaction.reply({
                    content: "Berichten aan het verwijderen...",
                    ephemeral: true
                })
                    .then(async () => {
                        const aantal = interaction.options.getInteger('aantal');
                        if (aantal > 100) {
                            interaction.editReply({
                                content: "Je kan maximaal 100 berichten verwijderen!",
                                ephemeral: true
                            });

                        } else {
                            interaction.channel.bulkDelete(aantal)
                                .then(() => {
                                    interaction.editReply({
                                        content: "Berichten verwijderd!",
                                        ephemeral: true
                                    });
                                })
                                .catch(() => {
                                    interaction.editReply({
                                        content: "Er ging iets mis",
                                        ephemeral: true
                                    });
                                });
                        };
                    });


        } catch (error) {
            console.log(error);
        };
    }
};
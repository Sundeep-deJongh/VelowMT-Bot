const { SlashCommandBuilder, CommandInteraction, EmbedBuilder } = require('discord.js');
const { status } = import('node-fetch');
const dotenv = require('dotenv');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('player')
        .setDescription('Bekijk de informatie van een speler.')
        .addStringOption(
            option => option.setName('speler')
                .setDescription('De gebruikersnaam van de speler.')
                .setRequired(true)
        ),

    async execute(interaction, client) {
        try {

            let url = 'http://node01.vulcansmp.nl:25695/api/player/' + interaction.options.getString('speler');
            let response;

            try {
                response = await fetch(url, {
                    method: 'GET',
                });

            } catch (error) {
                return console.log('The API is not available.');
            }

            const json = await response.json();

            if(json.success === false) return interaction.reply({
                content: 'Speler niet gevonden!',
                ephemeral: true
            });

            let embed = new EmbedBuilder()
                .setTitle('Speler Informatie')
                .setColor(process.env.DEFAULT_EMBED_COLOR)
                .setThumbnail(`https://visage.surgeplay.com/head/${interaction.options.getString('speler')}`)
                .addFields(
                    { name: 'Speler', value: `${interaction.options.getString('speler')}` },
                    { name: 'Prefix', value: `${json.prefix}` },
                    { name: 'Level', value: `${json.level}` },
                    { name: 'Geld' , value: `€${json.money}`},
                    { name: 'Fitheid', value: `${json.fitness}` },
                    { name: 'Speeltijd', value: `${json.timeDays} dagen, ${json.timeHours} uur, ${json.timeMinutes} minuten, ${json.timeSeconds} seconden` },
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
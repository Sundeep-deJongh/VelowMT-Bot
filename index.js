const { Client, GatewayIntentBits, Collection, Partials, ActivityType } = require('discord.js');
const { loadEvents } = require('./handlers/eventsHandler');
const { loadCommands } = require('./handlers/commandsHandler');

const discordModals  = require('discord-modals');
const dotenv = require('dotenv');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ], partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
        Partials.Reaction,
    ]
});

client.on("ready", () => {
    const activities = [
        { name: `play.velowmt.nl`, type: ActivityType.Streaming, url: 'https://twitch.tv/velowmt' },
    ];
    const status = [
        'dnd',
    ];
    let i = 0;
    setInterval(() => {
        if(i >= activities.length) i = 0
        client.user.setActivity(activities[i])
        i++;
    }, 5000);

    let s = 0;
    setInterval(() => {
        if(s >= activities.length) s = 0
        client.user.setStatus(status[s])
        s++;
    }, 5000);
});
require('dotenv').config();

discordModals(client);

client.commands = new Collection();

client.login(process.env.DISCORD_BOT_TOKEN).then(() => {
    console.log('Succesfully logged in as ' + client.user.tag);
    loadEvents(client);
    loadCommands(client);

}).catch((error) => {
    console.log(error);
    console.error(error);
});

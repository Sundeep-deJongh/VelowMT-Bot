const fs = require("fs");

function loadEvents(client) {

    const folders = fs.readdirSync("./events");

    for (const folder of folders) {
        const files = fs
            .readdirSync(`.//events/${folder}`)
            .filter((file) => file.endsWith(".js"));
        for (const file of files) {
            const event = require(`../events/${folder}/${file}`);

            if (event.rest) {
                if (event.once) {
                    client.rest.once(event.name, (...args) => event.execute(...args, client));
                } else {
                    client.rest.on(event.name, (...args) => event.execute(...args, client));
                }
            } else {
                if (event.once) {
                    client.once(event.name, (...args) => event.execute(...args, client));
                } else {
                    client.on(event.name, (...args) => event.execute(...args, client));
                }
            }
            continue;
        }
    }

    return console.log(`Loaded events Succesfully!`);
}

function getDirectories(path) {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path + '/' + file).isDirectory();
    });
}

module.exports = { loadEvents };
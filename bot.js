import fs from 'fs';
import { Client, Collection, Intents } from 'discord.js';
import config from './configuration.js';
export const owner = config.owner;


export const client = new Client({ intents: new Intents(32767) });
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const importPromises = [];

for (const file of commandFiles) {
	const fileName = `./commands/${file}`;
	importPromises.push(import(fileName)
		.then(module => client.commands.set(module.default.data.name, module.default))
		.catch(console.error));
}

for (const file of eventFiles) {
	const fileName = `./events/${file}`;
	importPromises.push(import(fileName)
		.then(module => {
			if (module.default.once) {
				client.once(module.default.name, (...args) => module.default.execute(...args, client));
			} else {
				client.on(module.default.name, (...args) => module.default.execute(...args, client));
			}
		})
		.catch(console.error));
}

// Когда бот запустился
client.once('ready', () => {
	client.guilds.cache.forEach(async guild => await initAppCommands(guild.id));
});

client.on('guildCreate', async (guild) => {
	await initAppCommands(guild.id);
});

import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { interactionHandler } from './service/interactionHandler.js';
const rest = new REST({ version: '9' }).setToken(config.token);

async function initAppCommands(guildId) {
	const commandsInfo = client.commands.map(module => module.data);
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(config.client_id, guildId),
			{ body: commandsInfo },
		);
		//await rest.put(
		//Routes.applicationCommands(clientId),
		//{ body: commands },
		//);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
};
client.on('interactionCreate', async interaction => {
	await interactionHandler(interaction);
	if (interaction.customId === 'select') {
		await interaction.update({ content: 'Something was selected!', components: [] });
	}


	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});






Promise.all(importPromises)
	.then(() => client.login(config.token))
	.catch(console.error);
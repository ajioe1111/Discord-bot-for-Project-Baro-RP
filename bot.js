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
	client.guilds.cache.forEach(async guild => {
		await initAppCommands(guild.id);
	//	await setAppCommandPermissions('787699629944864839');
	});
});

client.on('guildCreate', async (guild) => {
	await initAppCommands(guild.id);
});

import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { interactionHandler } from './service/interactionHandler.js';
const rest = new REST({ version: '9' }).setToken(config.token);

async function initAppCommands(guildId) {
	const commandsInfo = client.commands.map(module => {
		if (module.data) { module.data.defaultPermission = false }
		return module.data;

	});
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

async function setAppCommandPermissions(guildId) {
	const userName = 'Fuuka';
	let user = await getUser(userName, guildId);
	const command = await getAppCommand('ban', guildId);
	const guild = await client.guilds.cache.get(guildId);
	command.defaultPermission = true;
	guild.commands.edit(command.id, command);
	// guild.commands.permissions
	let permissions = [
		{
			id: user.id,
			type: 'USER',
			permission: false
		}
	]
	//	await command.permissions.add({ permissions });
	//	await showAppCommandPermissons(command);
	// user = await getUser('ProjectBaroRP', guildId);
	// permissions = [
	// 	{
	// 		id: user.id,
	// 		type: 'USER',
	// 		permission: false
	// 	}
	// ]
	// await command.permissions.set({ permissions });
	// console.log(await command.permissions.has({ permissionId: user }));
	// await showAppCommandPermissons(command);


}

async function showAppCommandPermissons(command) {
	const permissions = await command.permissions.fetch();
	console.log(`Разрешения в команде ${command.name}`);
	for (let i = 0; i < permissions.length; i++) {
		const permission = permissions[i];
		console.log(permission);
	}
	console.log();
}

async function getAppCommand(commandName, guildId) {
	const guild = await client.guilds.cache.get(guildId);
	const commands = await guild?.commands.fetch();
	const command = commands.find(command => command.name === commandName);
	return command;
}

async function getUser(userName, guildId) {
	const guild = await client.guilds.cache.get(guildId);
	const users = guild.members.cache.map(member => member.user);
	const user = users.find(user => user.username === userName);
	return user;
}

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
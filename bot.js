const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token, owner, client_id } = require('./configuration.json');

const client = new Client({ intents: new Intents(32767) });
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}
const commandsInfo = client.commands.map(kvp => kvp.data);

// Когда бот запустился
client.once('ready', () => {
	console.log('Bot is started now!');
	client.guilds.cache.forEach(async guild => await initAppCommands(guild.id));

});

client.on('guildCreate', async (guild) => {
	await initAppCommands(guild.id);
});

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const rest = new REST({ version: '9' }).setToken(token);

async function initAppCommands(guildId) {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(client_id, guildId),
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
	console.log(interaction);
	if (interaction.customId === 'select') {
		await interaction.update({ content: 'Something was selected!', components: [] });
	}
	if (interaction.customId === 'primary') {
		await interaction.reply('asd');
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
client.login(token);
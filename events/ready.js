import Discord from 'discord.js';
import config from '../configuration.js';

export let hubGuild;
export let joinLogChannel;
export let leaveLogChannel;
export let messageLogChannel;
export let commandsLogChannel;


export default {
	name: 'ready',
	once: true,
	/**
	 * 
	 * @param {Discord.Client} client 
	 */
	execute(client) {
		console.log('Bot is started now!');
		hubGuild = client.guilds.cache.find(g => g.id == config.hubId);
		joinLogChannel = hubGuild.channels.cache.find(ch => ch.id == config.joinLog);
		leaveLogChannel = hubGuild.channels.cache.find(ch => ch.id == config.leaveLog);
		messageLogChannel = hubGuild.channels.cache.find(ch => ch.id == config.messageLog);
		commandsLogChannel = hubGuild.channels.cache.find(ch => ch.id == config.commandsLog);
	},
};

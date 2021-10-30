import Discord from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { messageLogChannel } from './ready.js';



export default {
	name: 'messageDelete',
	/**
	 * 
	 * @param {*} message 
	 * @param {Discord.Client} client 
	 * @returns 
	 */
	execute(message, client) {
		if (message.author.bot) {
			return;
		}
		const messageChannel = message.channel;
		const author = message.author;
		const guild = message.guild;
		const botlog = guild.channels.cache.find(ch => ch.name === 'botlog');
		if (!botlog) { return console.log(`Ошибка в логах. Event messageUpdate. Не найден botlog!`); }
		const logEmbed = new Discord.MessageEmbed();
		logEmbed.setAuthor('Удаление сообщения', client.user.displayAvatarURL());
		logEmbed.setColor('#d61620');
		logEmbed.addFields(
			{ name: 'Сообщение', value: message.content ? message.content : 'no content', inline: true },
			{ name: 'Канал', value: `<#${messageChannel.id}>` },
			{ name: 'Автор', value: `<@${author.id}>` },
		);
		logEmbed.setTimestamp();
		botlog.send({ embeds: [logEmbed] });
		messageLogChannel.send({ embeds: [logEmbed] });

	},
};
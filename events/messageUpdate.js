import Discord from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { messageLogChannel } from './ready.js';



export default {
	name: 'messageUpdate',
	/**
	 * 
	 * @param {Discord.Message} oldMessage 
	 * @param {Discord.Message} newMessage 
	 * @param {Discord.Client} client 
	 */
	execute(oldMessage, newMessage, client) {
		if (oldMessage.author.bot) {
			return;
		}
		const messageChannel = oldMessage.channel;
		const author = oldMessage.author;
		const guild = oldMessage.guild;
		const botlog = guild.channels.cache.find(ch => ch.name === 'botlog');
		if (!botlog) { return console.log(`Ошибка в логах. Event messageUpdate. Не найден botlog!`); }
		const oldMessageContent = oldMessage.content;
		const newMessageContent = newMessage.content;
		const logEmbed = new Discord.MessageEmbed();
		if (oldMessageContent != newMessageContent) {
			logEmbed.setAuthor('Изменение сообщения', client.user.displayAvatarURL());
			logEmbed.setColor('#d61689');
			logEmbed.addFields(
				{ name: 'Старое сообщение', value: oldMessageContent ? oldMessageContent : 'no content', inline: true },
				{ name: 'Новое сообщение', value: newMessageContent ? newMessageContent : 'no content', inline: true },
				{ name: 'Канал', value: `<#${messageChannel.id}>` },
				{ name: 'Автор', value: `<@${author.id}>` },
			);
			logEmbed.setTimestamp();
			botlog.send({ embeds: [logEmbed] });
			messageLogChannel.send({ embeds: [logEmbed]});
		}
	},
};
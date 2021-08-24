import { SlashCommandBuilder } from '@discordjs/builders';
import { checkPermissions, sendLogMessage } from '../service/utility.js';
import Discord from 'discord.js';
import { MessageEmbed } from 'discord.js';

import { owner } from '../bot.js';

export default {
	roles: ['Game Admin', 'Moderator'],
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Удаляет до 99 сообщений.')
		.addIntegerOption(option =>
			option
				.setName('число')
				.setRequired(true)
				.setDescription('Число сообщений которые надо удалить')),

	async execute(interaction) {
		if (checkPermissions(interaction.member, this.roles) == true || interaction.user.id == owner) {
			await clear(interaction);
		} else return interaction.reply({ content: `Недостаточно прав!`, ephemeral: true });
	}
};

/**
 * 
 * @param {Discord.Interaction} interaction 
 * @returns 
 */
async function clear(interaction) {
	const amount = interaction.options.getInteger('число');
	if (amount <= 0 || amount > 101) {
		return interaction.reply({ content: 'Нужно указать от 1 до 100.', ephemeral: true });
	}
	await interaction.channel.bulkDelete(amount, true).catch(error => {
		console.error(error);
		interaction.reply({ content: 'Произошла ошибка при удалении сообщений!', ephemeral: true });

	});
	const embed = new Discord.MessageEmbed()
		.setColor('#0099ff')
		.setTitle('команда clear')
		.setDescription(`${interaction.member} использовал команду **clear** и удалил \`${interaction.options.getInteger('число')}\` сообщений на **${interaction.guild.name}** в ${interaction.channel}`);
	let log = {
		type: 'command',
		message: embed
	}
	sendLogMessage(log);
	return interaction.reply({ content: `Успешно удалено \`${amount}\` сообщений.`, ephemeral: true });

}
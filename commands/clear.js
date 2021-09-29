import { SlashCommandBuilder } from '@discordjs/builders';
import { checkPermissions, createLog, sendLogMessage } from '../service/utility.js';
import Discord from 'discord.js';
import { MessageEmbed } from 'discord.js';

import { owner } from '../bot.js';

export default {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Удаляет до 100 сообщений.')
		.addIntegerOption(option =>
			option
				.setName('число')
				.setRequired(true)
				.setDescription('Число сообщений которые надо удалить')),

	async execute(interaction) {
		await clear(interaction);
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
	const commandName = 'команда clear';
	const message = `${interaction.member} удалил **${amount}** сообщений в ${interaction.guild.name}`;
	const type = 'command';
	createLog(commandName, message, type);
	return interaction.reply({ content: `Успешно удалено \`${amount}\` сообщений.`, ephemeral: true });
}



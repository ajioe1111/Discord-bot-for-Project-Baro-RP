import { SlashCommandBuilder } from '@discordjs/builders';

export default {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Удаляет до 99 сообщений.')
		.addIntegerOption(option =>
			option
				.setName('число')
				.setRequired(true)
				.setDescription('Число сообщений которые надо удалить')),

	async execute(interaction) {
		const amount = interaction.options.getInteger('число');

		if (amount <= 1 || amount > 100) {
			return interaction.reply({ content: 'Нужно указать от 2 до 99.', ephemeral: true });
		}
		await interaction.channel.bulkDelete(amount, true).catch(error => {
			console.error(error);
			interaction.reply({ content: 'Произошла ошибка при удалении сообщений!', ephemeral: true });
		});

		return interaction.reply({ content: `Успешно удалено \`${amount}\` сообщений.`, ephemeral: true });
	},
};

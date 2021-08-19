const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Дает ссылку на аватар юзера или на ваш собственный аватар.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('server')
				.setDescription('Выводит информацию о сервере!'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('test')
				.setDescription('just test'))
		.addUserOption(option => option.setName('пользователь').setDescription('Указывает юзера')),
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'server') {
			console.log('server');
		} else if (interaction.options.getSubcommand() === 'test') {
			console.log('test');
		}
		const user = interaction.options.getUser('пользователь');
		if (user) return interaction.reply(`${user.username}'s avatar: ${user.displayAvatarURL({ dynamic: true })}`);
		return interaction.reply(`avatar: ${interaction.user.displayAvatarURL({ dynamic: true })}`);
	},
};

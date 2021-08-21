import { SlashCommandBuilder } from '@discordjs/builders';

export default {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Выводит информацию о сервере!'),
	async execute(interaction) {
		await interaction.reply(`This server's name is: ${interaction.guild.name}`);
		const message = await interaction.fetchReply();

		await interaction.deleteReply();
		console.log(message);
	},
};
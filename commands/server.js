const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Выводит информацию о сервере!'),
	async execute(interaction) {
		await interaction.reply(`This server's name is: ${interaction.guild.name}`);
		const message = await interaction.fetchReply();
		await wait(3000);
		await interaction.deleteReply();
		console.log(message);
	},
};
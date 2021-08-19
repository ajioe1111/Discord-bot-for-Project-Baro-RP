const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		await wait(4000);
		await interaction.editReply('Pong!');
		await interaction.followUp({ content: 'Pong again!', ephemeral: true });
		
	},
};
import { SlashCommandBuilder } from '@discordjs/builders';
const promisify = f => (...args) => new Promise((a,b)=>f(...args, (err, res) => err ? b(err) : a(res)));
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

export default {
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
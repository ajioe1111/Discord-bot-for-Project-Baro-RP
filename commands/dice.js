import { SlashCommandBuilder } from '@discordjs/builders';
const promisify = f => (...args) => new Promise((a, b) => f(...args, (err, res) => err ? b(err) : a(res)));
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));


export default {
    data: new SlashCommandBuilder()
        .setName('dice')
        .setDescription('Позволяет получить рандомное число'),
    async execute(interaction) {
        let randomNumber = Math.floor(Math.random() * 100);
        await interaction.reply(`Вы кидаете кубик...`);
		await wait(2000);
		await interaction.editReply(`И вам выпадает **${randomNumber}**`);
    },
};
import Discord from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { checkPermissions } from '../service/utility.js';
import { client, owner } from '../bot.js';
const promisify = f => (...args) => new Promise((a, b) => f(...args, (err, res) => err ? b(err) : a(res)));
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));


export default {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Возвращает Орел или Решка By Люнексоид'),
    /**
     * 
     * @param {Discord.Interaction} interaction 
     */
    async execute(interaction) {
        let randomNumber = Math.floor(Math.random() * 100);
        if (randomNumber <= 50) {
            await interaction.reply('Решка');
        }
        else if (randomNumber >= 50) {
            await interaction.reply('Орел');
        }
    },
};
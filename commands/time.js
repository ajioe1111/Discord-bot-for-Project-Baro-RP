import Discord from 'discord.js';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { checkPermissions, sendLogMessage } from '../service/utility.js';
import { client, owner } from '../bot.js';
import moment from 'moment';
const promisify = f => (...args) => new Promise((a, b) => f(...args, (err, res) => err ? b(err) : a(res)));
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

export default {
    data: new SlashCommandBuilder()
        .setName('time')
        .setDescription('Показывает игровую дату'),
    async execute(interaction) {
        await interaction.reply({ content: `Сейчас ${getDate()}`, ephemeral: true });
    },
};

function getDate() {
    moment.locale('ru');
    const date = moment().year(2267).format('MMMM Do YYYY, hh:mm:ss a');
    return date;
}
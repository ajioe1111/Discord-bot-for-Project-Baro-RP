import Discord from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { checkPermissions, createLog, sendLogMessage } from '../service/utility.js';
import { client, owner } from '../bot.js';
const promisify = f => (...args) => new Promise((a, b) => f(...args, (err, res) => err ? b(err) : a(res)));
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));



/**
 * 
 * @param {Discord.Interaction} interaction 
 */
function botSay(interaction) {
    const channel = interaction.options.getChannel('канал');
    const text = interaction.options.getString('текст');
    const channelIsValid = interaction.guild.channels.cache.find(ch => ch.id == channel.id);
    if (!channelIsValid) { return interaction.reply({ content: 'Ошибка поиска канала!', ephemeral: true }) };
    channel.send(text);
    const commandName = 'команда say';
    const message = `${interaction.member} в канал ${channel} сказал **${text}**`;
    const type = 'command';
    createLog(commandName, message, type);
    return;
}



export default {
    data: new SlashCommandBuilder()
        .setName('say')
        .addChannelOption(option =>
            option
                .setName('канал')
                .setRequired(true)
                .setDescription('Канал куда бот отправит сообщение'))
        .addStringOption(option =>
            option
                .setName('текст')
                .setRequired(true)
                .setDescription('Текст сообщения'))
        .setDescription('Позволяет отправить сообщение от имени бота'),
    async execute(interaction) {
            await botSay(interaction);
            await interaction.reply({ content: 'Выполнено!', ephemeral: true });
    },
};


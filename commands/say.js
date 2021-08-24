import Discord from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { checkPermissions } from '../service/utility.js';
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
    channelIsValid.send(text);
    return;
}


export default {
    roles: ['Game Master', 'Moderator'],
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
        if (checkPermissions(interaction.member, this.roles) == true || interaction.user.id == owner) {
            await botSay(interaction);
            await interaction.reply({content: 'Выполнено!', ephemeral: true});
        } else return interaction.reply({ content: 'Недостаточно прав!', ephemeral: true });
    },
};
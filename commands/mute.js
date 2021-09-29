import Discord from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { checkPermissions, createLog, sendLogMessage } from '../service/utility.js';
import { client, owner } from '../bot.js';
const promisify = f => (...args) => new Promise((a, b) => f(...args, (err, res) => err ? b(err) : a(res)));
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

export default {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Выдает mute пользователю')
        .addIntegerOption(option => option.setName('число')
            .setDescription('на какое время выдать мут')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('время')
                .setDescription('Уточнить время')
                .setRequired(true)
                .addChoice('Секунд', 's')
                .addChoice('Минут', 'm')
                .addChoice('Часов', 'h'))
        .addMentionableOption(option =>
            option.setName('пользователь')
                .setDescription('Выдаст указаному пользователю mute')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('причина')
                .setDescription('Причина (необязательно)')
                .setRequired(true)),
    /**
     * 
     * @param {Discord.Interaction} interaction 
     */
    async execute(interaction) {
            mutedMember(interaction);
            await interaction.reply({ content: 'Выполнено!', ephemeral: true });
    },
};

/**
 * 
 * @param {Discord.Interaction} interaction 
 * @param {Discord.GuildMember} mutedUser
 */
function mutedMember(interaction) {
    const mutedUser = interaction.options.getMentionable('пользователь');
    const times = interaction.options.getString('время');
    const reason = interaction.options.getString('причина');
    const count = interaction.options.getInteger('число');
    const guild = interaction.guild;
    let mutedTime;
    let mutedReason;
    if (times == 's') {
        mutedTime = count * 1000;
        mutedReason = `${count} секунд`;
    } else if (times == 'm') {
        mutedTime = (count * 1000) * 60;
        mutedReason = `${count} минут`;
    } else if (times == 'h') {
        mutedTime = (count * 1000) * 60 * 60;
        mutedReason = `${count} час'ов`;
    }
    createLog(interaction, mutedUser, reason, mutedTime, mutedReason);
    const mutedRoles = interaction.guild.roles.cache.find(r => r.name == 'mute');
    if (mutedRoles) {
        mutedUser.roles.add(mutedRoles);
        mutedUser.send(`Вам выдали **mute** за **${reason}** на ***${mutedReason}***`);
        setTimeout(() => mutedUser.roles.remove(mutedRoles), mutedTime);
        const commandName = 'команда mute';
        const message = `${interaction.member} замутил **${mutedUser.displayName}** за **${reason}** на **${interaction.guild}**. Время наказания **${mutedReason}**`;
        const type = 'command';
        createLog(commandName, message, type);
    } else { return console.log('Ошибка mute! роль не найдена!') };
}

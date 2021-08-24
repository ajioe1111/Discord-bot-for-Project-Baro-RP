import Discord from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { checkPermissions } from '../service/utility.js';
import { client, owner } from '../bot.js';
const promisify = f => (...args) => new Promise((a, b) => f(...args, (err, res) => err ? b(err) : a(res)));
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));



export default {
    roles: ['Game Master', 'Moderator'],
    data: new SlashCommandBuilder()
        .setName('ex')
        .addChannelOption(option =>
            option
                .setName('канал')
                .setRequired(true)
                .setDescription('Канал куда бот отправит сообщение'))
        .setDescription('Позволяет отправить сообщение от имени бота'),
    async execute(interaction) {
        if (checkPermissions(interaction.member, this.roles) || owner) {
            await botSay(interaction);
            await interaction.reply({content: 'Выполнено!', ephemeral: true});
        } else return interaction.reply({ content: 'Недостаточно прав!', ephemeral: true });
    },
};
import Discord from 'discord.js';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { checkPermissions, createLog, sendLogMessage } from '../service/utility.js';
import { client, owner } from '../bot.js';
import fs from 'fs'

const promisify = f => (...args) => new Promise((a, b) => f(...args, (err, res) => err ? b(err) : a(res)));
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const errorMessage = 'Ошибка в команде warn!';
const path = './db/words.json';
const databasePath = './db/list.json';

let database;
let warnedUser;
let warnedReason;


export default {
    data: new SlashCommandBuilder()
        .setName('warn')
        .addUserOption(option =>
            option.setName('пользователь').setRequired(true).setDescription('Пользователь которому нужно выдать предупреждение!'))
        .addStringOption(option =>
            option.setName('причина').setRequired(true).setDescription('Причина'))
        .setDescription('Выдает предупреждение пользователю.'),
    async execute(interaction) {
        warnedUser = interaction.options.getUser('пользователь');
        warnedReason = interaction.options.getString('причина');
        const banYes = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('warnYes')
                    .setLabel('Да')
                    .setStyle('SUCCESS'),
            );
        const banNo = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('warnNo')
                    .setLabel('Нет')
                    .setStyle('DANGER'),
            );
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Вы уверенны?')
            .setDescription(`Что хотите выдать предупреждение ${interaction.options.getUser('пользователь')} за **"${interaction.options.getString('причина')}"**"`);
        await interaction.reply({ ephemeral: true, embeds: [embed], components: [banYes, banNo] });
        await wait(7000);
        await interaction.editReply({ content: 'Время вышло!', embeds: [], components: [] });
    },
};

export async function warn(interaction) {
    const commandName = 'команда warn';
    const message = `${interaction.member} выдал предупреждение **${warnedUser}** за ${warnedReason}`;
    const type = 'command';
    createLog(commandName, message, type);
    database = JSON.parse(fs.readFileSync(databasePath));

}

function warnChecker() {
    let userIndex = database.users_list.findIndex(user => user.id == warnedUser.id);
    let warnCount = database.users_list[userIndex].properties.warn;
    if (warnCount = 4) {
        const warning = new MessageEmbed()
        .setColor('#5BBFCC')
        .setTitle('Внимание!')
        .setDescription(`У вас сейчас **4/5** предупреждений.\nПри получении ещё одного предупреждения будет автоматически выдан BAN с обнулением всех ролей.\n*предупреждения спадают на -1 каждое первое число месяца.`);
    }
}

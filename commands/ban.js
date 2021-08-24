import Discord from 'discord.js';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { checkPermissions, sendLogMessage } from '../service/utility.js';
import { client, owner } from '../bot.js';
const promisify = f => (...args) => new Promise((a, b) => f(...args, (err, res) => err ? b(err) : a(res)));
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const errorMessage = 'Ошибка в команде ban!';

let bannedUser;
let bannedReason;


export default {
    roles: ['Game Master'],
    data: new SlashCommandBuilder()
        .setName('ban')
        .addUserOption(option =>
            option.setName('пользователь').setRequired(true).setDescription('Пользователь которого надо забанить'))
        .addStringOption(option =>
            option.setName('причина').setRequired(true).setDescription('Причина бана'))
        .setDescription('Банит юзера на сервере.'),
    async execute(interaction) {
        bannedUser = interaction.options.getUser('пользователь');
        bannedReason = interaction.options.getString('причина');
        if (checkPermissions(interaction.member, this.roles) == true || interaction.user.id == owner) {
            const banYes = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('banYes')
                        .setLabel('Да')
                        .setStyle('SUCCESS'),
                );
            const banNo = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('banNo')
                        .setLabel('Нет')
                        .setStyle('DANGER'),
                );
            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Вы уверенны?')
                .setDescription(`Что хотите забанить ${interaction.options.getUser('пользователь')} за ${interaction.options.getString('причина')}`);
            await interaction.reply({ ephemeral: true, embeds: [embed], components: [banYes, banNo] });
            await wait(15000);
            await interaction.editReply({ content: 'Время вышло!', embeds: [], components: [] });
        } else return interaction.reply({ content: 'Недостаточно прав!', ephemeral: true });
    },
};

/**
 * 
 * @param {Discord.Interaction} interaction 
 */
export function memberBanned(interaction) {
    let memberGuild = interaction.guild;
    if (memberGuild) {
        let member = memberGuild.members.cache.find(m => m.id == bannedUser.id);
        if (member) {
            member.ban({ reason: bannedReason });
            const embed = new Discord.MessageEmbed()
                .setColor('#F66666')
                .setTitle('команда ban')
                .setDescription(`${interaction.member} использовал команду **ban** и забанил ${member} за **${bannedReason}** на **${interaction.guild}**`);
            let log = {
                type: 'command',
                message: embed
            }
            sendLogMessage(log);
            return console.log(`${member} был забанен за ${bannedReason}`);
        }
        else { errorMessage };
    } else { errorMessage };
}
import Discord from 'discord.js';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { checkPermissions, createLog, sendLogMessage } from '../service/utility.js';
import { client, owner } from '../bot.js';
const promisify = f => (...args) => new Promise((a, b) => f(...args, (err, res) => err ? b(err) : a(res)));
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const errorMessage = 'Ошибка в команде ban!';

let bannedUser;
let bannedReason;


export default {
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
            const commandName = 'команда ban';
            const message = `${interaction.member} забанил ${bannedUser} за **${bannedReason}** в ${interaction.guild.name}`;
            const type = 'command';
            createLog(commandName, message, type);
            return console.log(`${member} был забанен за ${bannedReason}`);
        }
        else { errorMessage };
    } else { errorMessage };
}

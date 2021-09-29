import Discord from 'discord.js';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { checkPermissions, createLog, sendLogMessage } from '../service/utility.js';
import { client, owner } from '../bot.js';
const promisify = f => (...args) => new Promise((a, b) => f(...args, (err, res) => err ? b(err) : a(res)));
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const errorMessage = 'Ошибка в команде ban!';

let kickedUser;
let kickedReason;


export default {
    roles: ['Game Master'],
    data: new SlashCommandBuilder()
        .setName('kick')
        .addUserOption(option =>
            option.setName('пользователь').setRequired(true).setDescription('Пользователь которого надо кикнуть'))
        .addStringOption(option =>
            option.setName('причина').setRequired(true).setDescription('Причина кика'))
        .setDescription('Кикает юзера из сервере.'),
    async execute(interaction) {
        kickedUser = interaction.options.getUser('пользователь');
        kickedReason = interaction.options.getString('причина');
        const banYes = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('kickYes')
                    .setLabel('Да')
                    .setStyle('SUCCESS'),
            );
        const banNo = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('kickNo')
                    .setLabel('Нет')
                    .setStyle('DANGER'),
            );
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Вы уверенны?')
            .setDescription(`Что хотите кикнуть ${interaction.options.getUser('пользователь')} за ${interaction.options.getString('причина')}`);
        await interaction.reply({ ephemeral: true, embeds: [embed], components: [banYes, banNo] });
        await wait(15000);
        await interaction.editReply({ content: 'Время вышло!', embeds: [], components: [] });
    },
};

/**
 * 
 * @param {Discord.Interaction} interaction 
 */
export function memberKicked(interaction) {
    let memberGuild = interaction.guild;
    if (memberGuild) {
        let member = memberGuild.members.cache.find(m => m.id == kickedUser.id);
        if (member) {
            member.kick({ reason: kickedReason });
            const commandName = 'команда kick';
            const message = `${interaction.member} кикнул ${kickedUser} за **${kickedReason}** в ${interaction.guild.name}`;
            const type = 'command';
            createLog(commandName, message, type);
            return console.log(`${member} был кикнут за ${kickedReason}`);
        }
        else { errorMessage };
    } else { errorMessage };
}

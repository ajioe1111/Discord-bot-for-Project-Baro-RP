import Discord from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { checkPermissions } from '../service/utility.js';
import { client, owner } from '../bot.js';
const promisify = f => (...args) => new Promise((a, b) => f(...args, (err, res) => err ? b(err) : a(res)));
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const talkedRecently = new Set();

export default {
    data: new SlashCommandBuilder()
        .setName('punch')
        .addMentionableOption(option =>
            option
                .setName('пользователь')
                .setDescription('Пользователь которого надо отправить в нокаут')
                .setRequired(true))
        .setDescription('Ударяет указаного пользователя by Люнексоид'),
    /**
     * 
     * @param {Discord.Interaction} interaction 
     */
    async execute(interaction) {
        if (talkedRecently.has(interaction.member.id)) {
            return await interaction.reply({ content: 'Придется подождать!', ephemeral: true });
        }
        talkedRecently.add(interaction.member.id);
        let punchIniciator = interaction.member;
        let punchTarged = interaction.options.getMentionable('пользователь');
        await interaction.reply(`${punchIniciator} ударил ${punchTarged}`);
        let guild = interaction.guild;
        let mutedRole = guild.roles.cache.find(role => role.name == 'mute');
        if (mutedRole) {
            let member = guild.members.cache.find(mem => mem.id == punchTarged.id);
            if (member) {
                member.roles.add(mutedRole);
                setTimeout(() => { member.roles.remove(mutedRole); }, 15000)
                setTimeout(() => { talkedRecently.delete(interaction.member.id) }, 15000)
            } else { await interaction.editReply('Пользователя нету на сервере'); }
        }
        else { await interaction.editReply('Роль mute не найдена!'); }
    },
};
import Discord from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { client, owner } from '../bot.js';
import fs from 'fs';
import { xpAdd } from '../events/messageCreate.js';
const promisify = f => (...args) => new Promise((a, b) => f(...args, (err, res) => err ? b(err) : a(res)));
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const cooldown = new Set();
const databasePath = './db/list.json';
const database = JSON.parse(fs.readFileSync(databasePath));

export default {
    data: new SlashCommandBuilder()
        .setName('casino')
        .setDescription('Позволяет сыграть на опыт. Пауза 5 часов.'),
    /**
     * 
     * @param {Discord.Interaction} interaction 
     */
    async execute(interaction) {
        if (cooldown.has(interaction.member.id)) { return await interaction.reply({ content: 'Придется подождать!', ephemeral: true }); }
        cooldown.add(interaction.member.id);
        setTimeout(() => { cooldown.delete(interaction.member.id) }, 18000000)
        const userIndex = database.users_list.findIndex(user => user.id === interaction.member.id);
        if (userIndex === -1) { return; };
        if (database.users_list[userIndex].properties.xp < 500) { return interaction.reply({ content: 'Для игры нужно не менее 500 опыта.', ephemeral: true }); };
        const casinoYes = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('casino_yes')
                    .setLabel('Играть!')
                    .setStyle('SUCCESS'),
            );
        const casinoNo = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('casino_no')
                    .setLabel('Я пас...')
                    .setStyle('DANGER'),
            );
        await interaction.reply({ ephemeral: true, content: 'Внести 500 опыта для игры?', components: [casinoYes, casinoNo] });
        await wait(20000);
        await interaction.editReply({ content: 'Время вышло!', components: [] });
    }
}

/**
 * 
 * @param {Discord.Interaction} interaction 
 */
export async function casinoGame(interaction) {
    const userIndex = database.users_list.findIndex(user => user.id === interaction.member.id);
    const randomNum1 = Math.floor(Math.random() * 10);
    const randomNum2 = Math.floor(Math.random() * 10);
    const randomNum3 = Math.floor(Math.random() * 10);
    await wait(1000);
    await interaction.editReply({ content: 'Вы крутите барабан...' });
    await wait(3000);
    await interaction.editReply({ content: `И выпадают числа **${randomNum1}**` });
    await wait(1500);
    await interaction.editReply({ content: `И выпадают числа **${randomNum1}** **${randomNum2}**` });
    await wait(1500);
    await interaction.editReply({ content: `И выпадают числа **${randomNum1}** **${randomNum2}** **${randomNum3}**` });
    await wait(1000);
    if (randomNum1 == randomNum2 && randomNum1 == randomNum3) {
        await interaction.editReply({ content: 'Джекпот! 4000 к опыту!' });
        xpAdd(4000, interaction.user.id, interaction.channel);
        return interaction.channel.send(`${interaction.member} сорвал Джекпот! 🎉🎉🎉`);
    }
    if (randomNum1 == randomNum2 || randomNum1 == randomNum3 || randomNum2 == randomNum3) {
        await interaction.editReply({ content: 'Два из трех! 1000 к опыту!' });
        xpAdd(1000, interaction.user.id, interaction.channel);
        return interaction.channel.send(`${interaction.member} выбил два из трех в казино! 🎰`);
    } else {
        await interaction.editReply({ content: 'Не повезло 😝' });
        database.users_list[userIndex].properties.xp = database.users_list[userIndex].properties.xp - 500;
        fs.writeFileSync(databasePath, JSON.stringify(database));
        return interaction.channel.send(`${interaction.member} Проиграл свои кровные в казино! 🤬`);
    }
}
import Discord from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { checkPermissions } from '../service/utility.js';
import { client, owner } from '../bot.js';
import fs from 'fs';
import { deleteWord } from './addword.js';
const promisify = f => (...args) => new Promise((a, b) => f(...args, (err, res) => err ? b(err) : a(res)));
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const path = './db/words.json';


export default {
    data: new SlashCommandBuilder()
        .setName('delete_word')
        .setDescription('Удаляет слово из черного списка')
        .addStringOption(option =>
            option.setName('слово').setDescription('слово которое нужно удалить').setRequired(true)),
    /**
     * 
     * @param {Discord.Interaction} interaction 
     * @returns 
     */
    async execute(interaction) {
            const getWords = interaction.options.getString('слово');
            const words = getWords.toLowerCase();
            await deleteWord(interaction, words)
    },
};

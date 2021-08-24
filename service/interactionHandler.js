import Discord from 'discord.js';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { checkPermissions } from '../service/utility.js';
import { client, owner } from '../bot.js';
import { memberBanned } from '../commands/ban.js';
import { memberKicked } from '../commands/kick.js';
const promisify = f => (...args) => new Promise((a, b) => f(...args, (err, res) => err ? b(err) : a(res)));
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));




/**
 * 
 * @param {Discord.Interaction} interaction 
 */
export async function interactionHandler(interaction) {
	buttonHendler(interaction);
}


/**
 * 
 * @param {Discord.interaction} interaction 
 */
async function buttonHendler(interaction) {
	// Ban button start
	if (interaction.customId === 'banYes') {
		await interaction.update({ content: 'Выполнено!', embeds: [], components: [] });
		memberBanned(interaction);
	}
	if (interaction.customId === 'banNo') {
		await interaction.update({ content: 'Выполнено!', embeds: [], components: [] });
	}
	// Ban button end
	// Kick button start

	if (interaction.customId === 'kickYes') {
		await interaction.update({ content: 'Выполнено!', embeds: [], components: [] });
		memberKicked(interaction);
	}
	if (interaction.customId === 'kickNo') {
		await interaction.update({ content: 'Выполнено!', embeds: [], components: [] });
	}
	//Kick end

}
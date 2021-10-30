import Discord from 'discord.js';
import { memberBanned } from '../commands/ban.js';
import { memberKicked } from '../commands/kick.js';
import { casinoGame } from '../commands/casino.js';
import { warn } from '../commands/warn.js';





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
	//Casino start
	if (interaction.customId === 'casino_yes') {
		await interaction.update({ content: 'Да начнется игра!', components: [] });
		casinoGame(interaction);

	}
	if (interaction.customId === 'casino_no') {
		await interaction.update({ content: 'Как хотите ;)', components: [] });
	}
	//Casino end
	//Warn start
	if (interaction.customId === 'warnYes') {
		await interaction.update({ content: 'Выполняю', embeds: [], components: [] });
		warn(interaction);

	}
	if (interaction.customId === 'warnNo') {
		await interaction.update({ content: 'Отмена', embeds: [], components: [] });
	}
	//Warn end
}
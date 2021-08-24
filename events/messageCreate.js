import Discord from 'discord.js';



/**
 * 
 * @param {Discord.Message} message 
 */
function messageHandler(message) {

}


export default {
	name: 'messageCreate',
	once: false,
	execute(message) {
		messageHandler(message);
	},
};
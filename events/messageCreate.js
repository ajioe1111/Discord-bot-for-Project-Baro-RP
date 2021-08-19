const Discord = require("discord.js");
const  checkRole  = require("../service/checkRole.js");





/**
 * 
 * @param {Discord.Message} message 
 */
function getMember(message) {
	return message.member;
}

module.exports = {
	name: 'messageCreate',
	once: false,
	execute(message) {
		const member = getMember(message);
		checkRole(member);
	},
};
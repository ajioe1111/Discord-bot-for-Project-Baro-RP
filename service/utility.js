import Discord from 'discord.js';
import { commandsLogChannel } from '../events/ready.js';
import { MessageEmbed } from 'discord.js';

export function checkMemberRoles(member) {
    const roles = member.roles.cache.map(role => role.name);
    return roles;
}

/**
 * 
 * @param {Discord.GuildMember} member 
 * @param {Discord.Role} roles 
 */
export function checkPermissions(member, roles) {
    const memberRoles = checkMemberRoles(member);
    for (let i = 0; i < memberRoles.length; i++) {
        for (let j = 0; j < roles.length; j++) {
            if (memberRoles[i] == roles[j]) {
                return true;
            }
        }
    }
    return false;
}

export function createLog(commandName, message, type) {
    const embed = new Discord.MessageEmbed()
        .setColor('#F66666')
        .setTitle(commandName)
        .setDescription(message);
    let log = {
        type: type,
        message: embed
    }
    sendLogMessage(log);
}

export function sendLogMessage(msg) {
    if (msg.type == 'command') {
       commandsLogChannel.send({embeds: [msg.message]});
    }
}


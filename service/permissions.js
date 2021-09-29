import Discord from 'discord.js';
import { client, owner } from '../bot.js';
import fs from 'fs';

const commandPath = './db/commandPermissions.json';

/**
 * 
 * @param {Discord.GuildMember} member 
 */
export function checkMemberRoles(member) {
    const rolesArray = member.roles.cache.map(r => r.name);
    return rolesArray;
}

export function getGuildsId() {
    const guilds = client.guilds;
    const idArry = guilds.cache.map(guild => guild.id);
    return idArry;
}

export async function sortCommand() {
    const commandDB = fs.readFileSync(commandPath).toString();
    const commandArray = JSON.parse(commandDB);
    const guildsId = getGuildsId();
    for (let i = 0; i < commandArray.length; i++) {
        for (let j = 0; j < guildsId.length; j++) {
            if (commandArray[i].defaultPermission == false) {
                const guild = await client.guilds.cache.get(guildsId[j]);
                const commands = await guild?.commands.fetch();
                const command = commands.find(cm => cm.name === commandArray[i].commandName);
                if (command) {
                    command.defaultPermission = false;
                    guild.commands.edit(command.id, command);
                    const getModeratorRole = guild.roles.cache.find(r => r.name == 'Moderator');
                    const getGameAdminRole = guild.roles.cache.find(r => r.name == 'Game Master');
                    const getAdminRole = guild.roles.cache.find(r => r.name == 'Admin');
                    if (!getModeratorRole || !getGameAdminRole || !getAdminRole) {
                        return console.log(`Ошибка в нахождении ролей.\n Модератор ${getModeratorRole}.\n Игровой мастер: ${getGameAdminRole}.\n Админ: ${getAdminRole}`);
                    }
                    if (commandArray[i].roles == 'moderator') {
                        const permissions = [
                            {
                                id: getModeratorRole.id,
                                type: 'ROLE',
                                permission: true,
                            },
                            {
                                id: getGameAdminRole.id,
                                type: 'ROLE',
                                permission: true,
                            },
                            {
                                id: getAdminRole.id,
                                type: 'ROLE',
                                permission: true,
                            },
                        ];
                        command.permissions.set({permissions});
                    }
                    if (commandArray[i].roles == 'gameMaster') {
                        const permissions = [
                            {
                                id: getGameAdminRole.id,
                                type: 'ROLE',
                                permission: true,
                            },
                            {
                                id: getAdminRole.id,
                                type: 'ROLE',
                                permission: true,
                            },
                        ];
                        command.permissions.set({permissions});
                    }
                    if (commandArray[i].roles == 'admin') {
                        const permissions = [
                            {
                                id: getAdminRole.id,
                                type: 'ROLE',
                                permission: true,
                            },
                        ];
                        command.permissions.set({permissions});
                    }
                } else { return console.log('Ошибка в получении команды в гильдии. permissions.js sortCommand') }
            }
        }
    }
}




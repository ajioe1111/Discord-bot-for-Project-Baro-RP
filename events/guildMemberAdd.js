
import Discord from 'discord.js';
import * as fs from 'fs'
import { joinLogChannel } from './ready.js';
import moment from 'moment';
import { getName } from '../commands/randomCharacter.js';
import config from '../configuration.js';
import { client } from '../bot.js';

const databasePath = './db/list.json';
const joinMessage = `
Добро пожаловать на *Project Baro RP!*

Краткий экскурс по каналам:
<#789579914869080077> - Это Главный чат проекта.
<#809054903389519913> - Местая флудилка с мемчиками
<#796803203835887657> - Канал с обьявлениями об играх.
Так же не забудьте посетить нашу Wiki https://wiki.projectbaro.ru
Приятной игры!

 *ваш ник был изменен автоматически но вы всегда можете изменить его вручную.*
 `;

let database = getDatabase();
let userIndex;

function getDatabase() {
    const database = JSON.parse(fs.readFileSync(databasePath));
    return database;
};

function getUserIndex(member) {
    const index = database.users_list.findIndex(user => user.id === member.id);
    if (index === -1) { return false }
    else {
        userIndex = index;
        return true;
    };
};

/**
 * 
 * @param {Discord.GuildMember} member 
 */
function memberJoin(member) {
    if (member.guild.id === config.hubId) {
        memberJoinToHub(member);
        return;
    }
    else {
        memberJoinToOtherGuild(member);
        return;
    }

}
/**
 * 
 * @param {Discord.GuildMember} member 
 */
function oldMemberJoin(member) {
    if (member.guild.id === config.hubId) {
        database.users_list[userIndex].properties.join_hub = true;
        fs.writeFileSync(databasePath, JSON.stringify(database));
        let nickName = getName();
        member.setNickname(`${nickName[0]} ${nickName[1]}`);
        member.send(joinMessage);
        const embed = new Discord.MessageEmbed()
            .setColor('#80ffff')
            .setTitle('Зашел старый пользователь')
            .setAuthor('Система авторизации', 'https://media.discordapp.net/attachments/573490270025416714/841041056182960139/favpng_flame-shield.png?width=598&height=675')
            .setDescription('*пользователь уже есть в базе. join_hub изменен на true*')
            .setThumbnail(member.user.displayAvatarURL())
            .addFields(
                { name: `${member.user.tag}`, value: `<@${member.id}>`, inline: false },
            );
        joinLogChannel.send({ embeds: [embed] });
        const defRole = member.guild.roles.cache.find(r => r.id == database.server_list[0].default_role);
        if (defRole) {
            member.roles.add(defRole);
        } else { return member.send('Ошибка выдачи роли, напишите об этом администратору!') };
        return;
    } else {
        memberJoinToOtherGuild(member);
        return;
    }

}
/**
 * 
 * @param {Discord.GuildMember} member 
 */
function newMemberJoin(member) {
    let nickName = getName();
    member.setNickname(`${nickName[0]} ${nickName[1]}`);
    member.send(joinMessage);
    const defRole = member.guild.roles.cache.find(r => r.id == database.server_list[0].default_role);
    if (defRole) {
        member.roles.add(defRole);
    } else { return member.send('Ошибка выдачи роли, напишите об этом администратору!') };
    const joinEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Зашел новый пользователь!')
        .setAuthor('Система авторизации', 'https://media.discordapp.net/attachments/573490270025416714/841041056182960139/favpng_flame-shield.png?width=598&height=675')
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp()
        .addFields(
            { name: 'Tag', value: `${member.user.tag}`, inline: true },
            { name: 'ID', value: `${member.id}`, inline: true },
            { name: 'Click ID', value: `<@${member.id}>`, inline: true },
            { name: 'Username', value: `${member.displayName}`, inline: true },
            { name: 'Avatar URL', value: member.user.displayAvatarURL(), inline: true },
        );
    joinLogChannel.send({ embeds: [joinEmbed] });
    return;
}
/**
 * 
 * @param {Discord.GuildMember} member 
 */
function memberJoinToHub(member) {
    if (!getUserIndex(member)) {
        addMember(member);
        newMemberJoin(member);
        return;
    } else if (getUserIndex(member)) {
        oldMemberJoin(member);
        return;
    }
}
/**
 * 
 * @param {Discord.GuildMember} member 
 */
function memberJoinToOtherGuild(member) {
    if (database.users_list[userIndex] === undefined || database.users_list[userIndex].properties.join_hub === false) {
        const embed = new Discord.MessageEmbed()
            .setColor('#ff8040')
            .setTitle('Ошибка')
            .setAuthor('Система авторизации', 'https://media.discordapp.net/attachments/573490270025416714/841041056182960139/favpng_flame-shield.png?width=598&height=675')
            .setDescription('**Для входа на данный сервер вам необходимо авторизоваться в нашем хабе и оставаться в нем.**\n*Ваше приглашение действует 24 часа и может быть использовано всего один раз.*')
            .setTimestamp();
        member.send({ embeds: [embed] });
        joinLogChannel.createInvite({ maxAge: 86400, maxUses: 1 })
            .then(invite => member.send(`Ваша личная ссылка https://discord.gg/${invite.code}`))
            .catch(console.error);
        setTimeout(() => member.kick('Зайдите пожалуйста в хаб проекта!'), 3500);
        return;
    } else if (database.users_list[userIndex].properties.join_hub === true) {
        const guildHub = client.guilds.cache.find(g => g.id == config.hubId);
        const memberInHub = guildHub.members.cache.find(m => m.id == member.id);
        const memberNickName = memberInHub.nickname;
        member.setNickname(memberNickName);
        let embed = createJoinMessage(member);
        const botlog = member.guild.channels.cache.find(ch => ch.name == 'botlog')
        if (botlog) {
            botlog.send({ embeds: [embed] });
            // Ketsal
            if (member.guild.id === '796804573154115615') {
                const defRole = member.guild.roles.cache.find(r => r.id == database.server_list[1].default_role);
                if (defRole) {
                    member.roles.add(defRole);
                } else { return member.send('Ошибка выдачи роли, напишите об этом администратору!') };
                return;
            }
            // Infinity
            if (member.guild.id === '789580508090597396') {
                const defRole = member.guild.roles.cache.find(r => r.id == database.server_list[2].default_role);
                if (defRole) {
                    member.roles.add(defRole);
                } else { return member.send('Ошибка выдачи роли, напишите об этом администратору!') };
                return;
            }
            // Ursus
            if (member.guild.id === '799302316984762438') {
                const defRole = member.guild.roles.cache.find(r => r.id == database.server_list[3].default_role);
                if (defRole) {
                    member.roles.add(defRole);
                } else { return member.send('Ошибка выдачи роли, напишите об этом администратору!') };
                return;
            }
        } else { return console.log(`в ${member.guild.name} не найден botlog!`) };
    }
}
/**
 * 
 * @param {Discord.GuildMember} member 
 */
function addMember(member) {
    const date = moment().format('MMMM Do YYYY, hh:mm:ss a');
    const user = {
        id: member.id,
        username: member.user.username,
        properties: { level: 0, xp: 0, warn: 0, join_hub: true, coin: 0, joinDate: date, experienceGainDate: 0, stepToCoin: 0, gameLoss: 0, gameWin: 0 },
        items: []
    };
    database.users_list.push(user);
    fs.writeFileSync(databasePath, JSON.stringify(database));
    return;
};

function createJoinMessage(member) {
    const joinEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Зашел пользователь!')
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp()
        .addFields(
            { name: 'Click ID', value: `<@${member.id}>`, inline: true },
            { name: 'Username', value: `${member.displayName}`, inline: true },
            { name: 'Avatar URL', value: member.user.displayAvatarURL(), inline: true },
        );
    return joinEmbed;
};

export default {
    name: 'guildMemberAdd',
    once: false,
    execute(member) {
        getDatabase();
        getUserIndex(member);
        memberJoin(member);
        return;
    },
};

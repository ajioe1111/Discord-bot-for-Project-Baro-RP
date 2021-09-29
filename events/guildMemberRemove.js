import Discord from 'discord.js';
import * as fs from 'fs'
import { joinLogChannel, leaveLogChannel } from './ready.js';
import moment from 'moment';
import { getName } from '../commands/randomCharacter.js';
import config from '../configuration.js';
import { client } from '../bot.js';

const databasePath = './db/list.json';

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

function memberLeaveHub(member) {
    let id = member.id;
    const date = moment().format('MMMM Do YYYY, hh:mm:ss a');
    database.users_list[userIndex].properties.join_hub = false;
    fs.writeFileSync("./db/list.json", JSON.stringify(database));
    client.guilds.cache.forEach((guild) => {
        let member = guild.members.cache.find(member => member.id === id);
        if (member) {
            member.kick({ reason: `Выход из хаба` })
        }
    });
    const leaveEmbed = new Discord.MessageEmbed()
        .setColor('#f80000')
        .setTitle('Пользователь вышел!')
        .setAuthor('Система авторизации', 'https://media.discordapp.net/attachments/573490270025416714/841041056182960139/favpng_flame-shield.png?width=598&height=675')
        .setDescription('*пользователь покинул хаб и был кикнут из других серверов*')
        .setThumbnail(member.user.displayAvatarURL())
        .addFields(
            { name: 'Никнейм', value: `${member.user.tag}`, inline: true },
            { name: 'ID', value: `${member.id}`, inline: true },
            { name: 'Click ID', value: `<@${member.id}>`, inline: true },
            { name: 'Avatar URL', value: member.user.displayAvatarURL(), inline: true },
            { name: 'Дата выхода', value: date, inline: true },
        )
        .setTimestamp();
    leaveLogChannel.send({ embeds: [leaveEmbed] });
    return;
}

function memberLeaveOtherGuild(member) {
    const guild = member.guild;
    const botlog = guild.channels.cache.find(ch => ch.name === 'botlog');
    if (botlog) {
        const removeEmbed = new Discord.MessageEmbed()
            .setColor('#400000')
            .setTitle('Пользователь вышел')
            .setThumbnail(member.user.displayAvatarURL())
            .setAuthor('Система авторизации', 'https://media.discordapp.net/attachments/573490270025416714/841041056182960139/favpng_flame-shield.png?width=598&height=675')
            .addFields(
                { name: member.user.tag, value: `${member.user.tag}`, inline: false },
                { name: 'Click ID', value: `<@${member.id}>`, inline: false },
            );
        botlog.send({ embeds: [removeEmbed] });
        return;
    }
    console.log(`botlog в ${member.guild.name} не найден!`);
    return;
}

export default {
    name: 'guildMemberRemove',
    once: false,
    execute(member) {
        getDatabase();
        getUserIndex(member);
        if (member.guild.id == config.hubId) {
            return memberLeaveHub(member);
        } else {
            return memberLeaveOtherGuild(member);
        }
    },
};


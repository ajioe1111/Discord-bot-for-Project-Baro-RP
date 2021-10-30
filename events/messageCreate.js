import Discord from 'discord.js';
import fs from 'fs';
import { commandsLogChannel, hubGuild, messageLogChannel } from './ready.js';
import moment from 'moment';
import { client } from '../bot.js';
moment.locale('ru');
const path = './db/words.json';
const databasePath = './db/list.json';
let database;
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
 * @param {Discord.Message} message 
 */
function messageHandler(message) {
	if (message.author.bot) { return };
	database = getDatabase();
	getUserIndex(message.member);
	checkUrlRoles(message);
	badWords(message);
	initMembers(message);
	checkUrl(message);
	xpControl(message);
}

function xpCoolDown(experienceGainDate) {
	// 1800000 это пол часа
	let difference = new Date() - experienceGainDate;
	if (difference >= 1800000) {
		return true;
	}
	else { return false; }
}

function xpControl(message) {
	if (database.users_list[userIndex] === undefined || userIndex == -1) {
		message.reply('Ошибка в получении опыта! обратитесь к администрации.');
		return console.log('xpControl ошибка что то там кого то там :P (Не найден member в БД)');
	}
	const experienceGainDate = new Date(database.users_list[userIndex].properties.experienceGainDate);
	const getIt = xpCoolDown(experienceGainDate);
	const userID = [message.author.id];
	const channel = message.channel;
	if (getIt) {
		const randomXp = Math.floor(Math.random() * (120 - 555)) + 555;
		console.log(`${message.author} получил ${randomXp} опыта`);
		levelSystem(randomXp, userID, channel);
	}
}
/**
 * 
 * @param {Number} count 
 * @param {Discord.User} userID 
 */
export function levelSystem(count, userID, channel) {
	for (let i = 0; i < userID.length; i++) {
		xpAdd(count, userID[i], channel);
	}
}
/**
 * 
 * @param {Number} count 
 * @param {Discord.User} userID 
 */
export function xpAdd(count, userID, channel) {
	const database = JSON.parse(fs.readFileSync(databasePath));
	let userIndex = database.users_list.findIndex(user => user.id == userID);
	let setXp = database.users_list[userIndex].properties.xp + count;
	let xpRemainder = 0;
	if (count > 19999) {
		return commandsLogChannel.send(`@everyone Ошибка в получении опыта! нельзя выдать больше 19999 за раз!`);
	}
	if (setXp >= 20000) {
		xpRemainder = setXp - 20000;
		database.users_list[userIndex].properties.level = database.users_list[userIndex].properties.level + 1;
		database.users_list[userIndex].properties.xp = xpRemainder;
		addGem(userIndex, channel, userID);
		channel.send(`📈 <@${userID}> ***level up!*** твой уровень теперь **${database.users_list[userIndex].properties.level}** 📈`);
	} else {
		database.users_list[userIndex].properties.xp = setXp;
	}
	database.users_list[userIndex].properties.experienceGainDate = new Date();
	fs.writeFileSync(databasePath, JSON.stringify(database));


}
function addGem(userIndex, channel, userID) {
	let step = database.users_list[userIndex].properties.stepToCoin + 1;
	if (step >= 5) {
		database.users_list[userIndex].properties.stepToCoin = 0;
		database.users_list[userIndex].properties.coin = database.users_list[userIndex].properties.coin + 1;
		channel.send(`💎 <@${userID}> ты получил гем! 💎`);
	} else {
		database.users_list[userIndex].properties.stepToCoin = database.users_list[userIndex].properties.stepToCoin + 1;
	}
	fs.writeFileSync(databasePath, JSON.stringify(database));

}


function checkUrlRoles(message) {
	const memberRoles = message.member.roles.cache.map(role => role.name)
	const isMod = memberRoles.some(role => role == 'MOD');
	const isModderator = memberRoles.some(role => role == 'Moderator');
	const isGameMaster = memberRoles.some(role => role == 'Game Master');
	const isAdmin = message.member.permissions.has('ADMINISTRATOR');
	const isMuted = message.member.roles.cache.some(role => role.name == 'mute');
	const isBot = message.author.bot;
	let hasAccess = isMod
		|| isModderator
		|| isGameMaster
		|| isBot
		|| isAdmin;

	hasAccess &= !isMuted;

	if (hasAccess) {
		return true;
	}
	if (message.content.startsWith(`https://discord.com/channels/@me`)) {
		return true;
	}
	if (message.channel.id == '809054903389519913') {
		return true;
	}

	if (message.channel.id == '835454588743974923' && hasAccess || message.channel.id == '835454542459437086' && hasAccess) {
		return true;
	}

	else { return false };
}

function checkUrl(message) {

	if (checkUrlRoles(message)) {
		return;
	}
	let lowerContent = message.content.toLowerCase();
	let url = ['http', 'https', '.www', '://', '.ru', '.com', '.net', '.info', 'ht_ps:', '//www.'];
	let isUrl = url.some(url => lowerContent.includes(url));
	if (isUrl) {
		message.channel.send('У вас нету прав на отправку ссылок!').then(message.delete());
		const embed = new Discord.MessageEmbed()
			.setColor('#ff8040')
			.setTitle('Ссылка!')
			.setAuthor(message.author.username, message.author.displayAvatarURL())
			.addFields(
				{ name: 'Пользователь', value: `<@${message.author.id}>`, inline: false },
				{ name: 'Сообщение ', value: message.content, inline: false },
				{ name: 'Канал', value: `<#${message.channel.id}>`, inline: true },
				{ name: 'ID Сообщения', value: message.id, inline: true },
			)
			.setTimestamp()
		messageLogChannel.send({ embeds: [embed] });
		return;
	}
}

function initMembers(message) {
	if (message.content == '!init') {
		if (message.author.id === '333660691644809216') {
			const database = JSON.parse(fs.readFileSync("./db/list.json"));
			let findGuild = client.guilds.cache.find(guild => guild.id === '787699629944864839')
			let arrMembers = findGuild.members.cache.map(guildMember => guildMember.id);
			let memberName = findGuild.members.cache.map(guildMember => guildMember.user.username);
			let memberJoinDate = findGuild.members.cache.map(guildMember => guildMember.joinedAt);
			for (let i = 0; i < arrMembers.length; i++) {
				let userIndex = database.users_list.findIndex(user => user.id == arrMembers[i]);
				if (userIndex === -1) {
					const user = {
						id: arrMembers[i],
						username: memberName[i],
						properties: {
							level: 0,
							xp: 0,
							warn: 0,
							join_hub: true,
							coin: 0,
							joinDate: memberJoinDate[i],
							experienceGainDate: 0,
							stepToCoin: 0,
							gameLoss: 0,
							gameWin: 0
						}
					}
					database.users_list.push(user);
				};
				fs.writeFileSync("./db/list.json", JSON.stringify(database));
			};
		}
		else {
			message.reply('Эта команда доступна лишь владельцу бота!');
			return;
		}


	}
}

function badWords(message) {
	let msg = message.content.toLowerCase();
	let words = fs.readFileSync(path).toString();
	let arr = JSON.parse(words);
	let badWord;
	let isBannedWord = arr.some(word => {
		if (msg.split(' ').includes(word)) {
			badWord = word;
			return true;
		}
	});
	if (isBannedWord) {
		message.delete({ timeout: 0 })
		const embed = new Discord.MessageEmbed()
			.setColor('#ff0000')
			.setAuthor(`${message.author.username} написал(а) плохое слово!`, message.author.displayAvatarURL())
			.setTimestamp()
			.addFields(
				{ name: 'Пользователь', value: `<@${message.author.id}>`, inline: true },
				{ name: 'Слово ', value: badWord, inline: true },
				{ name: 'Полное сообщение ', value: message.content, inline: true },
				{ name: 'Сервер', value: message.guild.name, inline: true },
				{ name: 'Канал', value: `<#${message.channel.id}>`, inline: true },
				{ name: 'ID Сообщения', value: message.id, inline: true },
				{ name: 'Время', value: moment().format('MMMM Do YYYY, hh:mm:ss a'), inline: false },
			);

		return messageLogChannel.send({ embeds: [embed] });
	}
}

export default {
	name: 'messageCreate',
	once: false,
	execute(message) {
		messageHandler(message);
	},
};
import Discord from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { checkPermissions, sendLogMessage } from '../service/utility.js';
import { client, owner } from '../bot.js';
const promisify = f => (...args) => new Promise((a, b) => f(...args, (err, res) => err ? b(err) : a(res)));
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

export default {
    data: new SlashCommandBuilder()
        .setName('рандомный_персонаж')
        .setDescription('Позволяет получить рандомного персонажа для игры'),
    async execute(interaction) {
        await interaction.reply(`Ваш будет отправлен вам личным сообщением`);
        await wait(5000);
        randomCharacter(interaction);
    },
};


/**
 * 
 * @param {Discord.Interaction} interaction
 */
export function randomCharacter(interaction) {
    const member = interaction.member;
    const guild = client.guilds.cache.find(guild => guild.id == interaction.guild.id);
    const botlog = guild.channels.cache.find(channel => channel.name == 'botlog');
    if (!botlog) {
        console.log('Ошибка! не найден канал botlog! создайте его и повторите попытку');
        return;
    }

    let age = Math.floor(Math.random() * (25 - 45)) + 45;
    let ageString = String(age);
    let playerName = getName();
    let buff = getBuff();
    let deBuff = getDeBuff();
    let quality = getQuality();
    let family = getFamily();
    let check = compatibilityCheck(buff, deBuff, quality);
    while (check == false) {
        buff = getBuff();
        deBuff = getDeBuff();
        quality = getQuality();
        check = compatibilityCheck(buff, deBuff, quality);
    };
    const embed = new Discord.MessageEmbed()
        .setColor('#0080ff')
        .setTitle('Ваш персонаж')
        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
        .setDescription(`персонаж игрока ${interaction.user}`)
        .setThumbnail(interaction.user.displayAvatarURL())
        .addFields(
            { name: 'Имя и Фамилия', value: `${playerName[0]} ${playerName[1]}`, inline: true },
            { name: 'Возраст', value: ageString, inline: true },
            { name: 'Семья', value: family, inline: true },
            { name: buff[0], value: buff[1], inline: false },
            { name: deBuff[0], value: deBuff[1], inline: false },
            { name: quality[0], value: quality[1], inline: false },
        )
        .setTimestamp()
        .setFooter('Система рандом', 'https://media.discordapp.net/attachments/573490270025416714/843932341247541248/pngegg.png?width=845&height=486');

    member.send({ embeds: [embed] });
    botlog.send({ embeds: [embed] });
}

function getFamily() {
    let family = ['Есть жена', 'Есть жена и дети', 'Есть дети', 'Холост'];
    let index = Math.floor(Math.random() * family.length);
    return family[index];

}

function compatibilityCheck(buff, deBuff, quality) {
    if (buff == 'Уверенность' && deBuff == 'Трусость') { return false; };
    if (buff == 'Уверенность' && deBuff == 'Непостоянство') { return false; };
    if (buff == 'Стрессоустойчивость' && deBuff == 'Агрессивность') { return false; };
    if (buff == 'Стрессоустойчивость' && deBuff == 'Биполяр') { return false; };
    if (buff == 'Стрессоустойчивость' && quality == 'Раздражительность') { return false; };
    if (buff == 'Отважность' && deBuff == 'Трусость') { return false; };
    if (buff == 'Мудрость' && deBuff == 'Тупость') { return false; };
    if (deBuff == 'Неуважение' && quality == 'Жертвенность') { return false; };
    if (deBuff == 'Агрессивность' && quality == 'Дружелюбность') { return false; };
}



export function getName() {
    let fullName = [];
    const firstName = ["Владимир", "Андрей", "Тигран", "Илья", "Ян", "Артём", "Дмитрий", "Николай", "Даниил", "Максим", "Глеб", "Ярослав", "Фёдор", "Михаил", "Арсений", "Егор", "Мирослав", "Денис", "Леонид", "Матвей", "Тимофей", "Захар", "Владислав", "Кирилл", "Григорий", "Иван", "Марк", "Александр", "Степан", "Виктор", "Савелий", "Ибрагим", "Василий", "Яков", "Георгий", "Евгений", "Станислав", "Данила", "Роберт", "Никита", "Сергей", "Мирон", "Всеволод", "Олег", "Константин", "Филипп", "Роман", "Тимур", "Герман", "Родион", "Лев", "Вадим", "Виталий", "Анатолий", "Павел", "Дамир", "Антон", "Леон", "Алексей", "Давид", "Платон", "Макар", "Борис", "Артемий", "Эмир", "Савва", "Артур", "Игорь", "Марат", "Гордей", "Семён", "Даниэль", "Демид", "Богдан", "Эмиль", "Серафим", "Тихон", "Лука", "Руслан", "Марсель", "Пётр", "Елисей", "Юрий", "Али", "Аркадий", "Вячеслав", "Билал", "Святослав", "Адам", "Эрик", "Майкл"];
    const secondName = ["Дмитриев", "Галкин", "Алексеев", "Горячев", "Лазарев", "Петров", "Золотарев", "Исаев", "Соколов", "Черняев", "Фокин", "Козлов", "Васильев", "Акимов", "Борисов", "Гуров", "Ершов", "Поляков", "Самойлов", "Фетисов", "Александров", "Федоров", "Богданов", "Михайлов", "Рудаков", "Комаров", "Седов", "Антонов", "Воробьев", "Курочкин", "Соболев", "Беляков", "Матвеев", "Сергеев", "Сахаров", "Климов", "Сазонов", "Комаров", "Семенов", "Попов", "Кудрявцев", "Терехов", "Колесников", "Кузнецов", "Зубов", "Волков", "Игнатов", "Ананьев", "Лавров", "Соколов", "Ильин", "Горшков", "Афанасьев", "Фомин", "Румянцев", "Львов", "Баранов", "Максимов", "Алексеев", "Белоусов", "Иванов", "Волков", "Шувалов", "Муравьев", "Карпов", "Никифоров", "Молчанов", "Прокофьев", "Вешняков", "Евсеев", "Воробьев", "Горячев", "Белов", "Морозов", "Никольский", "Агафонов", "Чернов", "Козлов", "Кузнецов", "Рожков", "Архипов", "Моисеев", "Белов", "Жуков", "Сорокин", "Смирнов", "Борисов", "Прайс"];
    let firstPlayerName = firstName[Math.floor(Math.random() * firstName.length)];
    let secondPlayerName = secondName[Math.floor(Math.random() * secondName.length)];
    fullName.push(firstPlayerName, secondPlayerName);
    return fullName;
}

function getBuff() {
    const buffName = ["Уверенность", "Стрессоустойчивость", "Отважность", "Крепкое здоровье", "Самостоятельность", "Мудрость", "Внимательность", "Находчивость", "Осторожность"];
    const buffDesc = ["Вы уверены в своих действиях.", "Вы умеете держать себя в руках даже в самые трудные моменты жизни.", "Вам нестрашны не клоун в команде, не монстры из глубины.", "Вы способны игнорировать раны и ссадины пока они не начинают доставлять хлопот.", "В большинстве случаев вы не будете дожидаться кого либо, вы воспользуетесь своими знаниями, что бы решить проблему.", "Вы достаточно обучены и опытны, что бы стать хорошим лидером в тяжелой ситуации.", "Вы способны обращать внимание на всё подряд.", "Вы можете найти решение почти любой проблемы, по крайне мере вам так кажется.", "Вы предпочитаете действовать аккуратно... разумеется по мере необходимости."];
    let index = Math.floor(Math.random() * buffName.length);
    let buff = [buffName[index], buffDesc[index]];
    return buff;
}

function getDeBuff() {
    const deBuffName = ['Трусость', 'Усталость', 'Агрессивность', 'Тупость', 'Непостоянство', 'Алкоголизм', 'Эгоизм', 'Биполяр', 'Критичность', 'Недовольство', 'Мстительность', 'Ложь', 'Неуважение', 'Непослушание', 'Равнодушие', 'Наглость'];
    const deBuffDesc = ['Вы постоянно остерегаетесь чего-то нового или того что происходит вокруг вас, а трудных ситуациях вы всегда стараетесь избегать.', 'Вы постоянно чувствуете себя уставшим и всегда хотите отдохнуть.', 'Вы испытываете сильную агрессию ко всему и всем. При наездах на себя вы пытаетесь устроить драку.', 'Иногда вы просто не способны решить простые вопросы или проблемы.', 'Иногда вы можете предпринимать самые непонятные или не логичные действия.', 'Вас опасно оставлять один на один с бутылкой этанола…', 'Вы чаще всего будете делать то что выгоднее именно вам наплевав на остальных, в принятии решения или действиях это также выявляется.', 'Иногда вы весёлый иногда вы грустный иногда злой или добрый, и также можете как принимать логичные решения, так и бессмысленные.', 'Вы часто критикуете людей и действия остальных несмотря на то какие они.', 'Вы постоянно чем то или кем, то недовольны.', 'Если вам сделали что-то плохое или, то что вам причинило вред, вы обязательно отомстите ему.', 'Вы очень часто врёте людям.', 'Вы не уважаете других людей ', 'Вы часто нарушаете приказы и не слушаетесь остальных.', 'Вы равнодушны по отношению к остальным.', 'Бесцеремонное поведение.'];
    let index = Math.floor(Math.random() * deBuffName.length);
    let deBuff = [deBuffName[index], deBuffDesc[index]];
    return deBuff;
}

function getQuality() {
    const qualityName = ['Любознательность', 'Целеустремленность', 'Дружелюбность', 'Справедливость', 'Трудолюбие', 'Психолог', 'Жертвенность', 'Бескорыстие', 'Заботливость', 'Раздражительность', 'Противоречивость', 'Вера'];
    const qualityDesc = ['Вам очень интересно изучать мир и вещи вокруг вас.', 'Вы стараетесь добиваться своих целей любой ценой.', 'Вы всегда стараетесь помочь всем и каждому даже когда вам это не выгодно.', 'Вы всегда за справедливость и честность, вы стараетесь принимать более моральные решение чем объективные', 'Вы очень сильно любите трудиться!', 'Вы часто любите рассуждать над чем-то или что-то рассказывать.', 'Вы лучше пожертвуете собой чем кем-то другим на благо других.', 'Вы очень бескорыстный человек.', 'Вы заботитесь о других и помогаете им чаще чем себе.', 'Вас очень легко раздразнить', 'Вы часто противоречите сами себе и своим действиям.', 'Вы истинно верите в присутствие бога на этой планете… может он вас даже слушает.'];
    let index = Math.floor(Math.random() * qualityName.length);
    let quality = [qualityName[index], qualityDesc[index]];
    return quality;


}
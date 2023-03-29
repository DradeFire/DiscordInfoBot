const dotenv = require('dotenv');
dotenv.config()

const Discord = require('discord.js');
const { IntentsBitField } = require('discord.js');
const cheerio = require('cheerio');
const fs = require('fs');
const axios = require('axios');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));
const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: false })

var bot = new Discord.Client({ intents: [IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages] });

var isInfoShareStarted_week = false
var isInfoShareStarted_daily = false


bot.on("ready", function () {
	console.log("Ready to begin!")
});
bot.on("disconnected", function () {
	console.log("Disconnected!");
	process.exit(1);
});

const getHTML = async (url) => {

	try {
		const { data } = await client.get(url, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Accept-Encoding': 'gzip, deflate, br'
			},
			withCredentials: true
		})
		return cheerio.load(data)
	} catch (err) {
		fs.writeFileSync('./some.txt', JSON.stringify(err));
		console.log(err)
		return cheerio.load('<!DOCTYPE html><html lang="en">	<head>  <meta name="description" content="Webpage description goes here" />  <meta charset="utf-8">  <title>Change_me</title>  <meta name="viewport" content="width=device-width, initial-scale=1">  <meta name="author" content="">  <link rel="stylesheet" href="css/style.css">  <script src="http://code.jquery.com/jquery-latest.min.js"></script></head><body>  <div class="container">  </div>		<script></script></body></html>')
	}
}

bot.on("messageCreate", (msg) => {
	if (msg.content.indexOf("Daily_Info") === 0 && !isInfoShareStarted_daily) {

		isInfoShareStarted_daily = true

		msg.reply("На сегодня следующие раздачи:")
		getHTML("https://ru.giveawayoftheday.com/").then(($) => {
			$('.giveaway_buttons').each((_index, val) => {
				$(val).find('a').each((_i, v) => {
					console.log($(v).attr('href'))
					msg.reply($(v).attr('href'))
						.then(msg => {
							setTimeout(() => msg.delete(), 86400_000)
						})
						.catch(e => {
							console.log(e)
						})
				})
			})
		})

		setInterval(() => {
			console.log("day interval")
			msg.reply("На сегодня следующие раздачи:")
			getHTML("https://ru.giveawayoftheday.com/").then(($) => {
				$('.giveaway_buttons').each((_index, val) => {
					$(val).find('a').each((_i, v) => {
						console.log($(v).attr('href'))
						msg.reply($(v).attr('href'))
							.then(msg => {
								setTimeout(() => msg.delete(), 86400_000)
							})
							.catch(e => {
								console.log(e)
							})


					})
				})
			})
		}, 86400_000);

	}
	if (msg.content.indexOf("Week_Info") === 0 && !isInfoShareStarted_week) {

		isInfoShareStarted_week = true

		msg.reply("Epic Games - следующие раздачи:")
		nightmare
			.goto('http://store.epicgames.com/ru')
			.evaluate(() => {
				return document.body.innerHTML
			})
			.end()
			.then((val) => {
				const $ = cheerio.load(val)
				$('.css-aere9z').each((_i1, v1) => {
					$(v1).find('div').each((_i2, v2) => {
						$(v2).find('a').each((_i3, v3) => {
							const validateText = $(v3).attr('aria-label')
							if (validateText.startsWith("Бесплатные игры")) {
								console.log(validateText)
								msg.reply('http://store.epicgames.com' + $(v3).attr('href'))
									.then(msg => {
										setTimeout(() => msg.delete(), 86400_000 * 7)
									})
									.catch(e => {
										console.log(e)
									})
							}
						})
					})
				})
			})
			.catch(error => {
				console.error('Search failed:', error)
			})


		setInterval(() => {
			console.log("week interval")
			msg.reply("Epic Games - следующие раздачи:")
			nightmare
				.goto('http://store.epicgames.com/ru')
				.evaluate(() => {
					return document.body.innerHTML
				})
				.end()
				.then((val) => {
					const $ = cheerio.load(val)
					$('.css-aere9z').each((_i1, v1) => {
						$(v1).find('div').each((_i2, v2) => {
							$(v2).find('a').each((_i3, v3) => {
								const validateText = $(v3).attr('aria-label')
								if (validateText.startsWith("Бесплатные игры")) {
									console.log(validateText)
									msg.reply('http://store.epicgames.com' + $(v3).attr('href'))
										.then(msg => {
											setTimeout(() => msg.delete(), 86400_000 * 7)
										})
										.catch(e => {
											console.log(e)
										})
								}
							})
						})
					})
				})
				.catch(error => {
					console.error('Search failed:', error)
				})
		}, 86400_000 * 7);
	}
});

bot.login(process.env.TOKEN);
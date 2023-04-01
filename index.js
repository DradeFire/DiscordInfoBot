const dotenv = require('dotenv');
dotenv.config()

const process = require('process');
const Discord = require('discord.js');
const { IntentsBitField } = require('discord.js');
const cheerio = require('cheerio');
const fs = require('fs');
const axios = require('axios');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');
const Xvfb = require('xvfb');
const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));
const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: false, maxHeight: 8000 })
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const gm = require('gm');

var bot = new Discord.Client({ intents: [IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages] });

var isInfoShareStarted_week = false
var isInfoShareStarted_epic = false
var isInfoShareStarted_xbox = false

var xvfb = new Xvfb();
xvfb.startSync();

const document = new JSDOM().window.document

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

var gameList = []
var msgList = []

bot.on("messageCreate", (msg) => {
	if (msg.content.indexOf("Daily") === 0 && !isInfoShareStarted_epic) {

		isInfoShareStarted_epic = true

		const daily_fun = () => {
			getHTML("https://ru.giveawayoftheday.com/").then(($) => {
				msg.reply("На сегодня следующие раздачи:")
					.then(msg => {
						setTimeout(() => msg.delete(), 86400_000)
					})
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
		}

		daily_fun()

		setInterval(() => {
			console.log("interval (Daily)")
			daily_fun()
		}, 86400_000)

	}
	if (msg.content.indexOf("Epic") === 0 && !isInfoShareStarted_week) {

		isInfoShareStarted_week = true

		const epic_fun = () => {
			nightmare
				.goto('http://store.epicgames.com/ru')
				.wait(5000)
				.evaluate(() => {
					return document.body.innerHTML
				})
				.then((val) => {
					const localGameList = []
					const localMsgList = []

					const $ = cheerio.load(val)
					$('.css-aere9z').each((_i1, v1) => {
						$(v1).find('div').each((_i2, v2) => {
							$(v2).find('a').each((_i3, v3) => {
								const validateText = $(v3).attr('aria-label')
								if (validateText.startsWith("Бесплатные игры")) {
									localGameList.push('http://store.epicgames.com' + $(v3).attr('href'))
									console.log(validateText)
								}
							})
						})
					})
					console.log(gameList.length)
					console.log(localGameList.length)
					if (gameList.length === localGameList.length) {
						for (let index = 0; index < gameList.length; index++) {
							if (gameList.at(index) !== localGameList.at(index)) {
								for (let index = 0; index < gameList.length; index++) {
									gameList.pop()
								}
								for (let index = 0; index < msgList.length; index++) {
									msgList.at(index).delete()
								}
								localGameList.forEach((val, _i, _arr) => {
									msg.reply(val)
										.then(msg => {
											localMsgList.push(msg)
										})
										.catch(e => {
											console.log(e)
										})
								})
								gameList = localGameList
								msgList = localMsgList
							}
						}
					} else {
						for (let index = 0; index < gameList.length; index++) {
							gameList.pop()
						}
						for (let index = 0; index < msgList.length; index++) {
							msgList.at(index).delete()
						}
						localGameList.forEach((val, _i, _arr) => {
							msg.reply(val)
								.then(msg => {
									localMsgList.push(msg)
								})
								.catch(e => {
									console.log(e)
								})
						})
						gameList = localGameList
						msgList = localMsgList
					}
				})
				.catch(error => {
					console.error('Search failed:', error)
				})
		}

		epic_fun()

		setInterval(() => {
			console.log("interval (Epic)")
			epic_fun()
		}, 86400_000);
	}
	if (msg.content.indexOf("Xbox") === 0 && !isInfoShareStarted_xbox) {

		isInfoShareStarted_xbox = true

		const xbox_fun = () => {
			nightmare
				.viewport(1700, 1400)
				.goto('https://www.xbox.com/ru-RU/xbox-game-pass/games#')
				.click('.platpc')
				.wait(10000)
				.click("a[data-col=pcrecent]")
				.wait(10000)
				.scrollTo(1100, 200)
				.screenshot('generated.png')
				.then(() => {
					gm("./generated.png")
						.crop(1100, 1300, 350, 90)
						.write('./generated2.png', (err) => {
							console.log(err)
							msg.channel.send("Свежее пополнение Xbox Game Pass: \nhttps://www.xbox.com/ru-RU/xbox-game-pass/games#")
								.then(msg => {
									setTimeout(() => msg.delete(), 86400_000 * 14)
								})
								.catch((err) => {
									console.log(err)
								});
							msg.channel.send({ files: [{ attachment: "./generated2.png" }] })
								.then(msg => {
									setTimeout(() => msg.delete(), 86400_000 * 14)
								})
								.catch((err) => {
									console.log(err)
								});
						})
				})
				.catch((err) => {
					console.log(err)
				})
		}

		xbox_fun()

		setInterval(() => {
			console.log("interval (Xbox)")
			xbox_fun()
		}, 86400_000 * 14)

	}
});

bot.login(process.env.TOKEN);
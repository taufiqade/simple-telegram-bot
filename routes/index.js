const express = require('express');
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

const router = express.Router();

const token = process.env.TELEGRAM_ACCESS_TOKEN;
const bot = new TelegramBot(token, { polling: true});

router.get('/', (req, res) => {
  res.send('JOS');
});

bot.onText(/\/help/, (msg, match) => {
	const chatId = msg.chat.id;
	const resp = 'Untuk mendapatkan cuaca sekarang dengan menggunakan perintah /cuaca [kota], contoh : /cuaca Yogyakarta';
	
	bot.sendMessage(chatId, resp);
});

bot.onText(/\/cuaca (.+)/, (msg, match) => {
	// get first world (city) after /cuaca
	const str = match[1];
	const result = str.split(str.match(/\W+/g));
	const city = result[0];

	const weatherbitUrl = `https://api.weatherbit.io/v1.0/current/geosearch`;
	const key = process.env.WEATHERBIT_KEY;

	axios.get(`${weatherbitUrl}`, {
		params:{
			key: key,
			city: city,
			country: "id",
			lang: "id"
		}
	}) 
	.then(function (response) {
		if( response.status == 200) {
			const weather = response.data.data[0].weather.description || 'tidak ditemukan';
			const answer = `Cuaca ${ city } sekarang : ${ weather }`;
			bot.sendMessage(msg.chat.id, answer);
		} else {
			bot.sendMessage(msg.chat.id, `wilayah yang anda masukan salah, contoh /cuaca jakarta`);
		}
	})
	.catch(function (error) {
		console.log('error');
		console.log(error);
	});
});

bot.on('polling_error', (error) => {
	console.log(error.code);  // => 'EFATAL'
});

module.exports = router;
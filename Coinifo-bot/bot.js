// Import the TelegramBot module and necessary configurations and database setup
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const db = require('./src/database/db');

// Import each command module
const calculateCommand = require('./src/commands/calculate');
const favoriteCryptosCommand = require('./src/commands/favoriteCryptos');
const priceCommand = require('./src/commands/price');
const setCryptoCommand = require('./src/commands/setCrypto');
const setTimeCommand = require('./src/commands/setTime');
const startCommand = require('./src/commands/start');

// Create a new instance of the Telegram bot with polling enabled
const bot = new TelegramBot(config.telegramToken, { polling: true });

// Initialize all command modules, passing in the bot instance and database where needed
startCommand(bot, db);
calculateCommand(bot);
favoriteCryptosCommand(bot, db);
priceCommand(bot);
setCryptoCommand(bot, db);
setTimeCommand(bot, db);

// Log to confirm that the bot is running
console.log('Bot is running...');

// code by amiriiw
const TelegramBot = require('node-telegram-bot-api');
const mysql = require('mysql2/promise');
const axios = require('axios');


class CryptoBot {
    constructor(telegramToken, coinMarketCapApiKey) {
        // Initialize the Telegram bot and CoinMarketCap API

        this.bot = new TelegramBot(telegramToken, { polling: true });
        this.apiUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
        this.coinMarketCapApiKey = coinMarketCapApiKey;
        this.initializeDatabase();
        this.initialize();
        this.intervals = {};
    }

    async initializeDatabase() {
        // Connect to MySQL and create 'users' table if not exists

        this.db = await mysql.createConnection({
            host: 'localhost',
            user: 'user name',
            password: 'password',
            database: 'database name'
        });
        await this.db.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id BIGINT UNIQUE,
                username VARCHAR(255),
                favorite_cryptos TEXT,
                notify_status VARCHAR(10),
                notify_start_time DATETIME
            )
        `);
    }

    initialize() {
        // Define bot commands and link them to handler functions

        this.bot.onText(/\/start/, this.handleStartCommand.bind(this));
        this.bot.onText(/\/price/, this.handlePriceCommand.bind(this));
        this.bot.onText(/\/setcrypto/, this.handleSetCryptoCommand.bind(this));
        this.bot.onText(/\/mf/, this.handleFavoriteCryptoCommand.bind(this));
        this.bot.onText(/\/settime/, this.handleSetTimeCommand.bind(this));
        this.bot.onText(/\/calculate/, this.handleCalculateCommand.bind(this));
        console.log('Bot is running...');
    }

    async saveUserInfo(msg) {
        // Save or update user info in the database

        const userId = msg.from.id;
        const username = msg.from.username || '';
        if (username) {
            await this.db.execute(
                `INSERT INTO users (user_id, username)
                 VALUES (?, ?)
                 ON DUPLICATE KEY UPDATE username = VALUES(username)`,
                [userId, username]
            );
        }
    }

    handleStartCommand(msg) {
        // Send welcome message with list of available commands

        const userId = msg.from.id;
        this.saveUserInfo(msg);
        const welcomeMessage = `
Welcome to the CryptoBot! Here are the commands you can use:
/price - Get the most known crypto prices
/mf - Your favorite cryptos
/setcrypto - Set your favorite cryptos
/settime - Activate or deactivate automatic price updates  
/calculate - Calculate the price of your assets
        `;
        this.bot.sendMessage(userId, welcomeMessage);
    }

    async handlePriceCommand(msg) {
        // Fetch and display top 10 cryptocurrency prices from CoinMarketCap

        const userId = msg.from.id;
        try {
            const response = await axios.get(this.apiUrl, {
                headers: { 'X-CMC_PRO_API_KEY': this.coinMarketCapApiKey },
                params: { limit: 10 }
            });
            const cryptocurrencies = response.data.data;
            for (const crypto of cryptocurrencies) {
                const { name, symbol, quote: { USD } = {} } = crypto;
                const { price, market_cap, volume_24h, percent_change_24h } = USD || {};
                const message = `
Name: ${name}
Symbol: ${symbol}
Price: $${price ? price.toFixed(2) : 'N/A'}
Market Cap: $${market_cap ? market_cap.toLocaleString() : 'N/A'}
24h Volume: $${volume_24h ? volume_24h.toLocaleString() : 'N/A'}
24h Change: ${percent_change_24h ? percent_change_24h.toFixed(2) : 'N/A'}%
                `;
                await this.bot.sendMessage(userId, message);
            }
        } catch (error) {
            console.error('Error fetching data from CoinMarketCap:', error);
            this.bot.sendMessage(userId, 'Sorry, there was an error fetching data.');
        }
    }

    async handleSetCryptoCommand(msg) {
        // Ask user to set their favorite cryptocurrencies and save to database

        const userId = msg.from.id;
        const askForCryptos = `Please send your favorite cryptos as a comma-separated list (e.g., Bitcoin,Ethereum,Tether).`;
        this.bot.sendMessage(userId, askForCryptos);
        this.bot.once('message', async (reply) => {
            const favoriteCryptos = reply.text.split(',').map(crypto => {
                return crypto.trim().charAt(0).toUpperCase() + crypto.trim().slice(1).toLowerCase();
            });
            try {
                const response = await axios.get(this.apiUrl, {
                    headers: { 'X-CMC_PRO_API_KEY': this.coinMarketCapApiKey },
                });
                const availableCryptos = response.data.data.map(crypto => crypto.name);
                const validCryptos = [];
                const invalidCryptos = [];
                favoriteCryptos.forEach(crypto => {
                    if (availableCryptos.includes(crypto)) {
                        validCryptos.push(crypto);
                    } else {
                        invalidCryptos.push(crypto);
                    }
                });
                if (validCryptos.length > 0) {
                    await this.db.execute(
                        `UPDATE users SET favorite_cryptos = ? WHERE user_id = ?`,
                        [validCryptos.join(','), userId]
                    );
                    this.bot.sendMessage(userId, `Saved the following cryptos: ${validCryptos.join(', ')}.`);
                }
                if (invalidCryptos.length > 0) {
                    this.bot.sendMessage(userId, `The following cryptos were not found and were not saved: ${invalidCryptos.join(', ')}.`);
                }
            } catch (error) {
                console.error('Error fetching data from CoinMarketCap:', error);
                this.bot.sendMessage(userId, 'Sorry, there was an error fetching crypto data.');
            }
        });
    }

    async handleFavoriteCryptoCommand(msg) {
        // Fetch and display prices for user's favorite cryptocurrencies

        const userId = msg.from.id;
        const [row] = await this.db.execute(`SELECT favorite_cryptos FROM users WHERE user_id = ?`, [userId]);
        if (!row.length || !row[0].favorite_cryptos) {
            this.bot.sendMessage(userId, 'You have not set any favorite cryptos yet.');
            return;
        }
        const favoriteCryptos = row[0].favorite_cryptos.split(',');
        try {
            const response = await axios.get(this.apiUrl, {
                headers: { 'X-CMC_PRO_API_KEY': this.coinMarketCapApiKey },
            });
            const cryptocurrencies = response.data.data;
            const selectedCryptos = cryptocurrencies.filter(crypto => favoriteCryptos.includes(crypto.name));
            for (const crypto of selectedCryptos) {
                const { name, symbol, quote: { USD } = {} } = crypto;
                const { price, market_cap, volume_24h, percent_change_24h } = USD || {};
                const message = `
Name: ${name}
Symbol: ${symbol}
Price: $${price ? price.toFixed(2) : 'N/A'}
Market Cap: $${market_cap ? market_cap.toLocaleString() : 'N/A'}
24h Volume: $${volume_24h ? volume_24h.toLocaleString() : 'N/A'}
24h Change: ${percent_change_24h ? percent_change_24h.toFixed(2) : 'N/A'}%
                `;
                await this.bot.sendMessage(userId, message);
            }
        } catch (error) {
            console.error('Error fetching data from CoinMarketCap:', error);
            this.bot.sendMessage(userId, 'Sorry, there was an error fetching data.');
        }
    }

    async handleCalculateCommand(msg) {
        // Ask user for cryptocurrency and amount to calculate total value

        const userId = msg.from.id;
        const askForCrypto = 'Please send the name of the cryptocurrency (e.g., Bitcoin).';
        this.bot.sendMessage(userId, askForCrypto);
        this.bot.once('message', async (cryptoReply) => {
            let cryptoName = cryptoReply.text.trim();
            cryptoName = cryptoName.charAt(0).toUpperCase() + cryptoName.slice(1).toLowerCase();  // Capitalize first letter
            const askForAmount = `Please send the amount of ${cryptoName} you have.`;
            this.bot.sendMessage(userId, askForAmount);
            this.bot.once('message', async (amountReply) => {
                const amount = parseFloat(amountReply.text);
                if (isNaN(amount)) {
                    this.bot.sendMessage(userId, 'Invalid amount. Please enter a valid number.');
                    return;
                }
                try {
                    const response = await axios.get(this.apiUrl, {
                        headers: { 'X-CMC_PRO_API_KEY': this.coinMarketCapApiKey },
                    });
                    const crypto = response.data.data.find(crypto => crypto.name === cryptoName);
                    if (!crypto) {
                        this.bot.sendMessage(userId, `Sorry, ${cryptoName} is not available.`);
                        return;
                    }
                    const value = crypto.quote.USD.price * amount;
                    this.bot.sendMessage(userId, `The value of your ${amount} ${cryptoName} is $${value.toFixed(2)}.`);
                } catch (error) {
                    console.error('Error fetching data from CoinMarketCap:', error);
                    this.bot.sendMessage(userId, 'Sorry, there was an error fetching data.');
                }
            });
        });
    }

    async handleSetTimeCommand(msg) {
        // Toggle automatic notifications for favorite cryptos

        const userId = msg.from.id;
        const options = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Activate', callback_data: 'activate' },
                        { text: 'Deactivate', callback_data: 'deactivate' }
                    ]
                ]
            }
        };
        this.bot.sendMessage(userId, 'Do you want to activate or deactivate notifications?', options);
        this.bot.once('callback_query', async (query) => {
            const action = query.data;
            const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
            if (action === 'activate') {
                if (this.intervals[userId]) {
                    this.bot.sendMessage(userId, 'Notifications are already active.');
                    return;
                }
                await this.db.execute(
                    `UPDATE users SET notify_status = ?, notify_start_time = ? WHERE user_id = ?`,
                    ['active', currentTime, userId]
                );
                this.intervals[userId] = setInterval(() => {
                    this.handleFavoriteCryptoCommand(msg);
                }, 30 * 60 * 1000);
                this.bot.sendMessage(userId, 'Notifications have been activated.');
            } else if (action === 'deactivate') {
                clearInterval(this.intervals[userId]);
                delete this.intervals[userId];
                await this.db.execute(
                    `UPDATE users SET notify_status = ?, notify_start_time = ? WHERE user_id = ?`,
                    ['inactive', currentTime, userId]
                );
                this.bot.sendMessage(userId, 'Notifications have been deactivated.');
            }
        });
    }
}


const telegramToken = 'your token';
const coinMarketCapApiKey = 'your api key';
const bot = new CryptoBot(telegramToken, coinMarketCapApiKey);

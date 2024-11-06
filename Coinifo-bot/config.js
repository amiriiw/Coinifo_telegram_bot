// Load environment variables from the .env file
require('dotenv').config();

module.exports = {
    // Bot token for accessing the Telegram API
    telegramToken: process.env.TELEGRAM_TOKEN,

    // API key for accessing CoinMarketCap's cryptocurrency data
    coinMarketCapApiKey: process.env.COINMARKETCAP_API_KEY,

    // Database connection details
    dbPassword: process.env.DB_PASSWORD, // Database password from .env file
    dbUser: process.env.DB_USER || 'Database user', // Database user, defaults to 'postgres'
    dbHost: process.env.DB_HOST || 'Host', // Database host, defaults to 'localhost'
    dbName: process.env.DB_NAME || 'Database name', // Database name, defaults to 'coinifo'
    dbPort: process.env.DB_PORT || Port, // Database port, defaults to 5432
};

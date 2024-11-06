
# Telegram Crypto Bot

> A cryptocurrency price tracking bot built with Node.js for Telegram, allowing users to monitor and manage their cryptocurrency holdings, receive real-time updates, and set alerts for their favorite assets. The bot utilizes the CoinMarketCap API and PostgreSQL for data management.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Dependencies](#dependencies)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Real-Time Price Tracking**: Fetches and displays the latest prices for popular cryptocurrencies.
- **Favorite Cryptos**: Allows users to save a list of favorite cryptocurrencies for quick access.
- **Notifications**: Provides 30-minute price updates for selected cryptos if enabled by the user.
- **Portfolio Calculation**: Calculates and displays the total value of specified crypto holdings.
- **User Onboarding**: Welcomes new users and guides them on how to use the bot’s features.

---

## Installation

To set up this bot on your local machine, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/amiriiw/Coinifo_telegram_bot
   cd telegram-crypto-bot
   cd Coinifo-bot
   ```

2. **Set up environment variables**:
   Create a `.env` file with the following variables:
   ```plaintext
   TELEGRAM_TOKEN=your_telegram_bot_token
   COINMARKETCAP_API_KEY=your_coinmarketcap_api_key
   DB_PASSWORD=your_database_password
   ```

3. **Install dependencies**:
   ```bash
   npm install <dependencies>
   ```

4. **Run the bot**:
   ```bash
   node bot.js
   ```

The bot will now be running and ready to use on Telegram.

---

## Usage

### Telegram Commands

Once the bot is running, interact with it using the following commands in Telegram:

1. **/start** - Initializes the bot for the user, creating a profile in the database and listing available commands.
2. **/price** - Displays the latest prices for a list of popular cryptocurrencies.
3. **/setcrypto** - Adds specified cryptocurrencies to the user’s list of favorites for quick access.
4. **/mf** - Shows the prices of all favorite cryptocurrencies.
5. **/calculate** - Calculates the USD value of specified holdings for a particular cryptocurrency.
6. **/settime** - Enables or disables 30-minute notifications for favorite cryptocurrencies.

---

## File Structure

```plaintext
telegram-crypto-bot/
├── bot.js                      # Main bot file, handles initialization and command loading
├── .env                        # Environment variables file (sensitive info not included in the repo)
├── config.js                   # Configuration settings for environment variables
├── requirements.txt            # Dependencies list
├── src/
│   ├── commands/
│   │   ├── calculate.js        # Command to calculate holdings value
│   │   ├── favoriteCryptos.js  # Command to display favorite cryptocurrencies
│   │   ├── price.js            # Command to fetch crypto prices
│   │   ├── setCrypto.js        # Command to save favorite cryptos
│   │   ├── setTime.js          # Command to manage notification settings
│   │   └── start.js            # Command to welcome and initialize new users
│   ├── services/
│   │   └── cryptoService.js    # CoinMarketCap API interaction
│   └── db/
│       └── db.js               # Database configuration and user table initialization
└── static/                     # Placeholder for static assets (if needed)
```

---

## Dependencies

The bot relies on the following Node.js packages:

- **[node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)**: Interface for interacting with the Telegram Bot API.
- **[pg](https://node-postgres.com/)**: PostgreSQL client for managing the database.
- **[axios](https://axios-http.com/)**: HTTP client for making requests to CoinMarketCap’s API.
- **dotenv**: Loads environment variables for secure access to sensitive information.

Install these dependencies by running:
```bash
npm install
```

---

## Documentation

For additional information on each library, consult the following resources:

- [Node Telegram Bot API Documentation](https://github.com/yagop/node-telegram-bot-api)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [Node-Postgres Documentation](https://node-postgres.com/)

---

## Contributing

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

## Acknowledgements

- Data provided by [CoinMarketCap](https://coinmarketcap.com).
- Inspired by other cryptocurrency tracking and alerting projects on Telegram.

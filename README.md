 # Coinifo Project
Welcome to the **Coinifo project**! This project provides a bot that allows users to interact with the latest cryptocurrency data, set their favorite cryptocurrencies, and receive daily updates via Telegram.

## Overview
This project consists of a single main script:

1. **coinifo.js**: This JavaScript file contains the main logic for the CryptoBot, a Telegram bot that allows users to track cryptocurrency prices, set favorite cryptocurrencies, and receive updates at specified times.

```plaintext
Coinifo Bot/           
├── Coinifo.js            
├── requirements.txt                                        
```

## Libraries Used
The following libraries are used in this project:

- **[mysql2/promise](https://www.npmjs.com/package/mysql2)**: A library for interacting with MySQL databases, used to store user data like chat IDs and favorite cryptocurrencies.
- **[node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)**: A Node.js module that handles interactions with the Telegram Bot API.
- **[axios](https://axios-http.com/)**: A promise-based HTTP client for making requests to the CoinMarketCap API.

## Detailed Explanation
### `coinifo.js`
This script is the core of the project, responsible for managing the bot's interactions and functionalities. The key components of the script are:

- **CryptoBot Class**: This class encapsulates all the functionalities of the bot, including initialization, command handling, and database operations.
    - `initializeDatabase()`: Creates a MySQL database connection to store user information such as chat IDs, usernames, favorite cryptocurrencies, and notification times.
    - `initialize()`: Sets up the bot's command handlers, such as `/start`, `/price`, `/setcrypto`, `/mf`, `/settime`, and `/calculate`.
    - `saveUserInfo()`: Saves or updates user information in the MySQL database whenever a user interacts with the bot.
    - `handleStartCommand()`: Sends a welcome message with a list of available commands when the user starts the bot.
    - `handlePriceCommand()`: Fetches and displays the latest prices of the top 10 cryptocurrencies, including market cap, 24-hour volume, and high/low values.
    - `handleSetCryptoCommand()`: Allows users to set their favorite cryptocurrencies, which are then stored in the MySQL database.
    - `handleFavoriteCryptoCommand()`: Displays the current prices of the user's favorite cryptocurrencies.
    - `handleSetTimeCommand()`: Allows users to set a daily notification time for updates on their favorite cryptocurrencies.
    - `handleCalculateCommand()`: Calculates the value of a specified amount of cryptocurrency based on the current market price.
    - `sendDailyUpdates()`: Sends daily updates to users about their favorite cryptocurrencies at the specified time.

### How It Works
1. **User Interaction**:
    - Users interact with the bot through commands such as `/start`, `/price`, `/setcrypto`, `/mf`, `/settime`, and `/calculate`.
    - User preferences (e.g., favorite cryptocurrencies and notification times) are stored in a MySQL database.

2. **Fetching Data**:
    - The bot fetches the latest cryptocurrency data from the CoinMarketCap API using the Axios library.
    - Data is displayed in response to user commands, and updates are sent automatically at the user-defined times.

3. **Database Management**:
    - User data is managed using MySQL, allowing the bot to remember user settings and preferences between sessions.

## Installation and Setup
To use this project, follow these steps:

1. Clone the repository:
```bash
git clone https://github.com/amiriiw/Coinifo_telegram_bot
cd Coinifo_telegram_bot
cd Coinifi/ bot
cd Coinifo/ project
```

2. Install the required libraries:
```bash
npm install $(cat requirements.txt | tr '\n' ' ')
```

3. Setup MySQL Database:
    - **Create a MySQL database**:
    ```bash
    mysql -u root -p
    CREATE DATABASE coinifo_db;
    ```

    - **Create a new MySQL user**:
    ```bash
    CREATE USER 'coinifo_user'@'localhost' IDENTIFIED BY 'yourpassword';
    GRANT ALL PRIVILEGES ON coinifo_db.* TO 'coinifo_user'@'localhost';
    FLUSH PRIVILEGES;
    ```

    - **Update your script** with the MySQL credentials.

4. Create a `.env` file in the root directory of the project with your Telegram bot token, CoinMarketCap API key, and MySQL credentials:
```env
TELEGRAM_TOKEN=your-telegram-bot-token
COINMARKETCAP_API_KEY=your-coinmarketcap-api-key
DB_HOST=localhost
DB_USER=coinifo_user
DB_PASSWORD=yourpassword
DB_NAME=coinifo_db
```

5. Start the bot:
```bash
node coinifo.js
```

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

module.exports = (bot, db) => {
    // Listen for the /start command from users
    bot.onText(/\/start/, async (msg) => {
        const userId = msg.from.id; // Get the user's Telegram ID from the message
        const username = msg.from.username || '';  // Retrieve the user's username; use an empty string if it doesn't exist

        // Insert the user into the database (including user_id and username)
        await db.query(
            `INSERT INTO users (user_id, username) VALUES ($1, $2)
            ON CONFLICT (user_id) DO UPDATE SET username = EXCLUDED.username`, // If user_id already exists, update the username
            [userId, username] // Parameters for the query
        );

        // Define a welcome message with available commands for the user
        const welcomeMessage = `
Welcome to the CryptoBot! Commands:
/price - Get prices
/mf - View favorite cryptos
/setcrypto - Set favorite cryptos
/settime - Manage notifications
/calculate - Calculate asset values
        `;
        // Send the welcome message to the user
        bot.sendMessage(userId, welcomeMessage);
    });
};

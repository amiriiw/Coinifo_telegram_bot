// Import the function to fetch cryptocurrency prices
const { fetchCryptoPrices } = require('../services/cryptoService');

// Global object to store intervalId for each user
const notificationIntervals = {};

module.exports = (bot, db) => {
    // Listen for the "/settime" command from the user
    bot.onText(/\/settime/, (msg) => {
        const userId = msg.from.id; // Get the user's ID from the message
        const options = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Activate', callback_data: 'activate' }, { text: 'Deactivate', callback_data: 'deactivate' }]
                ]
            }
        };
        
        // Send a message to the user asking if they want to activate or deactivate notifications
        bot.sendMessage(userId, 'Activate or deactivate notifications?', options);
        
        // Wait for the user's response to the inline keyboard
        bot.once('callback_query', async (query) => {
            const action = query.data; // Get the action (activate/deactivate) from the callback query

            if (action === 'activate') {
                // Inform the user that they will receive updates every 30 minute
                bot.sendMessage(userId, 'You will receive updates for your favorite cryptocurrencies every 30 minute.');

                // Function to send favorite cryptocurrencies to the user
                const sendFavorites = async () => {
                    // Fetch the user's favorite cryptocurrencies from the database
                    const { rows } = await db.query('SELECT favorite_cryptos FROM users WHERE user_id = $1', [userId]);
                    
                    // Check if the user has set any favorite cryptocurrencies
                    if (!rows.length || !rows[0].favorite_cryptos) {
                        bot.sendMessage(userId, 'You have not set any favorite cryptos yet.');
                        return; // Exit the function if no favorites are found
                    }

                    // Split the favorite cryptocurrencies into an array
                    const favoriteCryptos = rows[0].favorite_cryptos.split(',');
                    
                    try {
                        // Fetch current prices of cryptocurrencies
                        const cryptos = await fetchCryptoPrices();
                        // Filter the fetched cryptocurrencies to only include the user's favorites
                        const selectedCryptos = cryptos.filter(c => favoriteCryptos.includes(c.name));
                        
                        // Send the details of each selected cryptocurrency to the user
                        selectedCryptos.forEach(crypto => {
                            const { name, symbol, quote: { USD } } = crypto;
                            const message = `
Name: ${name}
Symbol: ${symbol}
Price: $${USD.price.toFixed(2)}
Market Cap: $${USD.market_cap.toLocaleString()}
24h Change: ${USD.percent_change_24h.toFixed(2)}%
Volume (24h): $${USD.volume_24h.toLocaleString()}
                            `;
                            bot.sendMessage(userId, message);
                        });
                    } catch {
                        bot.sendMessage(userId, 'Error fetching data.'); // Handle error fetching prices
                    }
                };

                // Start sending notifications every minute
                const intervalId = setInterval(sendFavorites, 30 * 60 * 1000); // Every minute

                // Store the intervalId in the global object and update user's status in the database with active time
                notificationIntervals[userId] = intervalId; // Save the interval ID for the user
                const currentTime = new Date().toISOString(); // Get the current time in ISO format
                await db.query(
                    'UPDATE users SET notify_status = $1, notify_start_time = $2 WHERE user_id = $3',
                    ['active', currentTime, userId] // Update the user's notification status and start time
                );
                bot.sendMessage(userId, 'Notifications activated. You will receive updates every 30 minute.');
            } else {
                // If the user chooses to deactivate notifications
                if (notificationIntervals[userId]) {
                    clearInterval(notificationIntervals[userId]); // Stop the notifications
                    delete notificationIntervals[userId]; // Remove the user from the global object
                }

                const currentTime = new Date().toISOString(); // Get the current time in ISO format
                await db.query(
                    'UPDATE users SET notify_status = $1, notify_start_time = $2 WHERE user_id = $3',
                    ['inactive', currentTime, userId] // Update the user's notification status and end time
                );
                bot.sendMessage(userId, 'Notifications deactivated.'); // Confirm deactivation to the user
            }
        });
    });
};

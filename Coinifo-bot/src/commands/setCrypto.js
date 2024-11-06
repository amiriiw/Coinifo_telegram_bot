// Import the function to fetch cryptocurrency prices
const { fetchCryptoPrices } = require('../services/cryptoService');

module.exports = (bot, db) => {
    // Listen for the "/setcrypto" command from the user
    bot.onText(/\/setcrypto/, (msg) => {
        const userId = msg.from.id; // Get the user's ID from the message
        
        // Prompt the user to send their favorite cryptocurrencies
        bot.sendMessage(userId, 'Please send your favorite cryptos (e.g., Bitcoin,Ethereum).');
        
        // Wait for the user's response
        bot.once('message', async (reply) => {
            // Convert cryptocurrency names: Capitalize the first letter if it's lowercase
            const favorites = reply.text.split(',').map(name => {
                const trimmedName = name.trim(); // Remove any extra spaces
                return trimmedName.charAt(0).toUpperCase() + trimmedName.slice(1); // Capitalize first letter
            });

            // Fetch the current prices of cryptocurrencies
            const cryptos = await fetchCryptoPrices();
            
            // Validate the cryptocurrencies: Filter valid names
            const validCryptos = favorites.filter(name => cryptos.some(c => c.name === name));
            // Identify invalid cryptocurrency names
            const invalidCryptos = favorites.filter(name => !cryptos.some(c => c.name === name));
            
            // Update the database with valid cryptocurrencies
            await db.query('UPDATE users SET favorite_cryptos = $1 WHERE user_id = $2', [validCryptos.join(','), userId]);

            // Create a response message for the user
            let message = `Saved: ${validCryptos.join(', ')}`; // Message for valid names
            // If there are invalid names, append them to the message
            if (invalidCryptos.length > 0) {
                message += `\nNot saved (invalid names): ${invalidCryptos.join(', ')}`;
            }
            // Send the final message to the user
            bot.sendMessage(userId, message);
        });
    });
};

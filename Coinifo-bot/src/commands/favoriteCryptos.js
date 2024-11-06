// Import the function to fetch cryptocurrency prices
const { fetchCryptoPrices } = require('../services/cryptoService');

module.exports = (bot, db) => {
    // Listen for the "/mf" command from the user
    bot.onText(/\/mf/, async (msg) => {
        const userId = msg.from.id; // Get the user's ID from the message
        // Query the database to retrieve the user's favorite cryptocurrencies
        const { rows } = await db.query('SELECT favorite_cryptos FROM users WHERE user_id = $1', [userId]);
        
        // Check if the user has set any favorite cryptocurrencies
        if (!rows.length || !rows[0].favorite_cryptos) {
            bot.sendMessage(userId, 'You have not set any favorite cryptos yet.'); // Notify user if no favorites are found
            return; // Exit the function early
        }

        // Split the user's favorite cryptocurrencies into an array
        const favoriteCryptos = rows[0].favorite_cryptos.split(',');
        
        try {
            // Fetch the latest cryptocurrency prices
            const cryptos = await fetchCryptoPrices();
            // Filter the fetched cryptocurrencies to only include the user's favorites
            const selectedCryptos = cryptos.filter(c => favoriteCryptos.includes(c.name));
            
            // Send details for each selected cryptocurrency
            selectedCryptos.forEach(crypto => {
                const { name, symbol, quote: { USD } } = crypto; // Destructure the required properties
                const message = `
Name: ${name}
Symbol: ${symbol}
Price: $${USD.price.toFixed(2)}
Market Cap: $${USD.market_cap.toLocaleString()} 
Volume (24h): $${USD.volume_24h.toLocaleString()} 
24h Change: ${USD.percent_change_24h.toFixed(2)}% 
                `;
                bot.sendMessage(userId, message); // Send the message to the user
            });
        } catch (error) {
            console.error('Error fetching data:', error); // Log error to the console
            bot.sendMessage(userId, 'Error fetching data.'); // Notify user of the error
        }
    });
};

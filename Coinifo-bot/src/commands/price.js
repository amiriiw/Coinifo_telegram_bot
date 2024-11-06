// Import the function to fetch cryptocurrency prices
const { fetchCryptoPrices } = require('../services/cryptoService');

module.exports = (bot) => {
    // Listen for the "/price" command from the user
    bot.onText(/\/price/, async (msg) => {
        const userId = msg.from.id; // Get the user's ID from the message

        try {
            // Fetch the latest cryptocurrency prices
            const cryptos = await fetchCryptoPrices();
            // Iterate over each cryptocurrency in the fetched data
            cryptos.forEach(crypto => {
                const { name, symbol, quote: { USD } } = crypto; // Destructure relevant properties from each cryptocurrency
                
                // Format a message with the cryptocurrency's details
                const message = `
Name: ${name} 
Symbol: ${symbol} 
Price: $${USD.price.toFixed(2)} 
Market Cap: $${USD.market_cap.toLocaleString()} 
24h Volume: $${USD.volume_24h.toLocaleString()} 
24h Change: ${USD.percent_change_24h.toFixed(2)}% 
                `;
                // Send the formatted message to the user
                bot.sendMessage(userId, message);
            });
        } catch (error) {
            // Log any errors to the console for debugging
            console.error(error);
            // Notify the user about the error
            bot.sendMessage(userId, 'Error fetching data.');
        }
    });
};

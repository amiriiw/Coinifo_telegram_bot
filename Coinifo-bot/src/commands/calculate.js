// Import function to fetch cryptocurrency prices
const { fetchCryptoPrices } = require('../services/cryptoService');

module.exports = (bot) => {
    // Listen for the "/calculate" command from the user
    bot.onText(/\/calculate/, (msg) => {
        const userId = msg.from.id; // Retrieve user ID from message
        bot.sendMessage(userId, 'Please send the name of the cryptocurrency (e.g., Bitcoin).');
        
        // Wait for the user's response with the cryptocurrency name
        bot.once('message', (cryptoReply) => {
            const cryptoName = cryptoReply.text.trim(); // Get and trim the cryptocurrency name input
            bot.sendMessage(userId, `Please send the amount of ${cryptoName} you have.`);
            
            // Wait for the user's response with the amount they have
            bot.once('message', async (amountReply) => {
                const amount = parseFloat(amountReply.text); // Parse the amount as a float
                if (isNaN(amount)) { // Validate if amount is a number
                    bot.sendMessage(userId, 'Invalid amount. Please enter a valid number.');
                    return;
                }
                
                try {
                    // Fetch the latest cryptocurrency prices
                    const cryptos = await fetchCryptoPrices();
                    // Find the requested cryptocurrency by name (case-insensitive)
                    const crypto = cryptos.find(c => c.name.toLowerCase() === cryptoName.toLowerCase());
                    
                    if (!crypto) { // If the cryptocurrency is not found, notify the user
                        bot.sendMessage(userId, `Sorry, ${cryptoName} is not available.`);
                        return;
                    }
                    
                    // Calculate the total value of the user's holdings
                    const value = crypto.quote.USD.price * amount;
                    // Send the calculated value back to the user
                    bot.sendMessage(userId, `The value of your ${amount} ${cryptoName} is $${value.toFixed(2)}.`);
                } catch {
                    // Send an error message if there is an issue fetching data
                    bot.sendMessage(userId, 'Error fetching data.');
                }
            });
        });
    });
};

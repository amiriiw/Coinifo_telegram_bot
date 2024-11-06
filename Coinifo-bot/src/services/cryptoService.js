const axios = require('axios'); // Importing Axios for making HTTP requests
const config = require('../../config'); // Importing configuration settings

// Asynchronous function to fetch cryptocurrency prices from CoinMarketCap
async function fetchCryptoPrices(limit = 10) {
    try {
        // Sending a GET request to the CoinMarketCap API to retrieve cryptocurrency listings
        const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
            headers: { 'X-CMC_PRO_API_KEY': config.coinMarketCapApiKey }, // Setting the API key in headers
            params: { limit }, // Limiting the number of results returned
        });

        // Returning the data array containing cryptocurrency prices
        return response.data.data;
    } catch (error) { 
        // Logging any errors that occur during the request
        console.error('Error fetching crypto prices:', error);
        throw new Error('Failed to fetch crypto prices'); // Throwing a new error for the caller to handle
    }
}

// Exporting the fetchCryptoPrices function for use in other modules
module.exports = { fetchCryptoPrices };

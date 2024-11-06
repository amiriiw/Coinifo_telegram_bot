const { Pool } = require('pg'); // Importing the Pool class from the 'pg' library to manage PostgreSQL connections
const config = require('../../config'); // Importing the configuration settings from a config file

// Creating a connection pool to the database with specified configurations
const pool = new Pool({
    user: config.dbUser,         // Database username from the configuration
    host: config.dbHost,         // Hostname of the database server from the configuration
    database: config.dbName,     // Name of the database from the configuration
    password: config.dbPassword, // Password for the database user from the configuration
    port: config.dbPort,         // Port number for the database connection from the configuration
});

// Function to execute SQL queries against the database
const query = (text, params) => pool.query(text, params); // Executes a query using the connection pool

// Function to initialize the database and create necessary tables
const initializeDatabase = async () => {
    // SQL query to create the 'users' table if it doesn't already exist
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY, 
            user_id BIGINT UNIQUE NOT NULL, 
            username VARCHAR(255), 
            favorite_cryptos TEXT, 
            notify_status VARCHAR(10), 
            notify_start_time TIMESTAMP
        )
    `;

    try {
        // Execute the query to create the users table
        await pool.query(createUsersTable);
        console.log('Users table has been created or already exists.'); // Log success message
    } catch (error) {
        // Log any errors that occur during table creation
        console.error('Error creating users table:', error);
    }
};

// Calling the function to initialize the database and create tables when the application starts
initializeDatabase();

// Exporting the query function for use in other parts of the application
module.exports = {
    query,
};

require('dotenv').config({ path: '.env.local' });

const mongoose = require('mongoose');

const MONGODB_URL = process.env.MONGODB_URL;

const testConnection = async () => {
    try {
        if (!MONGODB_URL) {
            throw new Error('MONGODB_URL is not defined in the environment variables');
        }

        await mongoose.connect(MONGODB_URL);
        console.log("Successfully connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    } finally {
        mongoose.connection.close();
    }
};

testConnection();

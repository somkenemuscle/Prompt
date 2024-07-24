import mongoose from "mongoose";

// Get the MongoDB URL from the environment variables
const MONGODB_URL = process.env.MONGODB_URL;

// Initialize the cached connection object, which will be stored globally
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null
    };
}

// Function to connect to the MongoDB database
export const connectToDatabase = async () => {
    // If there's already a cached connection, return it
    if (cached.conn) return cached.conn;

    // Throw an error if the MongoDB URL is missing
    if (!MONGODB_URL) throw new Error("Missing MongoDb Url");

    // If there's no cached promise, create a new connection promise
    cached.promise = cached.promise ||
        mongoose.connect(MONGODB_URL, {
            dbName: 'prompt',
            bufferCommands: false
        });

    // Await the promise and cache the connection
    cached.conn = await cached.promise;

    // Return the established connection
    return cached.conn;
}

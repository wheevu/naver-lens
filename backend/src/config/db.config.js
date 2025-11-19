// config data
import mongoose from 'mongoose';
import * as dotenv from 'dotenv'; // Import dotenv to load environment variables
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from the .env file in the root
// Note: You might need to adjust the path based on where you run 'node server.js'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') }); 

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // These options are often recommended but may not be strictly necessary 
            // with newer versions of Mongoose
            // useNewUrlParser: true, 
            // useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // Exit process with failure
        process.exit(1);
    }
};

export default connectDB;
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) return;
        await mongoose.connect(uri);
    } catch (e: any) {
        console.error(e.message);
        process.exit(1);
    }
}

export default connectDB;
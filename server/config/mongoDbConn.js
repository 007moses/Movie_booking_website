import mongoose from "mongoose";

const connectDB = async ()=>{
     try {
        await mongoose.connect(process.env.url).then(()=> console.log("Welcome to Mongo DB!") )
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.name, error.message);
        throw error; // Throw the error to stop the server if connection fails
    }
}

export default connectDB;

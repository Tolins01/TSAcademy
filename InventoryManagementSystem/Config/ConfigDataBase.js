const Mongoose = require('mongoose');

const ConnectToDatabase = async () => {
    try{
       const connectDB = await Mongoose.connect(process.env.DATABASE_URL);
        console.log(`Connected to MongoDB ${process.env.DATABASE_URL}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error}`); 
        process.exit(1); // Exit the process with an error code  
    }
};

module.exports = ConnectToDatabase;


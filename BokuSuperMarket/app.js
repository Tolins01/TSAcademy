const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file

const productRoute = require('./Routes/ProductRoute');
const userRoute = require('./Routes/UserRoute');
const categoryRoute = require('./Routes/CategoryRoute');



app.use(express.json()); //middleware to parse JSON request bodies



app.use('/products', productRoute); //use the product route for all requests starting with /products
app.use('/users', userRoute); //use the user route for all requests starting with /users
app.use('/categories', categoryRoute); //use the category route for all requests starting with /categories

const connectDB = require('./Config/databaseConfig');
connectDB(); // Connect to MongoDB

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

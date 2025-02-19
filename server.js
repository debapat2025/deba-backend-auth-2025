require('dotenv').config()

const express = require("express");
const connectToDb= require("./database/db");
const authRoutes= require('./routes/auth-routes')
const homeRoutes= require('./routes/home-routes')
const adminRoutes= require('./routes/admin-routes')
const uploadImageRoutes= require('./routes/image-routes')

const app = express();
const PORT = process.env.PORT || 3000;

//connect to our database
connectToDb();

//middleware
app.use(express.json());

//routes
app.use('/api/auth',authRoutes)
app.use('/api/home',homeRoutes)
app.use('/api/admin',adminRoutes)
app.use('/api/image',uploadImageRoutes)


//lisson port
app.listen(PORT, () => {
    console.log("server is now running on port", PORT);
  });
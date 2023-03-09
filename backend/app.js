const express = require('express');
const app= express();
const cookieParser = require('cookie-parser');

const errorMiddleware = require("./middleware/error");

app.use(cookieParser());
app.use(express.json());

//Import Routes
const product =require("./routes/productRoute");
const user = require('./routes/userRoute');
const order = require('./routes/orderRoute')

app.use("/api/v1",product); 
app.use("/api/v1",user);
app.use("/api/v1",order);


//Middleware For Error
app.use(errorMiddleware);

module.exports= app;
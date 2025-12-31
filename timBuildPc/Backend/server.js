const express = require('express');
const cookieParser = require('cookie-parser');
const mongoSanitize = require("express-mongo-sanitize");
const userRoutes = require("./routes/userRoutes.js");
const serviceRoutes = require("./routes/serviceRoute.js")
const bookingRoutes = require("./routes/bookingRoute.js")
const path = require('path');
const User = require("./schemas/user");
const cors = require("cors");
// const connectDB = require('./config/dbConnect');
// Connect to MongoDB Databases
const db = require('./config/dbConnect'); 
const uploadImage = require("./imageUploader/imageUploader.js");

(async () => {
  await db.connect(process.env.ATLAS_URI);
})();

const PORT = process.env.PORT || 3001
const app = express()
// uploadImage()
// connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
//calling cors
app.use(cors());
//calling cookies func
app.use(cookieParser())


//calling routes 
app.use('/api', userRoutes)
// app.use('/api', userRoutes)
app.use('/api', serviceRoutes)
app.use('/api', bookingRoutes)


app.listen (PORT, () => {
    console. log('Server starting on port')

})



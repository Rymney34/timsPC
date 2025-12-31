// server.js
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRoutes = require("../../routes/userRoutes.js");
const serviceRoutes = require("../../routes/serviceRoute.js")
const bookingRoutes = require("../../routes/bookingRoute.js")
const db = require('../../config/dbConnect.js'); 

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());



// Routes
app.use('/api', userRoutes);
app.use('/api', serviceRoutes);
app.use('/api', bookingRoutes);

// Test route
app.get('/api', (req, res) => {
  res.json({ message: "Hello from backend" });
});

// Only start server if NOT testing
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3001;
  db._connect(); 
  app.listen(PORT, () => {
    console.log(`Server starting on port ${PORT}`);
  });
}

module.exports = app; // 👈 export for Supertest

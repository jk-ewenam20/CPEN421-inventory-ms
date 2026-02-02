require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const usersRoute = require('./routes/users.route');
const cors = require('cors');

const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 3002;

// DB connection
mongoose.connect(mongoURI)
    .then(() =>
    {
        app.listen(port, () => console.log(`Listening on port ${port}`));
        console.log('Connected to MongoDB...')
    })
    .catch(err => console.error('Could not connect to MongoDB...', err));

// Middlewares
app.use(express.json());
app.use(cors({
  origin: "https://YOUR_USERNAME.github.io",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}))

// Routes
app.use('/api/users', usersRoute);
app.use('/api/items', require('./routes/items.route'));
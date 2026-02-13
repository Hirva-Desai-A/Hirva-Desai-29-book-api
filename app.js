const express = require('express');
const app = express();

// Middleware to read JSON
app.use(express.json());

// Import routes
const bookRoutes = require('./routes/bookRoutes');

// Use routes
app.use('/books', bookRoutes);

// Start server
app.listen(3000, () => {
    console.log(' Book Store API running on port 3000');
});

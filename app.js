const express = require('express');
const app = express();

app.use(express.json());

app.use('/products', require('./routes/productRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/cart', require('./routes/cartRoutes'));
app.use('/orders', require('./routes/orderRoutes'));

// catch 404s
app.use((req, res, next) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

// GLOBAL ERROR HANDLER - uses centralized module
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);


app.listen(3000, () => {
    console.log('Server running on port 3000');
});

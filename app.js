const express = require('express');
const app = express();

app.use(express.json());

app.use('/products', require('./routes/productRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/cart', require('./routes/cartRoutes'));
app.use('/orders', require('./routes/orderRoutes'));

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    res.status(500).json({ message: "Server Error" });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

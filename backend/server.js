require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const PORT = process.env.PORT || 3500;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());
app.use(cookieParser());
// tell nodejs to access static file in public folder
app.use('/', express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: false }));

app.use(
    cors({
        credentials: true,
        origin: "http://localhost:3000"
    })
)


app.use('/role', require('./routes/roleRoutes'))
app.use('/user', require('./routes/userRoutes'))
app.use('/', require('./routes/authRoutes'))
app.use('/service', require('./routes/serviceRoutes'))
app.use('/product', require('./routes/productRoutes'))
app.use('/pet', require('./routes/petRoutes'))
app.use('/category', require('./routes/categoryRoutes'))
app.use('/order', require('./routes/orderRoutes'))
app.use('/orderDetail', require('./routes/orderDetailRoutes'))
app.use('/booking', require('./routes/bookingRoutes'))
app.use('/bookingDetail', require('./routes/bookingDetailRoutes'))
app.use('/cartService', require('./routes/cartServiceRoutes'))
app.use('/cartProduct', require('./routes/cartProductRoutes'))
app.use('/dashboard', require('./routes/dashBoardRoutes'))
app.use('/feedback', require('./routes/feedbackRoutes'))
app.use('/blog', require('./routes/blogRoutes'))

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.join({ message: "404 Not Found" })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("Database connectedd");
        app.listen(PORT, () => {
            console.log(`Server starting at http://localhost:${PORT}`)
        })
    })
    .catch((err) => {
        console.log(err);
    })

module.exports = app

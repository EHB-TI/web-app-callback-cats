require('dotenv').config();
require('./config/database').connect();
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

// Helmet
const helmet = require('helmet');
app.use(helmet());

// Disable X-POWERED-BY
app.disable('x-powered-by');

// CORS
// const cors = require('cors');
// app.use(cors({
//     origin: process.env.NODE_ENV.trim() == "development" ? "http://localhost:3000" : process.env.WEBSITE_URL,
//     credentials: true,
//     optionSuccessStatus: 200
// }));

// Accepted Content-Type
const bodyParser = require('body-parser')
app.use(bodyParser.json());

// Nodig?
// Error 406 on wrong Content-Type
// app.use((req, res, next) => {
//     if(!req.is('application/json'))
//         return res.status(406).json({ message: 'Content-Type is not application/json.', errorCode: 406 });
//     return next();
// })

// Allowed methods
const allowedMethods = ['GET', 'POST']
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', allowedMethods.join(', '));
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    if(!allowedMethods.includes(req.method))
        return res.status(405).json({ message: 'Method Not Allowed', errorCode: 405});
    
    return next();
});

app.use(express.json());


app.use((req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload'); // 2 years
    next();
});
app.use(cookieParser());


// Routes
/// Functions for routes
const functions = require('./config/functions');

/// Auth check
const auth = require('./middleware/auth');

app.get('/api/v1/me', auth, functions.getUser)
app.post('/api/v1/logout', auth, functions.logout)

app.get('/api/v1/menus', auth, functions.getMenus)

app.get('/api/v1/products', auth, functions.getProducts)


app.get('/api/v1/products/:productId', auth, functions.getProduct)
app.post('/api/v1/products/edit', auth, functions.updateProduct)
app.post('/api/v1/products/add', auth, functions.addProduct)

app.get('/api/v1/toppings', auth, functions.getToppings)
app.get('/api/v1/breads', auth, functions.getBreads)
app.get('/api/v1/vegetables', auth, functions.getVegetables)
app.get('/api/v1/sauces', auth, functions.getSauces)

app.post('/api/v1/createPaymentIntent', auth, functions.createPaymentIntent)

app.get('/api/v1/orders', auth, functions.getOrders)
app.post('/api/v1/addOrder', auth, functions.addOrder)
app.post('/api/v1/removeOrder', auth, functions.removeOrder)

app.post('/api/v1/register', functions.register);

// LOGIN
app.route('/api/v1/login').post(functions.login)

app.post('/api/v1/verify', functions.verify2FAToken);



// Error 405 on not supported request
app._router.stack.forEach((r) => {
    // Route exists + without wildcard
    if(!r.route || r.route.path.includes('*')) return;

    // Get all routes
    for(const req in r.route.methods) {
        // All routes only support GET or POST, never both
        // => Disable method that is not found
        switch(req) {
            case 'post':
                // Disable get request for this post route
                app.get(r.route.path, (req, res) => res.status(405).json({ message: 'Method Not Allowed', errorCode: 405 }))
                break;
            case 'get':
                // Disable post request for this get route
                app.post(r.route.path, (req, res) => res.status(405).json({ message: 'Method Not Allowed', errorCode: 405 }))
                break;
        }
    }
})

/// Error 404 on non-existing routes/resources
app.use((req, res, next) => res.status(404).json({ message: 'Route does not exist.', errorCode: 404 }));


module.exports = app;
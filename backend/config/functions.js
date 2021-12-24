const mongodb = require('mongodb');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const User = require('../model/user');


// CONNECTION
const uri = process.env.MONGO_URI
const client = new mongodb.MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const connection = client.connect();
const config = process.env;

// USER
const getUser = async (req, res) => {
    // Get token
    let token;
    if(req.headers['x-access-token']) {
        // Token found in header
        token = req.headers['x-access-token'];
    } else if(req.headers.cookie) {
        // Token found in cookies
        token = req.headers.cookie.split('token=')[1];
    } else {
        // No token
        return res.status(401).json({ message: 'No token has been provided.', errorCode: 401 });
    }
    
    // Decode token
    let decoded;
    try {
        decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(403).json({ message: 'Provided token is invalid.', errorCode: 403 });
    }

    connection.then(async _ => {
        res.json(await client.db(process.env.DATABASE).collection(process.env.TABLE_USERS).findOne({
            _id: new mongodb.ObjectId(decoded.user_id)
        })
        .then(async user => {
            user.orders = await client.db(process.env.DATABASE).collection(process.env.TABLE_ORDERS).find({ userId: decoded.user_id }).toArray();
            let returnUser = {};
            for(const e in req.query) {
                if(e != 'password')
                    returnUser[e] = user[e];
            }
            return returnUser;
        }));
    });
}

//MENUS
const getMenus = async (req, res) => {
    console.log(new Date().toISOString());
    connection.then(async _ => {
        res.json(await client.db(process.env.DATABASE).collection(process.env.TABLE_MENUS).find(
            {
                eindDag: {
                    //              2021-12-24T16:35:38.626Z
                    $gte: new Date()
                }
            }
        ).toArray());
    });
}

// PRODUCTS
const getProducts = async (req, res) => {
    connection.then(async _ => {
        res.json(await client.db(process.env.DATABASE).collection(process.env.TABLE_PRODUCTS).find({}).toArray());
    });
}

const getProduct = async (req, res) => {
    if(!req.params.productId || req.params.productId == 'undefined') {
        return res.status(400).json({ message: 'Required parameters in url are: productId', errorCode: 400 });
    }

    const productId = req.params.productId;
    console.log(productId);
    connection.then(async _ => {
        res.json(await client.db(process.env.DATABASE).collection(process.env.TABLE_PRODUCTS).findOne({
            _id: new mongodb.ObjectId(productId)
        }));
    });
}

const updateProduct = async (req, res) => {
    if(!(req.body._id && req.body.name && parseInt(req.body.stock) && req.body.ingredients && req.body.allergies && parseInt(req.body.price))) {
        return res.status(400).json({ message: 'Required parameters in body are: _id, name, stock, ingredients, allergies, price', errorCode: 400 });
    }

    const product = {
        _id: req.body._id,
        name: req.body.name,
        stock: parseInt(req.body.stock),
        ingredients: req.body.ingredients,
        allergies: req.body.allergies,
        price: parseInt(req.body.price),
    }

    connection.then(async _ => {
        res.status(201).json(await client.db(process.env.DATABASE).collection(process.env.TABLE_PRODUCTS).updateOne({
            _id: new mongodb.ObjectId(product._id),
        }, {
            $set: {
                name: product.name,
                stock: product.stock,
                ingredients: product.ingredients,
                allergies: product.allergies,
                price: product.price
            }
        }));
    });
}

const addProduct = async (req, res) => {
    const product = req.body;

    if(!product || !(req.body.name && parseInt(req.body.stock) && req.body.ingredients && req.body.allergies && parseInt(req.body.price))) {
        return res.status(400).json({ message: 'Required parameters in body are: name, stock, ingredients, allergies, price', errorCode: 400 });
    }

    connection.then(async _ => {
        res.status(201).json(await client.db(process.env.DATABASE).collection(process.env.TABLE_PRODUCTS).insertOne({
            _id: new mongodb.ObjectId(),
            name: product.name,
            stock: parseInt(product.stock),
            ingredients: product.ingredients,
            allergies: product.allergies,
            price: parseInt(product.price)
        }));
    });
}

const getToppings = async (req, res) => {
    connection.then(async _ => {
        res.json(await client.db(process.env.DATABASE).collection(process.env.TABLE_TOPPINGS).find({}).toArray());
    });
}

const getBreads = async (req, res) => {
    connection.then(async _ => {
        res.json(await client.db(process.env.DATABASE).collection(process.env.TABLE_BREAD).find({}).toArray());
    });
}

const getVegetables = async (req, res) => {
    connection.then(async _ => {
        res.json(await client.db(process.env.DATABASE).collection(process.env.TABLE_VEGETABLES).find({}).toArray());
    });
}

const getSauces = async (req, res) => {
    connection.then(async _ => {
        res.json(await client.db(process.env.DATABASE).collection(process.env.TABLE_SAUCES).find({}).toArray());
    });
}

// PAYMENT
const createPaymentIntent = async (req, res) => {
    const items = req.body.items;

    if(!items) {
        return res.status(400).json({ message: 'Required parameters in body are: items', errorCode: 400 });
    }

    await stripe.paymentIntents.create({
            amount: calculateOrderAmount(items),
            currency: 'eur',
            payment_method_types: ['card']
        })
        .then(paymentIntent => {
            res.status(201).json({
                clientSecret: paymentIntent.client_secret
            })
        });
}

const calculateOrderAmount = items => {
    let total = 0;

    items.map(item => total += (item.product.price * item.quantity));

    return total;
}

// USER REGISTER
const register = async (req, res) => {
    // Register
    try {
        // Get user input
        const { email, username, password } = req.body;

        // Validate user input
        if(!(email && username && password)) {
            return res.status(400).json({ message: 'Required parameters in body are: email, username, password', errorCode: 400 });
        }

        console.log(email);
        email = email.toLowerCase();
        console.log(email);

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(409).send({ message: 'User Already Exist. Please Login', errorCode: 409 });
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            username,
            password: encryptedPassword,
            twofa_secret: speakeasy.generateSecret()
        });

        // 2-Factor Authentication
        //qrcode.toDataURL(user.twofa_secret.otpauth_url, (error, data_url) => {
        //     if (error) return res.json({
        //         error: 'server_error'
        //     })
        //     else return res.status(201).json({
        //         email: user.email,
        //         data_url
        //     })
        // })

        // Create token
        const token = createToken(user);

        // save user token
        user.token = token;

        // set token in cookie
        res.cookie('token', token, { httpOnly: true });

        // user
        return res.status(201).json(user);
    } catch (err) {
        return res.status(400).json({ message: err, errorCode: 400});
    }
}

// USER LOGIN
const login = async (req, res) => {
    // login
    try {
        // Get user input
        let { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            return res.status(400).json({ message: 'Required parameters in body are: email, password', errorCode: 400 });
        }
        
        email = email.toLowerCase();

        // Validate if user exist in our database
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // 2-Factor Authentication
            // qrcode.toDataURL(user.twofa_secret.otpauth_url, (error, data_url) => {
            //     if (error) res.json({
            //         error: 'server_error'
            //     }) 
            //     else res.json({
            //         email,
            //         data_url
            //     });
            // });

            // Create token
            const token = createToken(user);

            // save user token
            user.token = token;

            // set token in cookie
            res.cookie('token', token);

            // user
            user.orders = await client.db(process.env.DATABASE).collection(process.env.TABLE_ORDERS).find({ userId: user.id }).toArray();
            console.log(user);
            return res.status(201).json(user);
        }

        return res.status(400).json({ message: 'Invalid Credentials', errorCode: 400 });
    } catch (err) {
        return res.status(400).json({ message: err, errorCode: 400});
    }
}

const logout = async (req, res) => {
    res.clearCookie('token');
    res.removeHeader('token')
    res.removeHeader('cookie')
    return res.status(201).json({ message: 'User has been logged out', errorCode: 204 });
};

const verify2FAToken = async (req, res) => {
    const email = req.body.email;
    const token = req.body.token;

    if(!(email && token)) {
        return res.status(400).json({ message: 'Required parameters in body are: email, password', errorCode: 400 });
    }

    const user = await User.findOne({ email });

    if (user) {
        const verified = speakeasy.totp.verify({
            secret: user.twofa_secret.base32,
            encoding: 'base32',
            token
        })
    
        if (verified) {
            // Create token
            const token = createToken(user);

            // save user token
            user.token = token;

            // set token in cookie
            res.cookie('token', token, { httpOnly: true });

            // user
            return res.status(200).json(user);
        } else {
            return res.status(400).json({ message: 'Invalid token.', errorCode: 400 });
        }
    } else return res.status(400).send({ message: 'Invalid Credentials.', errorCode: 400 });
}

const createToken = user => {
    const { _id, email, type } = user;
    return jwt.sign(
        { user_id: _id, email, type },
        process.env.TOKEN_KEY,
        {
            expiresIn: '2h',
        }
    );
}

// ORDERS
const getOrders = async (req, res) => {
    connection.then(async _ => {
        res.json(await client.db(process.env.DATABASE).collection(process.env.TABLE_ORDERS).find({}).toArray());
    });
}

const addOrder = async (req, res) => {
    const userId = req.body.userId;
    const order = req.body.order;

    if(!(userId, order)) {
        return res.status(400).json({ message: 'Required parameters in body are: userId, order', errorCode: 400 });
    }

    connection.then(async _ => {
        res.status(201).json(await client.db(process.env.DATABASE).collection(process.env.TABLE_ORDERS).insertOne({
            _id: new mongodb.ObjectId(),
            userId,
            order,
            progress: 'preparing'
        }));
    });
}

const removeOrder = async (req, res) => {
    const order = req.body;

    if(!order || !(order._id)) {
        return res.status(400).json({ message: 'Required parameters in body are: order, _id', errorCode: 400 });
    }

    connection.then(async _ => {
        res.status(201).json(await client.db(process.env.DATABASE).collection(process.env.TABLE_ORDERS).updateOne({
            _id: new mongodb.ObjectId(order._id)
        }, {
            $set: {
                progress: 'done'
            }
        }));

        client.close();
    });
}

module.exports = {
    getUser,
    logout,

    getMenus,

    getProducts,
    getProduct,
    updateProduct,
    addProduct,

    getToppings,
    getBreads,
    getVegetables,
    getSauces,

    createPaymentIntent,

    getOrders,
    addOrder,
    removeOrder,

    register,
    login,
    verify2FAToken,
}
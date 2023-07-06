const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3100;
const session = require('express-session');
const csrf = require('csurf');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require('cors');

// Set up session middleware
const secretKey = "secretkey";
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true
}));


// Use the csrfProtection middleware before your routes


app.use(cors({
    origin: 'http://127.0.0.1:5500'
}));
// Set up CSRF middleware


// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


const jwt = require("jsonwebtoken");



// const cors = require('cors'); 
// app.use(cors());




// Initialize CSRF middleware

var csrfProtection = csrf({ cookie: true });

app.get('/checkCSRF', csrfProtection,(req, res) => {
    // Verify the CSRF token
    if (req.csrfToken() !== req.body._csrf) {
        return res.status(403).send('Invalid CSRF token');
    }

    // Handle the form submission
    // ...

    // Send a response
    res.status(200).send('Valid CSRF token');
});

app.get("/login", (req, res) => {
    console.log('Response from Spirit Meaning ');
    const user = [
        {
            id: 1,
            username: "Rajesh",
            email: "rajeshpara08@gmail.com",
        },
        {
            id: 2,
            username: "Shobha",
            email: "shobha@gmail.com",
        }
    ];
    jwt.sign({ user }, secretKey, { expiresIn: '300s' }, (err, token) => {
        res.json({
            token
        });
    });
});

app.get("/profile", verifyToken, (req, res) => {
    console.log('Response from Spirit Meaning ');
    var authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    jwt.verify(token, secretKey, (err, decoded) => {
        console.log(decoded);
        if (err) {
            console.error(err);
            res.status(403).json({ result: "Invalid Token" });
        } else {
            // Perform user verification here
            const validUsers = [
                { username: 'Rajesh', email: 'rajeshpara08@gmail.com' },
                { username: 'Shobha', email: 'shobha@gmail.com' }
            ];
            const user = decoded.user;


            console.log(validUsers[0].username);
            const userName = validUsers[0].username
            if (userName) {
                res.json({
                    message: "Profile Accessed",
                    authData: user
                });
            } else {
                res.status(403).json({ result: "Invalid User" });
            }
        }
    });
});


function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        // const token = bearer[1];
        var authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1];
        jwt.verify(token, secretKey, (err, decoded) => {

            if (err) {
                res.status(403).json({ result: 'Invalid Token' });
            } else {
                const user = decoded.user[1]; // Access the first user object from decoded.user
                const { username, email } = user;

                // Perform user verification here
                const validUsers = [
                    { username: 'Rajesh', email: 'rajeshpara08@gmail.com' },
                    { username: 'Shobha', email: 'shobha@gmail.com' }
                ];

                console.log(validUsers[0].username);
                const userName = validUsers[0].username
                if (userName) {
                    // User is verified, proceed to the next middleware
                    next();
                } else {
                    res.status(403).json({ result: 'Invalid User' });
                }
            }
        });
    } else {
        res.status(403).json({ result: 'Token is Invalid' });
    }
}

app.listen(3100, () => {
    console.log('Response from Spirit Meaning ');
    console.log("App is running on port: 3100");
});
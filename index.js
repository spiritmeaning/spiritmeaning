const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3100;
const cors = require('cors');
app.use(cors({
    origin: 'http://127.0.0.1:5500'
}));
// Set up session middleware
const secretKey = "secretkey";



// Use the csrfProtection middleware before your routes



// Set up CSRF middleware


// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


const jwt = require("jsonwebtoken");

// Initialize CSRF middleware

app.get("/login", (req, res) => {
    console.log('Response from Spirit Meaning ');
    const user = [
        {
            id: 1,
            username: "Spirit Meaning",
            email: "spiritmeaning@gmail.com",
            password: "SriRamSita1234$#@!"
        }

    ];
    jwt.sign({ user }, secretKey, { expiresIn: '1000s' }, (err, token) => {
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
       // console.log(decoded);
        if (err) {
            console.error(err);
            res.status(403).json({ result: "Invalid Token" });
        } else {
            // Perform user verification here
            const firebaseCredentials = [
                {
                    apiKey: "AIzaSyDgOZOH3upRrphZP834oOLJuHpCY9wcrzE",
                    authDomain: "spiritmeaning-email.firebaseapp.com",
                    projectId: "spiritmeaning-email",
                    storageBucket: "spiritmeaning-email.appspot.com",
                    messagingSenderId: "274529228758",
                    appId: "1:274529228758:web:d8b9d3646c2880de74f677",
                    measurementId: "G-ZPGXSCFT60"
                },

            ];
            const user = decoded.user;
            const fireBase=firebaseCredentials;
         //   console.log(firebaseCredentials[0].apiKey);
            const firebaseProfile = firebaseCredentials[0].apiKey
            if (firebaseProfile) {
                res.json({
                    message: "Firebase Profile Accessed",
                    authData: user,
                    firebaseCredentials:fireBase
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
                const user = decoded.user[0]; // Access the first user object from decoded.user
           //     console.log(user);
               

                // Perform user verification here
                const firebaseCredentials = [
                    {
                        apiKey: "AIzaSyDgOZOH3upRrphZP834oOLJuHpCY9wcrzE",
                        authDomain: "spiritmeaning-email.firebaseapp.com",
                        projectId: "spiritmeaning-email",
                        storageBucket: "spiritmeaning-email.appspot.com",
                        messagingSenderId: "274529228758",
                        appId: "1:274529228758:web:d8b9d3646c2880de74f677",
                        measurementId: "G-ZPGXSCFT60"
                    },
    
                ];
                const { username, email,password,fireBase } = user;
             //   console.log(firebaseCredentials[0].apiKey);
                const firebaseProfile = firebaseCredentials[0].apiKey
                if (firebaseProfile) {
                    // User is verified, proceed to the next middleware
                    next();
                } else {
                    res.status(403).json({ result: 'Invalid Firebase Profile' });
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
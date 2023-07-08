const express = require('express');
require('dotenv').config();
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
            const fireBase = firebaseCredentials;
            //   console.log(firebaseCredentials[0].apiKey);
            const firebaseProfile = firebaseCredentials[0].apiKey
            if (firebaseProfile) {
                res.json({
                    message: "Firebase Profile Accessed",
                    authData: user,
                    fireBase: firebaseCredentials
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

                const { username, email, password } = user;
                const { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId } = firebaseCredentials;
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



app.get('/firebaseSetData', (req, res) => {
    const fs = require('fs');
    const crypto = require('crypto');
    require('dotenv').config();

    // Function to read the navbar/menus database
    async function readNavbarMenusDatabase() {
        try {
            const admin = require('firebase-admin');
            var source = `{
          "rules": {
            "quizzes": {
              ".read": "true",
              ".write": "true"
            },
            "users": {
              ".read": "true",
              ".write": "true",
              ".indexOn": ["email"] // Add this line to create an index on the 'email' field
            },
            "otherData": {
              ".read": "true",
              ".write": "true"
            },
            "navbar": {
              "menus": {
                ".read": "true",
                ".write": "true"
              }
            },
            "quizAnswers": {
              ".read": "true",
              ".write": "true"
            }
          }
        }`;
            await admin.database().setRules(source);
            const snapshot = await admin.database().ref('navbar/menus').once('value');
            const data = snapshot.val();
            console.log('Navbar/menus database:', data);
            source = `{
          "rules": {
            "quizzes": {
              ".read": "false",
              ".write": "false"
            },
            "users": {
              ".read": "false",
              ".write": "false",
              ".indexOn": ["email"] // Add this line to create an index on the 'email' field
            },
            "otherData": {
              ".read": "false",
              ".write": "false"
            },
            "navbar": {
              "menus": {
                ".read": "false",
                ".write": "false"
              }
            },
            "quizAnswers": {
              ".read": "false",
              ".write": "false"
            }
          }
        }`;
            await admin.database().setRules(source);;
            console.log('Read/write access disabled.');
        } catch (error) {
            console.error('Error reading navbar/menus database:', error);
        }
    }

    // Function to decrypt the encrypted service account JSON file
    async function decryptServiceAccount(encryptionKey, iv) {
        try {
            const encryptedData = fs.readFileSync('./myFirebase/encryptedData.bin');
            const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, iv);
            const decryptedData = Buffer.concat([
                decipher.update(encryptedData),
                decipher.final()
            ]);
            fs.writeFileSync('./myFirebase/serviceAccountKey.json', decryptedData);
            console.log('Decryption complete.');

            // Initialize Firebase Admin SDK with service account credentials
            const admin = require('firebase-admin');
            const serviceAccount = require('./myFirebase/serviceAccountKey.json');
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: 'https://spiritmeaning-email-default-rtdb.firebaseio.com/'
            });
        } catch (error) {
            console.error('Error decrypting the service account JSON file:', error);
        }
    }

    // Function to destroy the service account JSON file
    function destroyServiceAccountFile() {
        try {
            fs.unlinkSync('./myFirebase/serviceAccountKey.json');
            console.log('Service account JSON file destroyed.');
        } catch (error) {
            console.error('Error destroying the service account JSON file:', error);
        }
    }

    // Main function
    async function main() {
        try {
            // Read the encryption key and IV from the .env file
            const encryptionKeyHex = process.env.ENCRYPTION_KEY;
            const ivHex = process.env.IV;

            // Convert the hexadecimal strings to buffers
            const encryptionKey = Buffer.from(encryptionKeyHex, 'hex');
            const iv = Buffer.from(ivHex, 'hex');

            // Decrypt the encrypted service account JSON file
            await decryptServiceAccount(encryptionKey, iv);

            // Read the navbar/menus database
            await readNavbarMenusDatabase();

            // Destroy the service account JSON file
          //  destroyServiceAccountFile();
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    // Run the main function
    main();
});


app.listen(3100, () => {
    console.log('Response from Spirit Meaning ');
    console.log("App is running on port: 3100");
});
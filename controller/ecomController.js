const information = require('../models/ecomModel');
const info = require('../models/ecomModel');
const bcrypt = require('bcrypt'); // FOR PASSWORD ENCRYPTION
const path = require('path');
const fs = require('fs');
const ecom = {
    add: (req, res) => {
        res.render('add');
    },
    landingpage: (req, res) => {
        res.render('landingpage');
    },
    addtocart: (req, res) => {
        res.render('addtocart');
    },
    index: (req, res) => {
        info.getallproducts((err, results) => {
            if (err) throw err;
            res.render('index', { information: results, user: req.session.user });
        });
    },

    users: (req, res) => {
        info.getallusers((err, results) => {
            if (err) throw err;
            res.render('users', { information: results, user: req.session.user });
        });
    },

    insert: (req, res) => {
        const data = req.body;

        // Check if an image file is uploaded
        const file = req.file;
        let filepath = '';

        if (file) {
            // It's better to store the relative path from the 'public' directory
            filepath = `images/${file.filename}`;  // Remove 'public/' since 'public' is the static folder
        }

        // Add filepath to data object to insert into database
        const productData = {
            ...data,
            filepath: filepath  // Use 'filepath' instead of 'imagePath'
        };

        info.insert(productData, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Server Error');
            }
            res.redirect('/index');
        });
    },


    ///// SHOW PRODUCT TO UPDATE /////
    showUpdateForm: (req, res) => {
        const prodID = req.params.id;
        information.getProductById(prodID, (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                res.render('update', { product: result[0], user: req.session.user });
            } else {
                res.send('Product not found');
            }
        });
    },
    ///// UPDATE /////
    updateProduct: (req, res) => {
        const prodID = req.params.id;
        const updatedData = req.body;
        information.update(prodID, updatedData, (err) => {
            if (err) throw err;
            res.redirect('/index');
        });
    },

    ///// DELETE /////
    deleteProduct: (req, res) => {
        const productId = req.params.id;
        information.delete(productId, (err) => {
            if (err) throw err;
            res.redirect('/index');
        });
    },

    ////////// LOGIN & REGISTER //////////

    ///// REGISTER FORM /////
    showRegisterForm: (req, res) => {
        const successMessage = req.session.successMessage || null;
        req.session.successMessage = null;
        res.render('register', { successMessage });
    },

    ///// USER REGISTRATION /////
    registerUser: (req, res) => {
        const data = req.body;
        const hashedPassword = bcrypt.hashSync(data.password, 10);

        const userData = {
            ...data,
            password: hashedPassword,
            role: 'user'
        };

        ///// INSERTING THE DATA TO DATABASE /////
        information.register(userData, (err) => {
            if (err) {
                console.error(err);
                req.session.errorMessage = 'Error registering user';
                return res.redirect('/register');
            }
            req.session.successMessage = 'Successfully registered!';
            res.redirect('/register');
        });
    },

    ///// LOGIN FORM /////
    showLoginForm: (req, res) => {
        const errorMessage = req.session.errorMessage || null;
        req.session.errorMessage = null;
        res.render('login', { errorMessage });
    },

    ///// USER LOGIN /////
    loginUser: (req, res) => {
        const { email, password } = req.body;

        ///// MATCH EMAIL WITH DB /////
        information.findByEmail(email, (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                return res.render('login', { errorMessage: 'User not found' });
            }

            const user = result[0];

            ///// PASSWORD MATCHING /////
            const isMatch = bcrypt.compareSync(password, user.password);
            if (isMatch) {
                req.session.user = user;

                ///// LOGIN CONDITIONS /////
                if (user.role === 'admin') {
                    res.redirect('/index'); // ADMIN = ADMIN PAGE
                } else {
                    res.redirect('/landingpage'); // USER = LANDING PAGE
                }
            } else {
                return res.render('login', { errorMessage: 'Incorrect password' });
            }
        });
    },

    ///// LOGOUT /////
    logoutUser: (req, res) => {
        req.session.destroy(() => {
            res.redirect('/login');
        });
    }

};


module.exports = ecom;
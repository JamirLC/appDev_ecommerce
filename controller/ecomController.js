const information = require('../models/ecomModel');
const info = require('../models/ecomModel');
const bcrypt = require('bcrypt'); // FOR PASSWORD ENCRYPTION
const ecom = {
    add: (req, res) => {
        res.render('add');
    },
    landingpage: (req, res) => {
        res.render('landingpage');
    },
    index: (req, res) => {
        info.getallproducts((err, results) => {
            if (err) throw err;
            res.render('index', { information: results });
        });
    },

    users: (req, res) => {
        info.getallusers((err, results) => {
            if (err) throw err;
            res.render('users', { information: results });
        });
    },

    insert: (req, res) => {
        const data = req.body;
        info.insert(data, (err) => {
            if (err) throw err;
            res.redirect('/');
        });
    },

    // SHOW PRODUCT TO UPDATE //
    showUpdateForm: (req, res) => {
        const prodID = req.params.id;
        information.getProductById(prodID, (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                res.render('update', { product: result[0] });
            } else {
                res.send('Product not found');
            }
        });
    },
    // UPDATE //
    updateProduct: (req, res) => {
        const prodID = req.params.id;
        const updatedData = req.body;
        information.update(prodID, updatedData, (err) => {
            if (err) throw err;
            res.redirect('/');
        });
    },

    // DELETE //
    deleteProduct: (req, res) => {
        const productId = req.params.id;
        information.delete(productId, (err) => {
            if (err) throw err;
            res.redirect('/');
        });
    },

////////// LOGIN & REGISTER //////////

    // REGISTER FORM
    showRegisterForm: (req, res) => {
        const successMessage = req.session.successMessage || null;
        req.session.successMessage = null;
        res.render('register', { successMessage });
    },

    // USER REGISTRATION
    registerUser: (req, res) => {
        const data = req.body;
        const hashedPassword = bcrypt.hashSync(data.password, 10);
    
        // Automatically set the role to 'user'
        const userData = {
            ...data,
            password: hashedPassword,
            role: 'user' // Assign 'user' role by default
        };
    
        // INSERTING THE DATA TO DATABASE
        information.register(userData, (err) => {
            if (err) {
                console.error(err);
                req.session.errorMessage = 'Error registering user'; // Set error message in session
                return res.redirect('/register'); // Redirect to register page
            }
            req.session.successMessage = 'Successfully registered!'; // Set success message in session
            res.redirect('/register'); // Redirect to login page
        });
    },

    // LOGIN FORM
    showLoginForm: (req, res) => {
        const errorMessage = req.session.errorMessage || null;
        req.session.errorMessage = null;
        res.render('login', { errorMessage });
    },

        // USER LOGIN
        loginUser: (req, res) => {
        const { email, password } = req.body;

        // MATCH EMAIL WITH DB
        information.findByEmail(email, (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                return res.render('login', { errorMessage: 'User not found' });
            }
            
            const user = result[0];

            // PASSWORD MATCHING
            const isMatch = bcrypt.compareSync(password, user.password);
            if (isMatch) {
                req.session.user = user;
                
                // LOGIN CONDITIONS
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

    //LOGOUT
    logoutUser: (req, res) => {
        req.session.destroy(() => {
            res.redirect('/login');
        });
    }
};


module.exports = ecom;
const information = require('../models/ecomModel');
const bcrypt = require('bcrypt'); // FOR PASSWORD ENCRYPTION
const path = require('path');
const fs = require('fs');

const ecom = {
    add: (req, res) => {
        res.render('add');
    },
    landingpage: (req, res) => {
        information.getallproducts((err, results) => {
            if (err) throw err;
            res.render('landingpage', { information: results, user: req.session.user });
        });
    },
    addtocart: (req, res) => {
        res.render('addtocart');
    },
    profile: (req, res) => {
        res.render('profile');
    },
    index: (req, res) => {
        information.getallproducts((err, results) => {
            if (err) throw err;


            const limit = 10;
            const page = parseInt(req.query.page) || 1;
            const totalResults = results.length;
            const totalPages = Math.ceil(totalResults / limit);
            const offset = (page - 1) * limit;

            const paginatedResults = results.slice(offset, offset + limit);

            res.render('index', {
                information: paginatedResults,
                user: req.session.user,
                message: null,
                currentPage: page,
                totalPages: totalPages,
                searchTerm: ''
            });
        });
    },

    users: (req, res) => {
        information.getallusers((err, results) => {
            if (err) throw err;


            const limit = 10;
            const page = parseInt(req.query.page) || 1;
            const totalResults = results.length;
            const totalPages = Math.ceil(totalResults / limit);
            const offset = (page - 1) * limit;

            const paginatedResults = results.slice(offset, offset + limit);

            res.render('users', {
                information: paginatedResults,
                user: req.session.user,
                message: null,
                currentPage: page,
                totalPages: totalPages,
                searchTerm: ''
            });
        });
    },

    insert: (req, res) => {
        const data = req.body;

        const file = req.file;
        let filepath = '';

        if (file) {
            filepath = `images/${file.filename}`;
        }

        const productData = {
            ...data,
            filepath: filepath
        };

        information.insert(productData, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Server Error');
            }
            res.redirect('/index');
        });
    },

    purchasehistory: (req, res) => {
        res.render('purchasehistory');
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

        const file = req.file;
        let newFilePath = '';

        if (file) {
            newFilePath = `images/${file.filename}`;

            //RETRIEVE THE EXISTING PRODUCT TO GET THE OLD FILE PATH
            information.getProductById(prodID, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Server Error');
                }
                if (result.length === 0) {
                    return res.status(404).send('Product not found');
                }

                const oldFilePath = path.join(__dirname, '../public/', result[0].filepath);

                // UPDATE THE PRODUCT WITH THE NEW FILE PATH
                const productData = {
                    ...updatedData,
                    filepath: newFilePath
                };

                information.update(prodID, productData, (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Server Error');
                    }

                    // DELETE THE OLD IMAGE FILE IF IT EXISTS
                    if (result[0].filepath) {
                        fs.unlink(oldFilePath, (err) => {
                            if (err) {
                                console.error('Failed to delete old image:', err);
                            }
                            res.redirect('/index');
                        });
                    } else {
                        res.redirect('/index');
                    }
                });
            });
        } else {
            // IF NO NEW FILE IS UPLOADED, RETAIN THE OLD FILE PATH
            information.getProductById(prodID, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Server Error');
                }
                if (result.length === 0) {
                    return res.status(404).send('Product not found');
                }

                const productData = {
                    ...updatedData,
                    filepath: result[0].filepath
                };

                information.update(prodID, productData, (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Server Error');
                    }
                    res.redirect('/index');
                });
            });
        }
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

    ///// SEARCH FUNCTIONALITY /////
    search: (req, res) => {
        const searchTerm = req.query.query ? req.query.query.trim() : '';
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        if (!searchTerm) {
            return res.redirect('/index');
        }


        information.searchProducts(searchTerm, limit, offset, (err, results) => {
            if (err) {
                console.error('Error during search:', err);
                return res.status(500).send('Server Error');
            }

            information.countSearchResults(searchTerm, (countErr, countResult) => {
                if (countErr) {
                    console.error('Error counting search results:', countErr);
                    return res.status(500).send('Server Error');
                }

                const totalResults = countResult[0].count;
                const totalPages = Math.ceil(totalResults / limit);

                res.render('index', {
                    information: results,
                    user: req.session.user,
                    message: results.length === 0 ? 'No products found matching your search.' : null,
                    currentPage: page,
                    totalPages: totalPages,
                    searchTerm: searchTerm
                });
            });
        });
    },

    search2: (req, res) => {
        const searchTerm = req.query.query ? req.query.query.trim() : '';
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        if (!searchTerm) {
            return res.redirect('/index');
        }


        information.searchUsers(searchTerm, limit, offset, (err, results) => {
            if (err) {
                console.error('Error during search:', err);
                return res.status(500).send('Server Error');
            }

            information.countSearchResults2(searchTerm, (countErr, countResult) => {
                if (countErr) {
                    console.error('Error counting search results:', countErr);
                    return res.status(500).send('Server Error');
                }

                const totalResults = countResult[0].count;
                const totalPages = Math.ceil(totalResults / limit);

                res.render('users', {
                    information: results,
                    user: req.session.user,
                    message: results.length === 0 ? 'No Users found matching your search.' : null,
                    currentPage: page,
                    totalPages: totalPages,
                    searchTerm: searchTerm
                });
            });
        });
    },

    ///// LOGOUT /////
    logoutUser: (req, res) => {
        req.session.destroy(() => {
            res.redirect('/login');
        });
    },

    addtocart: (req, res) => {
        information.getallproducts((err, products) => {
            if (err) throw err;
            res.render('addtocart', { products: products });
        });
    },
    
    checkout: (req, res) => {
        const { productIds, quantities } = req.body; // Assuming you use arrays to capture these
        // Logic to handle the checkout process, e.g., calculate totals, save to the database, etc.
        res.redirect('/checkout-success'); // Redirect to a success page after processing
    }
};

module.exports = ecom;

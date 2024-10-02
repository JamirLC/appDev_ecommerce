const information = require('../models/ecomModel');
const info = require('../models/ecomModel');
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
    }
};


module.exports = ecom;
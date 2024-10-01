const information = require('../models/ecomModel');
const info = require('../models/ecomModel');
const ecom = {
    add: (req, res) => {
        res.render('add');
    },


    index: (req, res) => {
        info.getallproducts((err, results) => {
            if (err) throw err;
            res.render('index', { information: results });
        });
    },

    insert: (req, res) => {
        const data = req.body;
        info.insert(data, (err) => {
            if (err) throw err;
            res.redirect('/');
        });
    }
};

module.exports = ecom;
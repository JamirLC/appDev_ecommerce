const information = require('../models/ecomModel');
const info = require('../models/ecomModel');
const jmski = {
    add: (req, res) => {
        res.render('add');
    },


    index: (req, res) => {
        info.getAll((err, results) => {
            if (err) throw err;
            res.render('index', { information: results });
        });
    },

    save: (req, res) => {
        const data = req.body;
        info.save(data, (err) => {
            if (err) throw err;
            res.redirect('/');
        });
    }
};

module.exports = jmski;
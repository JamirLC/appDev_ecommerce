const db = require('../config/db');
const information = {
    insert: (data, callback) => {
        const query = "INSERT INTO products (prodname, description, price, quantity) values(?, ?, ?, ?)";

        db.query(query, [data.prodname, data.description, data.price, data.quantity], callback);
    },
    getallproducts: (callback) => {
        const query = "SELECT * FROM products";
        db.query(query, callback);
    }
};

module.exports = information;
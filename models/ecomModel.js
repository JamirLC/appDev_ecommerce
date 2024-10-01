const db = require('../config/db');
const information = {
    insert: (data, callback) => {
        const query = "INSERT INTO products (prodname, description, price, quantity) values(?, ?, ?, ?)";

        db.query(query, [data.prodname, data.description, data.price, data.quantity], callback);
    },
    getallproducts: (callback) => {
        const query = "SELECT * FROM products";
        db.query(query, callback);
    },

    getallusers: (callback) => {
        const query = "SELECT * FROM users";
        db.query(query, callback);
    },

    //UPDATE
    getProductById: (prodID, callback) => {
        const query = "SELECT * FROM products WHERE prodID = ?";
        db.query(query, [prodID], callback);
    },

    update: (prodID, data, callback) => {
        const query = "UPDATE products SET prodname = ?, description = ?, price = ?, quantity = ? WHERE prodID = ?";
        db.query(query, [data.prodname, data.description, data.price, data.quantity, prodID], callback);
    },

    // DELETE
    delete: (id, callback) => {
        const query = "DELETE FROM products WHERE prodID = ?";
        db.query(query, [id], callback);
    }
};

module.exports = information;
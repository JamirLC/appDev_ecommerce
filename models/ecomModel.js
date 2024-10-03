const db = require('../config/db');
const information = {
    insert: (data, callback) => {
        const query = "INSERT INTO products (prodname, description, price, quantity, filepath) values(?, ?, ?, ?, ?)";
        db.query(query, [data.prodname, data.description, data.price, data.quantity, data.filepath], callback);
    },

    getallproducts: (callback) => {
        const query = "SELECT * FROM products";
        db.query(query, callback);
    },

    getallusers: (callback) => {
        const query = "SELECT * FROM users";
        db.query(query, callback);
    },

    ///// UPDATE /////
    getProductById: (prodID, callback) => {
        const query = "SELECT * FROM products WHERE prodID = ?";
        db.query(query, [prodID], callback);
    },

    update: (prodID, data, callback) => {
        const query = "UPDATE products SET prodname = ?, description = ?, price = ?, quantity = ?, filepath = ? WHERE prodID = ?";
        db.query(query, [data.prodname, data.description, data.price, data.quantity, prodID], callback);
    },

    ///// DELETE /////
    delete: (id, callback) => {
        const query = "DELETE FROM products WHERE prodID = ?";
        db.query(query, [id], callback);
    },

    ////////// USERS //////////

    ///// REGISTER /////
    register: (userData, callback) => {
        const query = "INSERT INTO users (fname, lname, email, password, role) VALUES (?, ?, ?, ?, ?)";
        db.query(query, [userData.fname, userData.lname, userData.email, userData.password, userData.role], callback);
    },

    ///// CHECK EMAIL /////
    findByEmail: (email, callback) => {
        const query = "SELECT * FROM users WHERE email = ?";
        db.query(query, [email], callback);
    }
};

module.exports = information;
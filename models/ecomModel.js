// models/ecomModel.js
const db = require('../config/db');
const information = {
    insert: (data, callback) => {
        const query = "INSERT INTO products (prodname, description, price, quantity, filepath) VALUES (?, ?, ?, ?, ?)";
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
        db.query(query, [data.prodname, data.description, data.price, data.quantity, data.filepath, prodID], callback);
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
    },
    ///////////// SEARCH QUERIES /////

    ///// SEARCH PRODUCTS /////
    searchProducts: (searchTerm, limit, offset, callback) => {
        const query = `
            SELECT * FROM products 
            WHERE prodname LIKE ? 
               OR prodID LIKE ?
            ORDER BY prodID ASC
            LIMIT ? OFFSET ?
        `;
        const likeTerm = `%${searchTerm}%`;
        db.query(query, [likeTerm, likeTerm, limit, offset], callback);
    },

    ///// COUNT SEARCH RESULTS /////
    countSearchResults: (searchTerm, callback) => {
        const query = `
            SELECT COUNT(*) AS count FROM products 
            WHERE prodname LIKE ? 
               OR description LIKE ?`;
        const likeTerm = `%${searchTerm}%`;
        db.query(query, [likeTerm, likeTerm], callback);
    },

    ///// SEARCH USERS /////
    searchUsers: (searchTerm, limit, offset, callback) => {
        const query = `
            SELECT * FROM users 
            WHERE fname LIKE ? 
               OR lname LIKE ?
            ORDER BY userID ASC
            LIMIT ? OFFSET ?
        `;
        const likeTerm = `%${searchTerm}%`;
        db.query(query, [likeTerm, likeTerm, limit, offset], callback);
    },

    ///// COUNT SEARCH RESULTS FOR USERS /////
    countSearchResults2: (searchTerm, callback) => {
        const query = `
            SELECT COUNT(*) AS count FROM users 
            WHERE fname LIKE ? 
               OR lname LIKE ?
        `;
        const likeTerm = `%${searchTerm}%`;
        db.query(query, [likeTerm, likeTerm], callback);
    },
};

module.exports = information;

const db = require('../config/db');
const information = {
    save: (data, callback) => {
        const query = "INSERT INTO users (fname, lname, age, address) values(?, ?, ?, ?)";

        db.query(query, [data.fname, data.lname, data.age, data.address], callback);
    },
    getAll: (callback) => { 
        const query = "SELECT * FROM users";
        db.query(query, callback);
    }
};

module.exports = information;
const bcrypt = require('bcrypt');


const password = 'admin'; 
const hashedPassword = bcrypt.hashSync(password, 10);

console.log('Hashed password:', hashedPassword);

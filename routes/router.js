const express = require('express');
const router = express.Router();
const ecom = require('../controller/ecomController');

router.get('/', ecom.index);
router.get('/add', ecom.add);
router.post('/insert', ecom.insert);
router.get('/index', ecom.index);
router.get('/users', ecom.users);
router.get('/landingpage', ecom.landingpage);

////////// LOGIN & REGISTER //////////
router.get('/login', ecom.showLoginForm);
router.post('/login', ecom.loginUser);
router.get('/register', ecom.showRegisterForm);
router.post('/register', ecom.registerUser);

////////// UPDATE & DELETE //////////
router.get('/update/:id', ecom.showUpdateForm);
router.post('/update/:id', ecom.updateProduct);
router.get('/delete/:id', ecom.deleteProduct);

////////// LOGOUT //////////
router.get('/logout', ecom.logoutUser);

module.exports = router;

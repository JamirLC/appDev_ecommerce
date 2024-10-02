const express = require('express');
const router = express.Router();
const ecom = require('../controller/ecomController');
const { isAdmin, checkAuth } = require('../middleware');

////////// PUBLIC ROUTES //////////
router.get('/', ecom.index);
router.get('/add', checkAuth, ecom.add);
router.post('/insert', checkAuth, ecom.insert);
router.get('/landingpage', ecom.landingpage);
router.get('/addtocart', ecom.addtocart);

/////////// ADMIN ROUTES //////////
router.get('/index', isAdmin, ecom.index);
router.get('/users', isAdmin, ecom.users);

////////// LOGIN & REGISTER //////////
router.get('/login', ecom.showLoginForm);
router.post('/login', ecom.loginUser);
router.get('/register', ecom.showRegisterForm);
router.post('/register', ecom.registerUser);

////////// UPDATE & DELETE //////////
router.get('/update/:id', checkAuth, isAdmin, ecom.showUpdateForm);
router.post('/update/:id', checkAuth, isAdmin, ecom.updateProduct);
router.get('/delete/:id', checkAuth, isAdmin, ecom.deleteProduct);

////////// LOGOUT //////////
router.get('/logout', ecom.logoutUser);

module.exports = router;

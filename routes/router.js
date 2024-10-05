const express = require('express');
const router = express.Router();
const ecom = require('../controller/ecomController');
const { isAdmin, checkAuth } = require('../middleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// STORAGE FOR MULTER
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

//MIDDLEWARE
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, //(1MB here)
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
});

////////// PUBLIC ROUTES //////////
router.get('/', ecom.index);
router.get('/add', checkAuth, ecom.add);
router.post('/insert', checkAuth, upload.single('image'), ecom.insert);
router.get('/landingpage', ecom.landingpage);
router.get('/addtocart', ecom.addtocart);
router.post('/checkout', checkAuth, ecom.checkout);
router.get('/purchasehistory', ecom.purchasehistory);
router.get('/profile', ecom.profile);

/////////// ADMIN ROUTES //////////
router.get('/index', isAdmin, ecom.index);
router.get('/users', isAdmin, ecom.users);

////////// SEARCH ROUTE //////////
router.get('/search', checkAuth, isAdmin, ecom.search);
router.get('/search2', checkAuth, isAdmin, ecom.search2);

////////// LOGIN & REGISTER //////////
router.get('/login', ecom.showLoginForm);
router.post('/login', ecom.loginUser);
router.get('/register', ecom.showRegisterForm);
router.post('/register', ecom.registerUser);

////////// UPDATE & DELETE //////////
router.get('/update/:id', checkAuth, isAdmin, ecom.showUpdateForm);
// router.post('/update/:id', checkAuth, isAdmin, ecom.updateProduct);
router.post('/update/:id', checkAuth, isAdmin, upload.single('image'), ecom.updateProduct);
router.get('/delete/:id', checkAuth, isAdmin, ecom.deleteProduct);

////////// LOGOUT //////////
router.get('/logout', ecom.logoutUser);

router.post('/add-to-cart', (req, res) => {
    const { prodID, price, quantity } = req.body;
    const userID = req.session.userID; // Assuming you have session management

    // Generate a unique cartID (you can change this logic based on your needs)
    const cartID = Date.now();

    const query = 'INSERT INTO cart (cartID, userID, prodID, quantity, price) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [cartID, userID, prodID, quantity, price], (err, result) => {
        if (err) {
            console.error('Error adding product to cart:', err);
            return res.status(500).json({ message: 'Error adding product to cart' });
        }
        res.status(200).json({ message: 'Product added to cart' });
    });
});


module.exports = router;

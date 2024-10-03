const express = require('express');
const router = express.Router();
const ecom = require('../controller/ecomController');
const { isAdmin, checkAuth } = require('../middleware');
const multer = require('multer');
const path = require('path');

// Define storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');  // Directory where images will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file with current timestamp
    }
});

// Initialize upload middleware
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Set file size limit (1MB here)
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
router.post('/update/:id', checkAuth, isAdmin, upload.single('image'), ecom.updateProduct);
router.get('/delete/:id', checkAuth, isAdmin, ecom.deleteProduct);

////////// LOGOUT //////////
router.get('/logout', ecom.logoutUser);

module.exports = router;

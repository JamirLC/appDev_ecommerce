const express = require('express');
const router = express.Router();
const ecom = require('../controller/ecomController');

router.get('/', ecom.index);
router.get('/add', ecom.add);
router.post('/insert', ecom.insert);
router.get('/index', ecom.index);
router.get('/users', ecom.users);
router.get('/userhome', ecom.userhome);

router.get('/update/:id', ecom.showUpdateForm); // CALL/SHOW UPDATE FORM
router.post('/update/:id', ecom.updateProduct); // SUBMIT THE UPDATED ATTRIBUTES

router.get('/delete/:id', ecom.deleteProduct); // DELETE MO NA AGAD

module.exports = router;

const express = require('express');
const router = express.Router();
const jmski = require('../controller/ecomController');

router.get('/', jmski.index);
router.get('/add', jmski.add);
router.post('/insert', jmski.insert);
router.get('/index', jmski.index);

router.get('/update/:id', jmski.showUpdateForm); // CALL/SHOW UPDATE FORM
router.post('/update/:id', jmski.updateProduct); // SUBMIT THE UPDATED ATTRIBUTES

router.get('/delete/:id', jmski.deleteProduct); // DELETE MO NA AGAD

module.exports = router;

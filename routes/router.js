const express = require('express');
const router = express.Router();
const jmski = require('../controller/ecomController');
router.get('/', jmski.index);
router.get('/add', jmski.add);
router.post('/save', jmski.save);
router.get('/index', jmski.index);
module.exports = router;

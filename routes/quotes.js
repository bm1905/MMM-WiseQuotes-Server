// Quote Route

const express = require('express');
const router = express.Router();
const Quote = require('../controllers/quote');
const UserCtrl = require('../controllers/user');
const Cache  = require('../helpers/cache');

router.get('', Cache.cache(100) ,Quote.allQuotes);
router.get('/random', Quote.randomQuote);
router.get('/:category', Quote.quotesByCategory);
router.post('', UserCtrl.authMiddleware, Quote.addQuotes);

module.exports = router;
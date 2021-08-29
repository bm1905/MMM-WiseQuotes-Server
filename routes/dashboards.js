const express = require('express');
const router = express.Router();

const UserCtrl = require('../controllers/user');

// Test route for user authentication.
router.get('/secret', UserCtrl.authMiddleware, function(req, res) {
    res.json({'secret': true});
});

router.get('', UserCtrl.authMiddleware, function(req, res) {
    res.json({'ok': true});
});

module.exports = router;
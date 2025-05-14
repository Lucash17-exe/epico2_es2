const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');
const authorize = require('../middleware/authorize');

router.post('/:appid', authorize('app', 'appid', 'owner'), passwordController.createPassword);
router.put('/:appid', authorize('app', 'appid', 'owner'),passwordController.updatePassword);
router.get('/:appid', authorize('app', 'appid', 'owner'),passwordController.getPassword);

module.exports = router;
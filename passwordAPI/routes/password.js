const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');

router.post('/:appid', passwordController.createPassword);
router.put('/:appid', passwordController.updatePassword);
router.get('/:appid', passwordController.getPassword);

module.exports = router;
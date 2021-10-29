const e = require('express');
const express = require('express');
const router = express.Router();
const UserAction = require('../controllers/user');

router.post('/signup', UserAction.signup);
router.post('/login', UserAction.login);
router.get('/', UserAction.getAllUsers);
router.get('/:userId', UserAction.getUserById);
router.delete('/:userId', UserAction.deleteUser);

module.exports = router;
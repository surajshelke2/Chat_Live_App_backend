const express = require('express');
const { registerUser, login, allUsers } = require('../controllers/user');
const { protect } = require('../middleware/Authentication');


const router = express.Router();

router.post('/register', registerUser); 

router.post('/login', login);
router.route('/').get(protect,allUsers);

module.exports = router;

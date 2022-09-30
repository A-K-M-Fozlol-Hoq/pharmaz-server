const express = require('express');
const userController = require('../controllers/userController');
// const { verifyCustomTokenMiddleware } = require('../middlewares/verifyCustomToken');
// Destructuring controllers
const { createUser } = userController;

// Router Object -- module scaffolding
const router = express.Router();

/**
 * @method POST
 * @endpoint base_url/api/user/createUser
 */
router.post('/createUser', createUser);

module.exports = router;

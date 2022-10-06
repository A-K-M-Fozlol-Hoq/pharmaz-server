const express = require('express');
const userController = require('../controllers/userController');
// const { verifyCustomTokenMiddleware } = require('../middlewares/verifyCustomToken');
// Destructuring controllers
const { createUser, getUser } = userController;

// Router Object -- module scaffolding
const router = express.Router();

/**
 * @method POST
 * @endpoint base_url/api/user/createUser
 */
router.post('/createUser', createUser);

/**
 * @method POST
 * @endpoint base_url/api/user/getUser
 */
router.post('/getUser', getUser);

module.exports = router;

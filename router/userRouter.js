const express = require('express');
const userController = require('../controllers/userController');
// const { verifyTokenMiddleware } = require('../middlewares/verifyToken');
// Destructuring controllers
const { createUser } = userController;

// Router Object -- module scaffolding
const router = express.Router();

/**
 * @method POST
 * @endpoint base_url/api/user/createUser
 */
router.post('/createUser', verifyTokenMiddleware, createUser);

module.exports = router;

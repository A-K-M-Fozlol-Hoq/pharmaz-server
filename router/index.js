const router = require('express').Router();
const userRouter = require('./userRouter');
const demoRouter = require('./demoRouter');

router.use('/user', userRouter);
router.use('/demo', demoRouter);

module.exports = router;

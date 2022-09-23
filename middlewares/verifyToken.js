const jwt = require('jsonwebtoken');

// writing utils function instead of middleware
const getEmailFromToken = (token) => {};
const createError = require('http-errors');

const verifyTokenMiddleware = async (req, res, next) => {
  if (req.headers?.authorization?.startsWith('Bearer ')) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { email } = decoded;
      return email;
    } catch (e) {
      res.status(401).send({
        isSuccess: false,
        isTokenExpired: true,
        message: e.message || 'Token expired, please login again',
      });
    }
  } else {
    next(createError(401, 'Please send valid token at header!'));
  }
  next();
};

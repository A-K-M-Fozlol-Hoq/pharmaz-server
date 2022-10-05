const jwt = require('jsonwebtoken');
// internal imports
const User = require('../models/User');
const {
  isNameValidFunc,
  isEmailValidFunc,
  isUserTypeValidFunc,
} = require('../utils/validation');

// user controller object
const userController = {};

// insert new user at user collection
userController.createUser = async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const userType = req.body.userType;

    const tokenSecret = req.headers?.authorization?.split(' ')[1];
    console.log(tokenSecret, 'tokenSecret,', typeof tokenSecret);
    console.log(
      process.env.USER_TOKEN_KEY,
      typeof process.env.USER_TOKEN_KEY,
      'USER_TOKEN_KEY',
      process.env.USER_TOKEN_KEY === tokenSecret
    );
    if (!tokenSecret || process.env.USER_TOKEN_KEY != tokenSecret) {
      const error = new Error('Please send valid token!');
      error.code = 401;
      throw error;
    }
    if (name && email && userType) {
      // validation part
      const isNameValid = isNameValidFunc(name);
      const isEmailValid = isEmailValidFunc(email);
      const isUserTypeValid = isUserTypeValidFunc(userType);

      if (isNameValid && isEmailValid && isUserTypeValid) {
        const newUserData = {
          name: name,
          email: email,
          userType: userType,
        };
        const newUser = new User(newUserData);

        // save at database
        const result = await newUser.save();
        // create jwt token
        var token = jwt.sign({ newUserData }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE, // expires in 1 day
        });

        res.status(200).json({
          isSuccess: true,
          message: 'user data successfully saved',
          result,
          token,
        });
      } else {
        res.status(422).json({
          isSuccess: false,
          message: 'please provide valid name, email and userType.',
        });
      }
    } else {
      res.status(422).json({
        isSuccess: false,
        message: 'name, email and userType are required',
      });
    }
  } catch (e) {
    res.status(e.code || 500).send({
      message: e.message || `unknown error ocurred at user controller`,
      isSuccess: false,
    });
  }
};

userController.getUser = async (req, res, next) => {
  try {
    const email = req.body.email;

    if (email) {
      // validation part
      const isEmailValid = isEmailValidFunc(email);

      if (isEmailValid) {
        // get from db
        const user = User.findOne({ email: email });
        if (user) {
          // create jwt token
          const tokenData = {
            name: user.name,
            email: email,
            userType: user.userType,
          };
          var token = jwt.sign({ tokenData }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE, // expires in 1 day
          });

          res.status(200).json({
            isSuccess: true,
            message: 'found user data',
            user,
            token,
          });
        } else {
          res.status(400).json({
            isSuccess: true,
            message:
              'the data in the input request is not valid or present in the db',
            user,
            token,
          });
        }
      } else {
        res.status(422).json({
          isSuccess: false,
          message: 'please provide valid email.',
        });
      }
    } else {
      res.status(422).json({
        isSuccess: false,
        message: ' email is required',
      });
    }
  } catch (e) {
    res.status(e.code || 500).send({
      message: e.message || `unknown error ocurred at user controller`,
      isSuccess: false,
    });
  }
};

module.exports = userController;

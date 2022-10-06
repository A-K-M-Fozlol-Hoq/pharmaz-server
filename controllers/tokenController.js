const jwt = require('jsonwebtoken');

// user controller object
const tokenController = {};

// insert new user at token collection
tokenController.updateToken = async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const userType = req.body.userType;

    const tokenSecret = req.headers?.authorization?.split(' ')[1];
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
        console.log(name, email, tokenSecret, userType);
        const newUserData = {
          name: name,
          email: email,
          userType: userType,
        };
        const newUser = new User(newUserData);
        console.log(newUser);
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

module.exports = tokenController;

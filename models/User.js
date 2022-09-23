// external imports
const { Schema, model } = require('mongoose');

// create schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 50,
      unique: true,
    },
    userType: {
      type: String,
      enum: ['consumer', 'proprietor'],
      default: 'consumer',
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'user',
  }
);

// create model
const User = model('User', userSchema);

// export model
module.exports = User;

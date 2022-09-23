// external imports
const { Schema, model } = require('mongoose');

// create schema
const shopSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
      minlength: 2,
    },
    owner_email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 50,
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
    collection: 'shop',
  }
);

// create model
const Shop = model('Shop', shopSchema);

// export model
module.exports = Shop;

// external imports
const { Schema, model } = require('mongoose');

// create schema
const shopSchema = new Schema(
  {
    shopName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
      minlength: 2,
    },
    shopOwner: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 50,
    },
    employees: [String],
    shopLocation: {
      type: String,
      trim: true,
      maxlength: 20,
      minLength: 3,
    },
    profilePicture: {
      type: String,
      required: true,
    },
    backgroundPhoto: {
      type: String,
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

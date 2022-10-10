// external imports
const { Schema, model } = require('mongoose');

// create schema
const medicineSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
      maxlength: 150,
    },
    company: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
      maxlength: 100,
    },
    bdtPrice: {
      // type: Schema.Types.Mixed,
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
    collection: 'medicine',
  }
);

// create model
const Medicine = model('Medicine', medicineSchema);

// export model
module.exports = Medicine;

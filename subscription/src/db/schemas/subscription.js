const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  ID: mongoose.ObjectId,
  email: { type: String, required: true },
  firstName: String,
  gender: String,
  dateOfBirth: { type: Date, required: true },
  consent: { type: Boolean, required: true },
  NewsletterId: { type: Number, required: true },
  updated_at: Date,
  created_at: Date,
});

// eslint-disable-next-line func-names
SubscriptionSchema.pre('save', function (next) {
  const now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  // eslint-disable-next-line no-underscore-dangle
  this.ID = this._id;

  next();
});

module.exports = {
  SubscriptionSchema,
};

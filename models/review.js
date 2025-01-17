const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  user: String,
  rating: Number,
  comment: String,
  date: Date,
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = (Review);
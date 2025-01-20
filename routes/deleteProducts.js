const router = require("express").Router();
const Product = require("../models/product");
const Review = require("../models/review");

router.delete("/products/:product", async (req, res, next) => {
  try {
    const productId = req.params.product // Get productId from params

    const product = await Product.findByIdAndDelete(productId) // Mongoose method to find the id matching productId and delete from collection

    if (!product) {
      return res.status(404).json({message: "Product not found"})
    };

    res.status(200).json({
      message: "Product successfully deleted",
      product
    });
  } catch(err) {
    console.error("Error deleting product:", err)
    res.status(500).json({error: "An error occured while deleting the product"})
  }
});

router.delete("/products/:product/reviews/:review", async (req, res, next) => {
  try {
    const productId = req.params.product // Get productId from params
    const reviewId = req.params.review // Get reviewId from params
    const product = await Product.findById(productId) // Mongoose method to find the id matching productId

    if (!product) {
      return res.status(404).json({message: "Product not found"})
    };

    const review = await Review.findByIdAndDelete(reviewId) // Mongoose method to find the id matching reviewId and delete from collection

    if (!review) {
      return res.status(404).json({message: "Review not found"})
    };
    
    res.status(200).json({
      message: "Review successfully deleted",
      review
    });
  } catch (err) {
    console.error("Error deleting review")
    res.status(500).json({error: "An error occured while deleting the review"})
  }
});

module.exports = router
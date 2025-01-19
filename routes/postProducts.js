const router = require("express").Router();
const Product = require("../models/product");
const Review = require("../models/review");

router.post("/products", async (req, res, next) => {
  try {
    const { name, price, category, image } = req.body; // Get product info from user's input

    if(!name || !price || !category) {
      return res.status(400).json({error: 'Name, price, and category are required'});
    };

    const product = new Product({ // Create a new product with this product info
      name,
      price,
      category,
      image: image || "https://via.placeholder.com/250?text=Product+Image"
    });

    const savedProduct = await product.save(); // Save product to product collection

    res.status(201).json({
      message: 'product successfully created',
      product: savedProduct
    });
  } catch (err) {
    console.error('error creating product:', err);
    res.status(500).json({ error: "An error occurred while creating the product" });
  }
});

router.post("/products/:product/reviews", async (req, res, next) => {
  try {

    const productId = req.params.product // Finds id by params

    const {user, rating, comment } = req.body // Finds fields from user input
    
    const product = await Product.findById(productId); // Mongoose method to search for product matching id in the product collection

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    };

    if (!user || !rating || !comment) {
      return res.status(400).json({error: 'User, rating, and comment are required'});
    };

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    };

    const review = new Review({ // Create review with following fields
      productId,
      user,
      rating,
      comment
    });

    const savedReview = await review.save(); // Save review to reviews coollection

    res.status(200).json({
      message: 'Review successfully created',
      review: savedReview,
    });

  } catch (err) {
    console.error('error creating review:', err)
    res.status(500).json({error: 'an error occurred while creating the review'})
  };
});

module.exports = router;
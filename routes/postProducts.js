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

module.exports = router;
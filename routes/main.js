const router = require("express").Router();
const faker = require("faker");
const Product = require("../models/product");

router.get("/generate-fake-data", async (req, res, next) => {
  try {
    for (let i = 0; i < 90; i++) {
      const product = new Product({ // Create an array of fake products
        category: faker.commerce.department(),
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        image: "https://via.placeholder.com/250?text=Product+Image",
      });

      await product.save();
    }
    res.send("Fake data generation complete!");
  } catch (err) {
    console.error("Error generating fake data:", err);
    res.status(500).send("An error occurred while generating fake data.");
  }
});

router.get("/products", async (req, res, next) => {
  try {
  const perPage = 9;

  const page = req.query.page || 1 // Returns first page by default

  const [products, count] = await Promise.all([
  Product.find({})
  .skip(perPage * page - perPage)
  .limit(perPage),
  Product.countDocuments()
  ])
    Product.countDocuments().exec((err, count) => {
      if (err) return next(err)
    })
    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(count / perPage),
      totalItems: count,
    });
  } catch (error) {
    next(error); // Pass errors to the global error handler
  }
});

module.exports = router;
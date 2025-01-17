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
  console.log('Get /products called')
  try {
  const perPage = 9; // Items allowed per page to view

  const page = parseInt(req.query.page, 10) || 1 // Uses requested page number or defaults to page 1

  const [products, count] = await Promise.all([ // Promise.all holds runtime until all promises are fufilled
  Product.find({})
  .skip(perPage * page - perPage) // Skips the number of items per page up to end of current page, then subtracts current page to display
  .limit(perPage),
  Product.countDocuments() // method to count documents with mongoose AKA to see how many products are in the collection
  ])
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
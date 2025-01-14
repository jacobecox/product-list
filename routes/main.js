const router = require("express").Router();
const faker = require("faker");
const Product = require("../models/product");

router.get("/generate-fake-data", async (req, res, next) => {
  try {
    for (let i = 0; i < 90; i++) {
      const product = new Product({
        category: faker.commerce.department(),
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        image: "https://via.placeholder.com/250?text=Product+Image",
      });

      console.log('product:', product)

      await product.save();
    }
    res.send("Fake data generation complete!");
  } catch (err) {
    console.error("Error generating fake data:", err);
    res.status(500).send("An error occurred while generating fake data.");
  }
});

module.exports = router;
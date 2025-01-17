const router = require("express").Router();
const faker = require("faker");
const Product = require("../models/product");
const Review = require("../models/review");

router.get("/generate-fake-data", async (req, res, next) => {
  try {
    for (let i = 0; i < 90; i++) {
      const product = new Product({
        category: faker.commerce.department(),
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        image: "https://via.placeholder.com/250?text=Product+Image",
      });

      await product.save(); // Save the product first

      // Generate reviews for the product
      for (let j = 0; j < 5; j++) {
        const review = new Review({
          productId: product._id, // Associate review with the product
          user: faker.internet.userName(),
          rating: faker.datatype.number({ min: 1, max: 5 }),
          comment: faker.lorem.sentences(2),
          date: faker.date.recent(),
        });
        await review.save(); // Save each review
      }
    }

    res.send("Fake data generation complete!");
  } catch (err) {
    console.error("Error generating fake data:", err);
    res.status(500).send("An error occurred while generating fake data.");
  }
});

router.get("/products", async (req, res, next) => {
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

router.get("/products/:product", async (req, res, next) => {
  try {
    const productId = req.params.product // Get product id from params
    
    const product = await Product.findById(productId) // mongoose method to find the id matching productId
    
    if(!product) { // handle if no matching id is found
      return res.status(404).json({ message: 'product not found'})
    }
    
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/products/:product/reviews", async (req, res, next) => {
  try {
    const productId = req.params.id;
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = 10;

    const reviews = await Review.find({ productId })
      .skip((page - 1) * perPage)
      .limit(4);

    const totalReviews = await Review.countDocuments({ productId });

    res.status(200).json({
      reviews,
      currentPage: page,
      totalPages: Math.ceil(totalReviews / perPage),
    });
  }
  catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
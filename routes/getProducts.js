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
    const { category, sort, keyword, page = 1 } = req.query   // Get category and page from query, page defaults to 1 if left empty
    const query = {}; // Start with empty query

    if (category) { // If there is a category then add that filter to the query
      query.category = category
    }
    
    if (keyword) {
      query.name = { $regex: keyword, $options: "i" }; // Case-insensitive search for the keyword in the name field
    }

    let sortOrder = {}; // Determine the sort order of price
    if (sort === "lowest") {
      sortOrder.price = 1; // Ascending order
    } else if (sort === "highest") {
      sortOrder.price = -1; // Descending order
    }

    const perPage = 9; // Items allowed per page to view

    const products = await Product.find(query)
    .skip(perPage * page - perPage) // Skips the number of items per page up to end of current page, then subtracts current page to display
    .limit(perPage)
    .sort(sortOrder), // Sort the products by the sort order
    totalItems = await Product.countDocuments(query) // method to count documents with mongoose to see how many products are in the collection with query filters applied
      res.json({
        products,
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(totalItems / perPage),
        totalItems: totalItems,
      });
  } catch (error) {
    next(error); // Pass errors to the global error handler
  }
});

router.get("/products/:product", async (req, res, next) => {
  try {
    const productId = req.params.product // Get product id from params
    
    const product = await Product.findById(productId) // mongoose method to find the id matching productId
    
    if (!product) { // handle if no matching id is found
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
    const productId = req.params.id; // Get product id from params
    const page = parseInt(req.query.page, 10) || 1; // Get page number from params
    const perPage = 4; // Allow 4 reviews per page

    const reviews = await Review.find({ productId })
      .skip(perPage * page - perPage) // Skip number of items per page * pages requested and subtract current page requested
      .limit(perPage);

    const totalReviews = await Review.countDocuments({ productId }); // Use mongoose method to count all documents in review collection to get total number of reviews

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
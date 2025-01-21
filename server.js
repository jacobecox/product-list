const express = require("express");
const cors = require("cors")
const mongoose = require("mongoose");


mongoose.connect("mongodb://localhost:27017/products");

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cors());

const getRoutes = require("./routes/getProducts");
app.use(getRoutes);

const postRoutes = require("./routes/postProducts");
app.use(postRoutes);

const deleteRoutes = require("./routes/deleteProducts");
app.use(deleteRoutes);

app.listen(8000, () => {
  console.log("Node.js listening on port " + 8000);
});
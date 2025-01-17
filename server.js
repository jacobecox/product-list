const express = require("express");
const mongoose = require("mongoose");


mongoose.connect("mongodb://localhost:27017/products");

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const mainRoutes = require("./routes/main");

app.use(mainRoutes);

app.listen(8000, () => {
  console.log("Node.js listening on port " + 8000);
});
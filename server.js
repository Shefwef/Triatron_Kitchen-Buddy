const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

// Load environment variables
dotenv.config();

// Import Routes
const ingredientRoutes = require("./routes/ingredientRoutes");
const recipeRoutes = require("./routes/recipeRoutes");

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // to parse JSON data from the request body

// Use routes for ingredients and recipes
app.use("/api", ingredientRoutes);
app.use("/api", recipeRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Internal Server Error" });
});

// File paths
const ingredientFilePath = path.join(__dirname, "ingredients.txt");
const recipeFilePath = path.join(__dirname, "recipes.txt");

// Helper function to read from a file
const readFromFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) reject(err);
      resolve(data ? JSON.parse(data) : []);
    });
  });
};

// Helper function to write to a file
const writeToFile = (filePath, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

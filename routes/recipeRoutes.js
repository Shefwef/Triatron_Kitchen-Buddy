const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");

// Routes for recipe management
router.post("/recipes", recipeController.addRecipe); // Add a recipe
router.get("/recipes", recipeController.getAllRecipes); // Get all recipes
router.post("/recipes/search", recipeController.searchRecipesByIngredients); // Search recipes by ingredients

module.exports = router;

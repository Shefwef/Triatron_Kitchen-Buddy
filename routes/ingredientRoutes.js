const express = require("express");
const router = express.Router();
const ingredientController = require("../controllers/ingredientController");

// Routes for ingredient management
router.post("/ingredients", ingredientController.addIngredient); // Add an ingredient
router.get("/ingredients", ingredientController.getAllIngredients); // Get all ingredients
router.put("/ingredients/:name", ingredientController.updateIngredient); // Update ingredient by name

module.exports = router;

const fs = require("fs");
const path = require("path");

// Update the file path to point to the 'data' folder
const recipeFilePath = path.join(__dirname, "../data", "recipes.txt");

// Helper function to read from the recipes file
const readRecipesFromFile = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(recipeFilePath, "utf-8", (err, data) => {
      if (err) reject(err);
      resolve(data ? JSON.parse(data) : []);
    });
  });
};

// Helper function to write to the recipes file
const writeRecipesToFile = (recipes) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(recipeFilePath, JSON.stringify(recipes, null, 2), (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

// Add a new recipe
const addRecipe = async (req, res) => {
  try {
    const { name, ingredients, instructions, category } = req.body;
    const recipes = await readRecipesFromFile();
    recipes.push({ name, ingredients, instructions, category });
    await writeRecipesToFile(recipes);
    res.status(201).json({ message: "Recipe added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding recipe", error });
  }
};

// Get all recipes
const getAllRecipes = async (req, res) => {
  try {
    const recipes = await readRecipesFromFile();
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipes", error });
  }
};

// Search recipes by available ingredients
const searchRecipesByIngredients = async (req, res) => {
  try {
    const { availableIngredients } = req.body;
    const recipes = await readRecipesFromFile();
    const filteredRecipes = recipes.filter((recipe) =>
      recipe.ingredients.some((ingredient) =>
        availableIngredients.includes(ingredient)
      )
    );
    res.status(200).json(filteredRecipes);
  } catch (error) {
    res.status(500).json({ message: "Error searching recipes", error });
  }
};

module.exports = {
  addRecipe,
  getAllRecipes,
  searchRecipesByIngredients,
};

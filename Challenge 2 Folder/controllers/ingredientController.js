const fs = require("fs");
const path = require("path");

// Update the file path to point to the 'data' folder
const ingredientFilePath = path.join(__dirname, "../data", "ingredients.txt");

// Helper function to read from the ingredients file
const readIngredientsFromFile = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(ingredientFilePath, "utf-8", (err, data) => {
      if (err) reject(err);
      resolve(data ? JSON.parse(data) : []);
    });
  });
};

// Helper function to write to the ingredients file
const writeIngredientsToFile = (ingredients) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      ingredientFilePath,
      JSON.stringify(ingredients, null, 2),
      (err) => {
        if (err) reject(err);
        resolve();
      }
    );
  });
};

// Add a new ingredient
const addIngredient = async (req, res) => {
  try {
    const { name, quantity, unit } = req.body;
    const ingredients = await readIngredientsFromFile();
    ingredients.push({ name, quantity, unit });
    await writeIngredientsToFile(ingredients);
    res.status(201).json({ message: "Ingredient added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding ingredient", error });
  }
};

// Get all ingredients
const getAllIngredients = async (req, res) => {
  try {
    const ingredients = await readIngredientsFromFile();
    res.status(200).json(ingredients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching ingredients", error });
  }
};

// Update ingredient by name
const updateIngredient = async (req, res) => {
  try {
    const { name } = req.params;
    const { quantity, unit } = req.body;
    const ingredients = await readIngredientsFromFile();
    const ingredientIndex = ingredients.findIndex(
      (ingredient) => ingredient.name === name
    );
    if (ingredientIndex === -1) {
      return res.status(404).json({ message: "Ingredient not found" });
    }
    ingredients[ingredientIndex] = { name, quantity, unit };
    await writeIngredientsToFile(ingredients);
    res.status(200).json({ message: "Ingredient updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating ingredient", error });
  }
};

module.exports = {
  addIngredient,
  getAllIngredients,
  updateIngredient,
};

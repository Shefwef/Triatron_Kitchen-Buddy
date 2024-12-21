const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const { Groq } = require("groq-sdk");

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
const groq = new Groq({
  apiKey: process.env.GROQ_API, // Use API key from environment variables
  dangerouslyAllowBrowser: true,
});

app.post("/api/chat", async (req, res) => {
  const { inputText } = req.body; // Accept user input
  if (!inputText || typeof inputText !== "string") {
    return res
      .status(400)
      .send({ message: "Input text is required and should be a string." });
  }

  let fullResponse = ""; // Store the full response
  let incomplete = false; // Flag to check if the response is cut off

  try {
    // Construct a dynamic prompt to handle ingredients
    const prompt = `I have the following ingredients: ${inputText}. Suggest a detailed recipe including ingredients, preparation steps, and cooking instructions. Please focus only on recipes.`;

    do {
      const chatCompletion = await groq.chat.completions.create({
        model: "llama3-groq-70b-8192-tool-use-preview", // Specify the Groq model
        temperature: 0.9,
        max_tokens: 1024, // Increase for longer responses
        messages: [
          {
            role: "system",
            content:
              "You are a professional chef and recipe expert. Your sole purpose is to generate detailed recipes based on the ingredients or preferences provided by the user. Do not discuss programming or unrelated topics.",
          },
          {
            role: "user",
            content: incomplete ? `Continue: ${fullResponse}` : prompt,
          },
        ],
      });

      const aiResponse = chatCompletion.choices[0]?.message?.content || "";
      fullResponse += aiResponse;
      incomplete = chatCompletion.choices[0]?.finish_reason === "length";
    } while (incomplete);

    // Ensure the `data` folder exists
    const directoryPath = path.join(__dirname, "data");
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    // Path to the recipes file
    const filePath = path.join(directoryPath, "my_fav_recipes.txt");

    // Read existing recipes from the file
    let recipesArray = [];
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, "utf-8");
      try {
        recipesArray = JSON.parse(fileContents); // Parse as JSON
      } catch (err) {
        console.error("Error parsing recipes file:", err);
      }
    }

    // Append the new recipe to the array
    recipesArray.push({
      input: inputText, // The user-provided input
      recipe: fullResponse, // The generated recipe
      timestamp: new Date().toISOString(), // Add a timestamp
    });

    // Save the updated array back to the file
    fs.writeFileSync(filePath, JSON.stringify(recipesArray, null, 2));

    res.send({ response: fullResponse });
  } catch (error) {
    console.error("Error fetching from Groq:", error);
    res.status(500).send({ message: "An error occurred while fetching data." });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

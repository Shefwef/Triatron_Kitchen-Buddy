# Challenge 01:

# Banglish-to-Bengali Transliteration

Iqbal's laptop has been hacked, and he can't use his Avro keyboard to type in Bengali anymore. He decides to build a model that converts Banglish (Bengali written in English letters) into proper Bengali script so he can continue his heated Facebook comment debate.

This project trains a sequence-to-sequence model to perform Banglish-to-Bengali transliteration using the dataset provided by Hugging Face.

## Dataset

The dataset used for this project is from the Hugging Face repository [SKNahin/bengali-transliteration-data](https://huggingface.co/datasets/SKNahin/bengali-transliteration-data). The dataset consists of Banglish sentences (Romanized Bengali) paired with their corresponding Bengali script translations.

## Tasks

### 1. Load the Dataset
We use Hugging Face's datasets library to load the Banglish-to-Bengali dataset.

### 2. Data Preprocessing
The dataset is tokenized and preprocessed for sequence-to-sequence tasks. We perform the following steps:
- Tokenize both Banglish (Romanized Bengali) and Bengali script text.
- Clean and filter the dataset if necessary.

### 3. Select a Model
We use the pre-trained mT5 (Multilingual T5) model, which is suitable for low-resource language tasks. We selected mT5-small due to its efficiency and suitability for our task.

### 4. Train the Model
We fine-tune the selected model on the Banglish-to-Bengali dataset. The training pipeline is set up using PyTorch and Hugging Face's Trainer class.

The model is trained for 3 epochs using an Adam optimizer with a learning rate of 5e-5 and a batch size of 8. 

### 5. Save and Upload the Model
After training, the model and tokenizer are saved locally and uploaded to Hugging Face for easy access and sharing.

## Requirements

To run the project, you need to install the following Python packages:

- datasets
- transformers
- torch
- huggingface_hub

bash
pip install datasets transformers torch huggingface_hub
How to Use the Model
You can load the fine-tuned model from Hugging Face and use it to transliterate Banglish text into Bengali. Here's an example of how to use the model:

python
Copy code
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

# Load the fine-tuned model and tokenizer
model = AutoModelForSeq2SeqLM.from_pretrained("namisa/banglish-to-bangla-model")
tokenizer = AutoTokenizer.from_pretrained("namisa/banglish-to-bangla-model")

# Transliterate Banglish text
def transliterate_banglish(text):
    inputs = tokenizer(text, return_tensors="pt", max_length=128, truncation=True, padding="max_length")
    outputs = model.generate(input_ids=inputs["input_ids"])
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

# Example usage
bash
```
banglish_text = "Ami ekhon boro hoyechi"
bengali_text = transliterate_banglish(banglish_text)
print(f"Transliterated Bengali: {bengali_text}")
Model Details
Model: mT5-small
Training Epochs: 3
Optimizer: AdamW
Learning Rate: 5e-5
Batch Size: 8
```

Results
The fine-tuned model achieved the following training and validation losses:
```bash
Epoch 1: Training Loss: 22.4071, Validation Loss: 7.8087
Epoch 2: Training Loss: 3.7735, Validation Loss: 1.0182
Epoch 3: Training Loss: 1.3876, Validation Loss: 0.4040
```

Model Repository
You can access the fine-tuned model on Hugging Face at the following link:
[banglish-to-bangla-model](https://huggingface.co/namisa/banglish-to-bangla-model)

# Challenge 02:

# Mofa's Kitchen Buddy

Mofa's Kitchen Buddy is a backend system powered by a Large Language Model (LLM) that helps users manage their ingredients and suggests recipes based on what they have at home. The system allows users to input available ingredients, update them when shopping, and receive recipe recommendations tailored to their preferences, such as craving something sweet or a specific type of dish.

## Features

- **Ingredient Management**: Input and update available ingredients in your kitchen.
- **Recipe Management**: Store and retrieve favorite recipes, including details like ingredients, instructions, and category.
- **Recipe Suggestion**: Search for recipes based on the ingredients you have at home.
- **Chatbot Integration**: Interact with a chatbot to suggest recipes based on your preferences.

## Technology Stack

- **Node.js**: JavaScript runtime for building the backend server.
- **Express.js**: Web framework for building APIs.
- **File System (fs)**: Used for reading and writing ingredients and recipes data from text files.
- **JSON**: For storing ingredients and recipes in a structured format.
- **Large Language Model (LLM)**: Integrated to interact with users and suggest recipes.

## API Endpoints

### Ingredient Management

- **POST /ingredients**: Add a new ingredient.
- **GET /getingredients**: Get all available ingredients.
- **PUT /ingredients/:name**: Update an ingredient by its name.
 ```bash
{
    "name": " ",
    "quantity": " ",
    "unit": " "
  },
```


### Recipe Management

- **POST /recipes**: Add a new recipe.
- **GET /getrecipes**: Get all stored recipes.
- **POST /recipes/search**: Search for recipes based on available ingredients.

```bash
  {
    "input": " ",
    "recipe": " ",
    "timestamp": " "
  }
```

## Database Design

The data is stored in JSON format within the `data` folder:

- **ingredients.txt**: Stores the list of ingredients with details like name, quantity, and unit.
- **recipes.txt**: Stores favorite recipes with details like name, ingredients, instructions, and category.

## Setup Instructions

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/your-username/mofas-kitchen-buddy.git
   ```
2. Add dotenv file
   ```bash
   PORT=5000
   GROQ_API = " "
   ```

3. Install dependencies
   ```bash
   npm install
   ```
4. Run the server
  ```bash
  node server.js
  ```


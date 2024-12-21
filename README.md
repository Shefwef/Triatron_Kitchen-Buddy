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
banglish_text = "Ami ekhon boro hoyechi"
bengali_text = transliterate_banglish(banglish_text)
print(f"Transliterated Bengali: {bengali_text}")
Model Details
Model: mT5-small
Training Epochs: 3
Optimizer: AdamW
Learning Rate: 5e-5
Batch Size: 8
Results
The fine-tuned model achieved the following training and validation losses:

Epoch 1: Training Loss: 22.4071, Validation Loss: 7.8087
Epoch 2: Training Loss: 3.7735, Validation Loss: 1.0182
Epoch 3: Training Loss: 1.3876, Validation Loss: 0.4040
Model Repository
You can access the fine-tuned model on Hugging Face at the following link:
Banglish-to-Bengali Model

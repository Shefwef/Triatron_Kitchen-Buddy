# Banglish-to-Bengali Transliteration

Iqbal's laptop has been hacked, and he can't use his Avro keyboard to type in Bengali anymore. He decides to build a model that converts Banglish (Bengali written in English letters) into proper Bengali script so he can continue his heated Facebook comment debate.

This project trains a sequence-to-sequence model to perform Banglish-to-Bengali transliteration using the dataset provided by Hugging Face.

---

## Dataset

The dataset used for this project is from the Hugging Face repository [SKNahin/bengali-transliteration-data](https://huggingface.co/datasets/SKNahin/bengali-transliteration-data). The dataset consists of Banglish sentences (Romanized Bengali) paired with their corresponding Bengali script translations.

---

## Tasks

### 1. Load the Dataset

We use Hugging Face's `datasets` library to load the Banglish-to-Bengali dataset:

```bash
pip install datasets
```

```python
from datasets import load_dataset

dataset = load_dataset("SKNahin/bengali-transliteration-data")
train_data = dataset['train']
validation_data = dataset['validation']
```

---

### 2. Data Preprocessing

The dataset is tokenized and preprocessed for sequence-to-sequence tasks. We perform the following steps:

#### Install necessary libraries:
```bash
pip install transformers torch
```

#### Tokenization and Preprocessing
```python
from transformers import AutoTokenizer

# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained("google/mt5-small")

# Tokenize the dataset
def tokenize_function(example):
    return tokenizer(example["banglish"], text_target=example["bengali"], truncation=True)

tokenized_dataset = dataset.map(tokenize_function, batched=True)
```

---

### 3. Select a Model

We use the pre-trained `mT5-small` (Multilingual T5) model, which is suitable for low-resource language tasks. Install it with:
```bash
pip install transformers
```

#### Load the pre-trained model:
```python
from transformers import AutoModelForSeq2SeqLM

model = AutoModelForSeq2SeqLM.from_pretrained("google/mt5-small")
```

---

### 4. Train the Model

The model is fine-tuned on the Banglish-to-Bengali dataset using PyTorch and Hugging Face's Trainer class.

#### Install the required trainer library:
```bash
pip install datasets transformers
```

#### Fine-tuning Pipeline:
```python
from transformers import Seq2SeqTrainer, Seq2SeqTrainingArguments

# Define training arguments
training_args = Seq2SeqTrainingArguments(
    output_dir="./results",
    evaluation_strategy="epoch",
    learning_rate=5e-5,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=3,
    weight_decay=0.01,
    save_total_limit=3,
    predict_with_generate=True,
    logging_dir="./logs",
    logging_steps=10,
)

# Define Trainer
trainer = Seq2SeqTrainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset['train'],
    eval_dataset=tokenized_dataset['validation'],
    tokenizer=tokenizer,
)

# Train the model
trainer.train()
```

---

### 5. Save and Upload the Model

After training, save the fine-tuned model and tokenizer locally:
```python
model.save_pretrained("banglish-to-bengali-model")
tokenizer.save_pretrained("banglish-to-bengali-model")
```

#### Upload to Hugging Face:
First, install the Hugging Face CLI:
```bash
pip install huggingface_hub
huggingface-cli login
```

Then, upload the model:
```bash
from huggingface_hub import HfApi

api = HfApi()
api.upload_folder(folder_path="banglish-to-bengali-model", repo_id="<your-username>/banglish-to-bangla-model")
```

---

## How to Use the Model

You can load the fine-tuned model from Hugging Face and use it to transliterate Banglish text into Bengali.

#### Example Usage:
```python
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

# Load the fine-tuned model and tokenizer
model = AutoModelForSeq2SeqLM.from_pretrained("<your-username>/banglish-to-bangla-model")
tokenizer = AutoTokenizer.from_pretrained("<your-username>/banglish-to-bangla-model")

# Transliterate Banglish text
def transliterate_banglish(text):
    inputs = tokenizer(text, return_tensors="pt", max_length=128, truncation=True, padding="max_length")
    outputs = model.generate(input_ids=inputs["input_ids"])
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

# Example usage
banglish_text = "Ami ekhon boro hoyechi"
bengali_text = transliterate_banglish(banglish_text)
print(f"Transliterated Bengali: {bengali_text}")
```

---

## Model Details

- **Model**: mT5-small
- **Training Epochs**: 3
- **Optimizer**: AdamW
- **Learning Rate**: 5e-5
- **Batch Size**: 8

---

## Results

The fine-tuned model achieved the following training and validation losses:

| Epoch | Training Loss | Validation Loss |
|-------|---------------|-----------------|
| 1     | 22.4071       | 7.8087          |
| 2     | 3.7735        | 1.0182          |
| 3     | 1.3876        | 0.4040          |

---

## Model Repository

You can access the fine-tuned model on Hugging Face at the following link:

[Banglish-to-Bengali Model](https://huggingface.co/)<your-username>/banglish-to-bangla-model

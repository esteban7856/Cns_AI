from fastapi import FastAPI
from pydantic import BaseModel
import torch
from transformers import AutoTokenizer
from model import BioBERT_LSTM

app = FastAPI()

# Cargar modelo
model = BioBERT_LSTM(num_classes=4)  # 4 clases
model.load_state_dict(torch.load("saved_model/final_model.pt", map_location=torch.device('cpu')))
model.eval()

tokenizer = AutoTokenizer.from_pretrained("dmis-lab/biobert-base-cased-v1.1")
labels = ["Asma", "Tuberculosis", "Bronquitis", "Otro / No enfermedad"]

# Palabras clave para filtrar texto irrelevante
sintomas_keywords = [
    "sibilancias", "dificultad para respirar", "tos", "opresión", 
    "fiebre", "pérdida de peso", "fatiga", "flema", "dolor de pecho"
]

class InputText(BaseModel):
    texto: str

@app.post("/predict")
def predict(data: InputText):
    # Pre-filtrado rápido
    if not any(keyword in data.texto.lower() for keyword in sintomas_keywords):
        return {"diagnostico": "Otro / No enfermedad", "confianza": 1.0}

    # Tokenización y predicción
    inputs = tokenizer(data.texto, return_tensors="pt", truncation=True, padding=True, max_length=64)
    with torch.no_grad():
        outputs = model(inputs["input_ids"], inputs["attention_mask"])

    # Softmax para probabilidades
    probs = torch.softmax(outputs, dim=1)[0].tolist()
    pred = torch.argmax(outputs, dim=1).item()
    
    return {"diagnostico": labels[pred], "confianza": round(probs[pred], 2)}

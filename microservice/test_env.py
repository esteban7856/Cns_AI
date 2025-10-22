import torch
from transformers import AutoTokenizer, AutoModel

print("PyTorch versión:", torch.__version__)

# Verificar si CUDA está disponible
print("CUDA disponible:", torch.cuda.is_available())

# Probar que BioBERT carga
print("⏳ Cargando BioBERT...")
tokenizer = AutoTokenizer.from_pretrained("dmis-lab/biobert-base-cased-v1.1")
model = AutoModel.from_pretrained("dmis-lab/biobert-base-cased-v1.1")

# Texto de prueba
texto = "Paciente con tos persistente y dificultad para respirar"
inputs = tokenizer(texto, return_tensors="pt")

# Generar embeddings
with torch.no_grad():
    outputs = model(**inputs)

print("BioBERT embeddings shape:", outputs.last_hidden_state.shape)

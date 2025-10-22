import torch
from torch.utils.data import DataLoader, Dataset
from transformers import AutoTokenizer
import torch.nn as nn
import torch.optim as optim
import matplotlib.pyplot as plt
from model import BioBERT_LSTM
import numpy as np
import random

# Dataset personalizado
class SimpleDataset(Dataset):
    def __init__(self, tokenizer, texts, labels, max_len=64):
        self.encodings = tokenizer(texts, truncation=True, padding=True, max_length=max_len)
        self.labels = labels

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, idx):
        item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
        item['labels'] = torch.tensor(self.labels[idx])
        return item

# Función para generar textos sintéticos de síntomas
def generar_textos(sintomas, n_samples=200):
    texts = []
    for _ in range(n_samples):
        num_sintomas = random.randint(2, 4)
        frase = "Paciente con " + ", ".join(random.sample(sintomas, num_sintomas))
        texts.append(frase)
    return texts

def train():
    tokenizer = AutoTokenizer.from_pretrained("dmis-lab/biobert-base-cased-v1.1")

    # Síntomas base por enfermedad
    asma_sintomas = ["sibilancias", "dificultad para respirar", "tos seca",
                     "opresión en el pecho", "silbido al respirar", "respiración rápida"]
    tuberculosis_sintomas = ["tos con sangre", "fiebre prolongada", "pérdida de peso",
                             "sudores nocturnos", "fatiga extrema", "dolor en el pecho"]
    bronquitis_sintomas = ["tos con flema", "fiebre leve", "dolor de garganta",
                           "congestión nasal", "sensación de opresión", "fatiga"]

    # Generar textos sintéticos
    texts_asma = generar_textos(asma_sintomas, 200)
    texts_tbc = generar_textos(tuberculosis_sintomas, 200)
    texts_bronq = generar_textos(bronquitis_sintomas, 200)

    # Textos irrelevantes para clase "Otro"
    texts_otro = ["hola como estas", "buen dia", "quiero jugar", "random text", "qué tal"] * 40

    # Combinar todos los textos
    texts = texts_asma + texts_tbc + texts_bronq + texts_otro
    labels = [0]*200 + [1]*200 + [2]*200 + [3]*200  # 0:Asma, 1:TBC, 2:Bronquitis, 3:Otro

    # Crear dataset y dataloader
    dataset = SimpleDataset(tokenizer, texts, labels)
    dataloader = DataLoader(dataset, batch_size=8, shuffle=True)

    # Modelo, loss y optimizer
    model = BioBERT_LSTM(num_classes=4)  # ahora 4 clases
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=2e-5, weight_decay=1e-5)

    num_epochs = 5
    losses = []
    best_accuracy = 0

    for epoch in range(num_epochs):
        model.train()
        total_loss = 0

        for batch in dataloader:
            input_ids = batch['input_ids']
            attention_mask = batch['attention_mask']
            labels_batch = batch['labels']

            outputs = model(input_ids, attention_mask)
            loss = criterion(outputs, labels_batch)

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            total_loss += loss.item()

        avg_loss = total_loss / len(dataloader)
        losses.append(avg_loss)

        # Validación rápida
        model.eval()
        with torch.no_grad():
            val_texts = texts[::20]
            val_labels = np.array(labels[::20])

            val_inputs = tokenizer(val_texts, return_tensors="pt", padding=True, truncation=True, max_length=64)
            outputs = model(val_inputs["input_ids"], val_inputs["attention_mask"])
            preds = torch.argmax(outputs, dim=1).numpy()

            accuracy = (preds == val_labels).mean()

        print(f"Epoch {epoch+1}/{num_epochs} - Loss: {avg_loss:.4f} - Accuracy: {accuracy:.4f}")

        # Guardar mejor modelo
        if accuracy > best_accuracy:
            best_accuracy = accuracy
            torch.save(model.state_dict(), "saved_model/best_model.pt")
            print("¡Modelo guardado como mejor modelo!")

    # Guardar modelo final
    torch.save(model.state_dict(), "saved_model/final_model.pt")
    print("Entrenamiento completado. Modelo guardado en saved_model/final_model.pt")

    # Gráfica de pérdida
    plt.plot(losses, marker='o')
    plt.title("Pérdida durante el entrenamiento")
    plt.xlabel("Época")
    plt.ylabel("Loss")
    plt.savefig("training_loss.png")
    print("Gráfica de pérdida guardada en training_loss.png")


if __name__ == "__main__":
    train()

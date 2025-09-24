import torch
import torch.nn as nn
from transformers import AutoModel

class BioBERT_LSTM(nn.Module):
    def __init__(self, hidden_dim=128, num_classes=4):
        super(BioBERT_LSTM, self).__init__()
        self.bert = AutoModel.from_pretrained("dmis-lab/biobert-base-cased-v1.1")
        self.lstm = nn.LSTM(input_size=768, hidden_size=hidden_dim, batch_first=True)
        self.fc = nn.Linear(hidden_dim, num_classes)
        self.softmax = nn.Softmax(dim=1)

    def forward(self, input_ids, attention_mask):
        with torch.no_grad(): 
            outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        lstm_out, _ = self.lstm(outputs.last_hidden_state)
        last_hidden = lstm_out[:, -1, :]
        logits = self.fc(last_hidden)
        return self.softmax(logits)

# Grupo 36 - API de Clima e Cidades

API REST desenvolvida para a disciplina de Técnicas de Integração de Sistemas (N703).

A aplicação integra APIs públicas para fornecer dados geográficos e climáticos de cidades brasileiras.

---

## 🚀 Tecnologias utilizadas

- Node.js
- Express
- Axios
- Jest (testes)
- Supertest

---

## 🌐 APIs utilizadas

- **Open-Meteo (Geocoding API)**  
  Utilizada para buscar a cidade pelo nome e obter latitude e longitude.

- **Open-Meteo (Weather API)**  
  Utilizada para obter os dados climáticos com base nas coordenadas.

- **IBGE (Localidades do Brasil)**  
  Utilizada para listar cidades por estado.

---


## ▶️ Como executar o projeto
```md
### 1. Clonar o repositório

```bash
git clone https://github.com/otvprint-unifor/Grupo36-api-clima-cidades.git
cd Grupo36-api-clima-cidades

2. Instalar dependências

npm install

3. Rodar a API
npm run dev

A API estará disponível em:
http://localhost:3000

---

📡 Endpoints

🔹 Health Check
GET /api/v1/health

🔹 Clima por cidade
GET /api/v1/clima/{nome_cidade}
Exemplo: /api/v1/clima/Fortaleza

🔹 Cidades por estado
GET /api/v1/cidades/{sigla_uf}?limite=5
Exemplo: /api/v1/cidades/CE?limite=5

⚠️ Tratamento de erros
400 → entrada inválida
404 → cidade ou estado não encontrado
503 → erro em serviço externo

🧪 Testes
Para rodar os testes automatizados:
npm test

Testes implementados:
Health Check
Cidade válida
Cidade inexistente

🧪 Como testar a API
Via navegador
Abra os links abaixo:

http://localhost:3000/api/v1/health
http://localhost:3000/api/v1/clima/Fortaleza
http://localhost:3000/api/v1/cidades/CE?limite=5

Via Postman
Abra o Postman
Clique em "Import"
Selecione o arquivo: docs/postman_collection.json

-------

📁 Estrutura do projeto
/
├── README.md
├── INTEGRANTES.md
├── src/
│   └── server.js
├── tests/
│   └── api.test.js
└── docs/
    └── postman_collection.json

📬 Coleção Postman

Arquivo disponível em: docs/postman_collection.json
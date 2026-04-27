const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Endpoint 3: Health Check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    versao: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

// Endpoint 1: Informações da Cidade com Clima
app.get("/api/v1/clima/:nome_cidade", async (req, res) => {
  const nomeCidade = req.params.nome_cidade;

  if (!nomeCidade || nomeCidade.trim().length < 2) {
    return res.status(400).json({
      erro: true,
      codigo: "NOME_INVALIDO",
      mensagem: "O nome da cidade deve conter pelo menos 2 caracteres",
      nome_informado: nomeCidade
    });
  }

  try {
    // Busca a cidade pelo nome e pega latitude/longitude dinamicamente
    const geoResponse = await axios.get("https://geocoding-api.open-meteo.com/v1/search", {
      params: {
        name: nomeCidade,
        count: 1,
        language: "pt",
        format: "json",
        countryCode: "BR"
      }
    });

    if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
      return res.status(404).json({
        erro: true,
        codigo: "CIDADE_NAO_ENCONTRADA",
        mensagem: "Nenhuma cidade encontrada com o nome informado",
        nome_informado: nomeCidade
      });
    }

    const cidade = geoResponse.data.results[0];

    // Consulta o clima usando as coordenadas encontradas
    const climaResponse = await axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude: cidade.latitude,
        longitude: cidade.longitude,
        daily: "temperature_2m_max,temperature_2m_min",
        current_weather: true,
        timezone: "America/Fortaleza"
      }
    });

    const clima = climaResponse.data;

    return res.status(200).json({
      nome: cidade.name,
      estado: cidade.admin1 || "",
      clima: {
        temperatura_min: clima.daily.temperature_2m_min[0],
        temperatura_max: clima.daily.temperature_2m_max[0],
        condicao: "Dados obtidos pela Open-Meteo",
        unidades: {
          temperatura: "°C"
        }
      },
      consultado_em: new Date().toISOString()
    });

  } catch (error) {
    return res.status(503).json({
      erro: true,
      codigo: "SERVICO_EXTERNO_INDISPONIVEL",
      mensagem: "Não foi possível obter dados do serviço externo. Tente novamente em alguns instantes",
      servico: "Open-Meteo"
    });
  }
});

// Endpoint 2: Listagem de Cidades por Estado
app.get("/api/v1/cidades/:sigla_uf", async (req, res) => {
  const siglaUf = req.params.sigla_uf;
  const limite = parseInt(req.query.limite) || 10;

  if (!siglaUf || siglaUf.trim().length !== 2) {
    return res.status(400).json({
      erro: true,
      codigo: "SIGLA_UF_INVALIDA",
      mensagem: "A sigla do estado deve conter exatamente 2 letras",
      sigla_uf_informada: siglaUf
    });
  }

  if (limite < 1 || limite > 100) {
    return res.status(400).json({
      erro: true,
      codigo: "LIMITE_INVALIDO",
      mensagem: "O limite deve ser um número entre 1 e 100",
      limite_informado: req.query.limite
    });
  }

  try {
    const response = await axios.get(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${siglaUf.toUpperCase()}/municipios`
    );

    if (!response.data || response.data.length === 0) {
      return res.status(404).json({
        erro: true,
        codigo: "UF_NAO_ENCONTRADA",
        mensagem: "Estado com a sigla informada não foi encontrado",
        sigla_uf_informada: siglaUf
      });
    }

    const cidades = response.data.slice(0, limite).map((cidade) => ({
      nome: cidade.nome
    }));

    return res.status(200).json({
      uf: siglaUf.toUpperCase(),
      quantidade_retornada: cidades.length,
      cidades,
      consultado_em: new Date().toISOString()
    });

  } catch (error) {
    return res.status(404).json({
      erro: true,
      codigo: "UF_NAO_ENCONTRADA",
      mensagem: "Estado com a sigla informada não foi encontrado",
      sigla_uf_informada: siglaUf
    });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;
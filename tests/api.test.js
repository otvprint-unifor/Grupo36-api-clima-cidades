const request = require("supertest");
const app = require("../src/server");

describe("Testes da API Grupo 36", () => {
  test("Deve retornar health check com status healthy", async () => {
    const resposta = await request(app).get("/api/v1/health");

    expect(resposta.statusCode).toBe(200);
    expect(resposta.body.status).toBe("healthy");
    expect(resposta.body.versao).toBe("1.0.0");
  });

  test("Deve retornar dados climáticos para uma cidade válida", async () => {
    const resposta = await request(app).get("/api/v1/clima/Fortaleza");

    expect(resposta.statusCode).toBe(200);
    expect(resposta.body).toHaveProperty("nome");
    expect(resposta.body).toHaveProperty("estado");
    expect(resposta.body).toHaveProperty("clima");
    expect(resposta.body.clima).toHaveProperty("temperatura_min");
    expect(resposta.body.clima).toHaveProperty("temperatura_max");
  });

  test("Deve retornar erro 404 para cidade não encontrada", async () => {
    const resposta = await request(app).get("/api/v1/clima/CidadeInexistenteTesteXYZ");

    expect(resposta.statusCode).toBe(404);
    expect(resposta.body.erro).toBe(true);
    expect(resposta.body.codigo).toBe("CIDADE_NAO_ENCONTRADA");
  });
});
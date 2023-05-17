const { spec } = require('pactum');
const configuracoes = require('../../configuracoes');
const usuario = require('../../funcoes/usuario');
const plano = require('../../funcoes/plano');
const crypto = require('crypto');

it('CU-A 19 - deve cadastrar Plano', async () => {
    const token = await usuario.gerarToken('admin@fitapp.com', 'admin123');
    const nomePlano = `gratuito_${crypto.randomUUID()}`;

    await spec()
        .post(`${configuracoes.urlDaApi}/admin/planos`)
        .withHeaders("Authorization", "Bearer " + token)
        .withJson({
            "nome": nomePlano,
            "valor": 0,
            "duracao": 15,
            "descricao": "Experimente gratis por 15 dias",
            "dataLancamento": "2023-01-01 00:00:00"
        })
        .expectStatus(200);

    await spec()
        .get(`${configuracoes.urlDaApi}/admin/planos`)
        .withHeaders("Authorization", "Bearer " + token)
        .expectJsonLike([
            {
                nome: nomePlano
            }
        ])
        .expectStatus(200);
});

it('CU-A 19 - Não deve cadastrar Plano com  mesmo nome', async () => {
    const token = await usuario.gerarToken('admin@fitapp.com', 'admin123');
    const nomePlano = `gratuito_${crypto.randomUUID()}`;
    const idPlano = await plano.cadastrarPlano(token, nomePlano, 0, 15, "Experimente gratis por 15 dias", "2023-01-01 00:00:00");

    await spec()
        .post(`${configuracoes.urlDaApi}/admin/planos`)
        .withHeaders("Authorization", "Bearer " + token)
        .withJson({
            "nome": nomePlano,
            "valor": 0,
            "duracao": 15,
            "descricao": "Experimente gratis por 15 dias",
            "dataLancamento": "2023-01-01 00:00:00"
        })
        .expectJson({ erro: "Esse plano já foi cadastrado" })
        .expectStatus(400);
})
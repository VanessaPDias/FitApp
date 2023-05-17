const { spec } = require('pactum');
const configuracoes = require('../../configuracoes');
const usuario = require('../../funcoes/usuario');
const nutricionista = require('../../funcoes/nutricionista');
const crypto = require('crypto');

it('CU-A 09 - deve cadastrar Nutricionista', async () => {
    const token = await usuario.gerarToken('admin@fitapp.com', 'admin123');

    await spec()
        .post(`${configuracoes.urlDaApi}/nutricionistas`)
        .withHeaders("Authorization", "Bearer " + token)
        .withJson({
            "nome": "Ana",
            "email": `ana_${crypto.randomUUID()}@fitapp.com`,
            "telefone": "55 5555555",
            "registroProfissional": "CRN 123"
        })
        .expectStatus(200);
})

it('CU-A 09 - não deve cadastrar Nutricionista se o email já foi cadastrado', async () => {
    const token = await usuario.gerarToken('admin@fitapp.com', 'admin123');
    const email = `ana_${crypto.randomUUID()}@fitapp.com`;
    const idNutri = await nutricionista.cadastrarNutri(token, 'Ana', email, '777777777', 'CRN 555');

    await spec()
        .post(`${configuracoes.urlDaApi}/nutricionistas`)
        .withHeaders("Authorization", "Bearer " + token)
        .withJson({
            "nome": "Ana",
            "email": email,
            "telefone": "55 5555555",
            "registroProfissional": "CRN 123"
        })
        .expectJson({ erro: "Esse e-mail já foi cadastrado" })
        .expectStatus(400);
})
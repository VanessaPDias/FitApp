const { spec } = require('pactum');
const configuracoes = require('../../configuracoes');
const usuario = require('../../funcoes/usuario');
const personal = require('../../funcoes/personalTrainer');
const crypto = require('crypto');

it('CU-A 14 - deve cadastrar Personal', async () => {
    const token = await usuario.gerarToken('admin@fitapp.com', 'admin123');
    
    await spec()
        .post(`${configuracoes.urlDaApi}/personalTrainers`)
        .withHeaders("Authorization", "Bearer " + token)
        .withJson({
            "nome": "Bruno",
            "email": `bruno_${crypto.randomUUID()}@fitapp.com`,
            "senha": "123456",
            "telefone": "55 555 55 55",
            "registroProfissional": "CRN 123"
        })
        .expectStatus(200);
})

it('CU-A 14 - não deve cadastrar Personal se o email já foi cadastrado', async () => {
    const token = await usuario.gerarToken('admin@fitapp.com', 'admin123');
    const email = `bruno_${crypto.randomUUID()}@fitapp.com`;
    const idPersonal = await personal.cadastrarPersonal(token, 'Bruno', email, '777777777', 'CRN 555');

    await spec()
        .post(`${configuracoes.urlDaApi}/personalTrainers`)
        .withHeaders("Authorization", "Bearer " + token)
        .withJson({
            "nome": "Bruno",
            "email": email,
            "telefone": "55 5555555",
            "registroProfissional": "CRN 123"
        })
        .expectJson({ erro: "Esse e-mail já foi cadastrado" })
        .expectStatus(400);
})
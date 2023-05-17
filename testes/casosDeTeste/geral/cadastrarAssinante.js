const { spec } = require('pactum');
const configuracoes = require('../../configuracoes');
const crypto = require('crypto');
const nutricionista = require('../../funcoes/nutricionista');
const personal = require('../../funcoes/personalTrainer');
const usuario = require('../../funcoes/usuario');
const plano = require('../../funcoes/plano');
const assinante = require('../../funcoes/assinante');

it('CU-G 06 - deve cadastrar Assinante', async () => {
    const token = await usuario.gerarToken('admin@fitapp.com', 'admin123');

    const idPlano = await plano.cadastrarPlano(token, `Gratuito_${crypto.randomUUID()}`, 0, 15, "Experimente gratis por 15 dias", '2023-01-01 00:00:00');

    const idNutri = await nutricionista.cadastrarNutri(token, "ana", `ana_${crypto.randomUUID()}@fitapp.com`, "99999999", "CRN 123");

    const idPersonal = await personal.cadastrarPersonal(token, "Bruno", `bruno_${crypto.randomUUID()}@fitapp.com`, "55 555 55 55", "CRN 123");
    

    await spec()
        .post(`${configuracoes.urlDaApi}/assinantes`)
        .withJson({
            "nome": "Guilherme",
            "email": `Guilherme_${crypto.randomUUID()}@fitapp.com`,
            "idPlano": idPlano,
            "idNutri": idNutri,
            "idPersonal": idPersonal
        })
        .expectStatus(200);
});

it('CU-G 06 - Não deve cadastrar Assinante com mesmo e-mail', async () => {
    const token = await usuario.gerarToken('admin@fitapp.com', 'admin123');

    const idPlano = await plano.cadastrarPlano(token, `Gratuito_${crypto.randomUUID()}`, 0, 15, "Experimente gratis por 15 dias", '2023-01-01 00:00:00');

    const idNutri = await nutricionista.cadastrarNutri(token, "ana", `ana_${crypto.randomUUID()}@fitapp.com`, "99999999", "CRN 123");

    const idPersonal = await personal.cadastrarPersonal(token, "Bruno", `bruno_${crypto.randomUUID()}@fitapp.com`, "55 555 55 55", "CRN 123");

    const email =  `Guilherme_${crypto.randomUUID()}@fitapp.com`
    const idAssinante = await assinante.cadastrarAssinante("Guilherme", email, idPlano, idNutri, idPersonal);
    
    await spec()
        .post(`${configuracoes.urlDaApi}/assinantes`)
        .withJson({
            "nome": "Guilherme",
            "email": email,
            "idPlano": idPlano,
            "idNutri": idNutri,
            "idPersonal": idPersonal
        })
        .expectJson({ erro: "Esse e-mail já foi cadastrado" })
        .expectStatus(400);
});
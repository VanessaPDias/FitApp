const { spec } = require('pactum');
const configuracoes = require('../../configuracoes');
const crypto = require('crypto');
const nutricionista = require('../../funcoes/nutricionista');
const personal = require('../../funcoes/personalTrainer');
const usuario = require('../../funcoes/usuario');
const plano = require('../../funcoes/plano');
const assinante = require('../../funcoes/assinante');

it('CU-A 01 - deve listar assinantes', async () => {
    const token = await usuario.gerarToken('admin@fitapp.com', 'admin123');

    const idPlano = await plano.cadastrarPlano(token, `Gratuito_${crypto.randomUUID()}`, 0, 15, "Experimente gratis por 15 dias", "2023-01-01 00:00:00");

    const idNutri = await nutricionista.cadastrarNutri(token, "ana", `ana_${crypto.randomUUID()}@fitapp.com`, "99999999", "BFUDbHJKd");

    const idPersonal = await personal.cadastrarPersonal(token, "Bruno", `bruno_${crypto.randomUUID()}@fitapp.com`, "55 555 55 55", "CRN 123");

    const idAssinante = await assinante.cadastrarAssinante("Guilherme", `Guilherme_${crypto.randomUUID()}@fitapp.com`, idPlano, idNutri, idPersonal);

    await spec()
        .get(`${configuracoes.urlDaApi}/admin/assinantes`)
        .withHeaders("Authorization", "Bearer " + token)
        .expectJsonLike([
            {
                idAssinante: idAssinante,
            }
        ])
        .expectStatus(200);

    
});

it('CU-A 01 - deve listar assinantes por filtro', async () => {
    const token = await usuario.gerarToken('admin@fitapp.com', 'admin123');
    
    await spec()
        .get(`${configuracoes.urlDaApi}/admin/assinantes?nome=assinante_teste`)
        .withHeaders("Authorization", "Bearer " + token)
        .expectJsonLike([
            {
                "idAssinante": "idAssinante_teste",
                "nome": "assinante_teste"
            }
        ])
        .expectStatus(200);
});
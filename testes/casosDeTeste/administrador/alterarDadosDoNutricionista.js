const { spec } = require('pactum');
const configuracoes = require('../../configuracoes');
const usuario = require('../../funcoes/usuario');
const nutricionista = require('../../funcoes/nutricionista');
const crypto = require('crypto');

it('CU-A 08 - deve alterar os dados do Nutricionista', async () => {
    const token = await usuario.gerarToken('admin@fitapp.com', 'admin123');

    const nome = `nutri_teste_${crypto.randomUUID()}`
    const email = `nutri_teste_${crypto.randomUUID()}@fitapp.com`
    const idNutri = await nutricionista.cadastrarNutri(token, nome, email, "99999999", "crm123");

    await spec()
        .get(`${configuracoes.urlDaApi}/admin/nutricionistas/${idNutri}`)
        .withHeaders("Authorization", "Bearer " + token)
        .expectJsonLike(
            {
                "idNutri": idNutri,
            }
        )
        .expectStatus(200);

    await nutricionista.alterarDadosDoNutricionista(token, idNutri, "Ana", email, "000000000", "CRN 123", false, 1);

    await spec()
        .get(`${configuracoes.urlDaApi}/admin/nutricionistas/${idNutri}`)
        .withHeaders("Authorization", "Bearer " + token)
        .expectJsonLike(
            {
                idNutri: idNutri,
                bloqueado: false
            }
        )
        .expectStatus(200);
})

it('CU-A 08 - não deve alterar os dados quando não encontrar o Nutricionista', async () => {
    const token = await usuario.gerarToken('admin@fitapp.com', 'admin123');

    const idNutri = await nutricionista.cadastrarNutri(token, "ana", `ana_${crypto.randomUUID()}@fitapp.com`, "99999999", "BFUDbHJKd");

    await spec()
        .patch(`${configuracoes.urlDaApi}/admin/nutricionistas/${crypto.randomUUID()}`)
        .withHeaders("Authorization", "Bearer " + token)
        .withJson({
            "nome": "Ana",
            "email": `ana55@fitapp.com`,
            "telefone": "55 5555555",
            "registroProfissional": "CRN 123",
            "bloqueado": true
        })
        .expectJson({ erro: "Nutricionista não encontrado" })
        .expectStatus(404);
})
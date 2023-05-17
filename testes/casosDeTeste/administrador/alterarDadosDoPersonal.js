const { spec } = require('pactum');
const configuracoes = require('../../configuracoes');
const usuario = require('../../funcoes/usuario');
const personal = require('../../funcoes/personalTrainer');
const crypto = require('crypto');

it('CU-A 13 - deve alterar dados do Personal', async () => {
    const token = await usuario.gerarToken('admin@fitapp.com', 'admin123');

    const email = `personal_teste_${crypto.randomUUID()}@fitapp.com`
    const idPersonal = await personal.cadastrarPersonal(token, `Brunopersonal_teste_${crypto.randomUUID()}`, email, "55 555 55 55", "CRN 123");

    await spec()
        .get(`${configuracoes.urlDaApi}/admin/personalTrainers/${idPersonal}`)
        .withHeaders("Authorization", "Bearer " + token)
        .expectJsonLike(
            {
                idPersonal: idPersonal,
            }
        )
        .expectStatus(200);

    await personal.alterarDadosDoPersonal(token, idPersonal, "João", email, "000000000", "CRN 123", false, 1);


    await spec()
        .get(`${configuracoes.urlDaApi}/admin/personalTrainers/${idPersonal}`)
        .withHeaders("Authorization", "Bearer " + token)
        .expectJsonLike(
            {
                idPersonal: idPersonal,
                bloqueado: false
            }
        )
        .expectStatus(200);
});

it('CU-A 13 - Não altera os dados do Personal se o Id não existe', async () => {
    const token = await usuario.gerarToken('admin@fitapp.com', 'admin123');

    const idPersonal = await personal.cadastrarPersonal(token, "Bruno", `bruno_${crypto.randomUUID()}@fitapp.com`, "55 555 55 55", "CRN 123");

    await spec()
        .patch(`${configuracoes.urlDaApi}/admin/personalTrainers/${crypto.randomUUID()}`)
        .withHeaders("Authorization", "Bearer " + token)
        .expectJson({ erro: "Personal Trainer não encontrado" })
        .expectStatus(404);
});

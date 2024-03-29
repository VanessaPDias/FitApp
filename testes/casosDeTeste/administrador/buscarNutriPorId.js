const { spec } = require('pactum');
const configuracoes = require('../../configuracoes');
const usuario = require('../../funcoes/usuario');
const nutricionista = require('../../funcoes/nutricionista');
const crypto = require('crypto');

it('CU-A 07 - deve ver os dados do Nutricionista', async () => {
    const token = await usuario.gerarToken('admin@fitapp.com', 'admin123');
    
    const email = `ana_${crypto.randomUUID()}@fitapp.com`;
    const idNutri = await nutricionista.cadastrarNutri(token, "ana", email, "99999999", "BFUDbHJKd");

    await spec()
        .get(`${configuracoes.urlDaApi}/admin/nutricionistas/${idNutri}`)
        .withHeaders("Authorization", "Bearer " + token)
        .expectJsonLike(
            {
                idNutri: idNutri,
                nome: "ana",
            }
        )
        .expectStatus(200);
});

it('CU-A 07 - não encontra Nutricionista quando o Id não existe', async () => {
    const token = await usuario.gerarToken('admin@fitapp.com', 'admin123');
    
    const email = `ana_${crypto.randomUUID()}@fitapp.com`;
    const idNutri = await nutricionista.cadastrarNutri(token, "ana", email, "99999999", "BFUDbHJKd");

    await spec()
        .get(`${configuracoes.urlDaApi}/admin/nutricionistas/${crypto.randomUUID()}`)
        .withHeaders("Authorization", "Bearer " + token)
        .expectJson({ erro: "Nutricionista não encontrado" })
        .expectStatus(404);
});
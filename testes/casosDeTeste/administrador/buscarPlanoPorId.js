const { spec } = require('pactum');
const configuracoes = require('../../configuracoes');
const usuario = require('../../funcoes/usuario');
const plano = require('../../funcoes/plano');
const crypto = require('crypto');

it('CU-A 17 - deve ver os dados do Plano', async () => {
    const token = await usuario.gerarToken('admin@fitapp.com', 'admin123');
    
    const nomePlano = `gratuito_${crypto.randomUUID()}`;
    const idPlano = await plano.cadastrarPlano(token, nomePlano, 0, 15, "Experimente gratis por 15 dias", "2023-01-01 00:00:00");

    await spec()
        .get(`${configuracoes.urlDaApi}/admin/planos/${idPlano}`)
        .withHeaders("Authorization", "Bearer " + token)
        .expectJsonLike(
            {
                idPlano: idPlano,
                nome: nomePlano
            }
        )
        .expectStatus(200);
});

it('CU-A 17 - não encontra plano quando o Id não existe', async () => {
    const token = await usuario.gerarToken('admin@fitapp.com', 'admin123');
    
    const nomePlano = `gratuito_${crypto.randomUUID()}`;
    const idPlano = await plano.cadastrarPlano(token, nomePlano, 0, 15, "Experimente gratis por 15 dias", "2023-01-01 00:00:00");

    await spec()
        .get(`${configuracoes.urlDaApi}/admin/planos/${crypto.randomUUID()}`)
        .withHeaders("Authorization", "Bearer " + token)
        .expectJson({ erro: "Plano não encontrado" })
        .expectStatus(404);
});
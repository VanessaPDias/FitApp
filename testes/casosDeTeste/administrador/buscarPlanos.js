const { spec } = require('pactum');
const configuracoes = require('../../configuracoes');
const usuario = require('../../funcoes/usuario');
const crypto = require('crypto');
const plano = require('../../funcoes/plano');

it('CU-A 15 - deve listar Planos', async () => {
    const token = await usuario.gerarToken('admin@fitapp.com', 'admin123');
    const idPlano = await plano.cadastrarPlano(token, `Gratuito_${crypto.randomUUID()}`, 0, 15, "Experimente gratis por 15 dias", "2023-01-01 00:00:00");

    await spec()
        .get(`${configuracoes.urlDaApi}/admin/planos`)
        .withHeaders("Authorization", "Bearer " + token)
        .expectJsonLike([
            {
                "idPlano": idPlano
            }
        ])
        .expectStatus(200);
});


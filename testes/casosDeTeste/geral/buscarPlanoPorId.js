const { spec } = require('pactum');
const configuracoes = require('../../configuracoes');
const crypto = require('crypto');
const planos = require('../../funcoes/plano')
const usuario = require('../../funcoes/usuario');

it('o sistema apresenta os dados do Plano', async () => {
    const token = await usuario.gerarToken('admin@fitapp.com', 'admin123');

    const idPlano = await planos.cadastrarPlano(token, `Gratuito_${crypto.randomUUID()}`, 0, 15, "Experimente gratis por 15 dias", "2023-01-01 00:00:00");

    await spec()
        .get(`${configuracoes.urlDaApi}/planos/${idPlano}`)
        .expectJsonLike(
            {
               idPlano: idPlano
            }
        )
        .expectStatus(200);

        
})
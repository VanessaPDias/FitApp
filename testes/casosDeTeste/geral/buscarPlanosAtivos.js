const { spec } = require('pactum');
const configuracoes = require('../../configuracoes');
const crypto = require('crypto');
const planos = require('../../funcoes/plano')
const usuario = require('../../funcoes/usuario');

it('o sistema apresenta os Planos ativos', async () => {
    const token = await usuario.gerarToken('admin@fitapp.com', 'admin123');

    const idPlano1 = await planos.cadastrarPlano(token, `planoBloqueado_teste_${crypto.randomUUID()}`, 0, 15, "Experimente gratis por 15 dias","2023-01-01 00:00:00");
    const idPlano2 = await planos.cadastrarPlano(token, `planoAtivo_teste_${crypto.randomUUID()}`, 0, 15, "Experimente gratis por 15 dias", "2023-01-01 00:00:00");

   
    await spec()
        .patch(`${configuracoes.urlDaApi}/admin/planos/${idPlano1}`)
        .withHeaders("Authorization", "Bearer " + token)
        .withJson({
            "nome": `Anual_${crypto.randomUUID()}`,
            "valor": 100,
            "bloqueado": true,
            "duracao": 30,
            "descricao": "Experimente gratis por 10 dias",
            "dataLancamento": "2023-01-01 00:00:00"
        })
        .expectStatus(200);

    await spec()
        .get(`${configuracoes.urlDaApi}/planos`)
        .expectJsonLike([
            {
                idPlano: idPlano2
            }
        ])
        .expectStatus(200);
})
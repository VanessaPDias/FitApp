const { spec } = require('pactum');
const configuracoes = require('../../configuracoes');
const usuario = require('../../funcoes/usuario');
const mensagem = require('../../funcoes/mensagem');

it('Deve buscar as mensagens excluidas', async () => {
    const tokenAdmin = await usuario.gerarToken('admin@fitapp.com', 'admin123');
    const tokenNutri = await usuario.gerarToken('nutri@fitapp.com', 'nutri123');

    const idMensagem = await mensagem.enviarMensagem(tokenAdmin, "nutri@fitapp.com", "Boas Vindas", "Olá, Estamos felizes por tê-lo conosco!");


    await spec()
        .patch(`${configuracoes.urlDaApi}/mensagens/${idMensagem}`)
        .withHeaders("Authorization", "Bearer " + tokenNutri)
        .expectStatus(200);

    await spec()
        .get(`${configuracoes.urlDaApi}/mensagem/excluidas`)
        .withHeaders("Authorization", "Bearer " + tokenNutri)
        .expectJsonLike([{ "idMensagem": idMensagem }])
        .expectStatus(200);
});
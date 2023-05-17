const { spec } = require('pactum');
const configuracoes = require('../configuracoes');


async function alterarPlano(token, idPlano, nome, valor, duracao, descricao, bloqueado, dataLancamento) {
    return await spec()
        .patch(`${configuracoes.urlDaApi}/admin/planos/${idPlano}`)
        .withHeaders("Authorization", "Bearer " + token)
        .withJson({
            "nome": nome,
            "valor": valor,
            "duracao": duracao,
            "descricao": descricao,
            "bloqueado": bloqueado,
            "dataLancamento": dataLancamento
        })
        .expectStatus(200);
}


async function cadastrarPlano(token, nome, valor, duracao, descricao, dataLancamento) {
    return await spec()
        .post(`${configuracoes.urlDaApi}/admin/planos`)
        .withHeaders("Authorization", "Bearer " + token)
        .withJson({
            "nome": nome,
            "valor": valor,
            "duracao": duracao,
            "descricao": descricao,
            "dataLancamento": dataLancamento
        })
        .returns("idPlano");
}

module.exports = {
    alterarPlano: alterarPlano,
    cadastrarPlano: cadastrarPlano,
}
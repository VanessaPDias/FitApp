const { spec } = require('pactum');
const configuracoes = require('../configuracoes');

async function cadastrarPersonal(token, nome, email, telefone, registroProfissional) {
    return await spec()
        .post(`${configuracoes.urlDaApi}/personalTrainers`)
        .withHeaders("Authorization", "Bearer " + token)
        .withJson({
            "nome": nome,
            "email": email,
            "telefone": telefone,
            "registroProfissional": registroProfissional
        })
        .returns("idPersonal");
       
}

async function alterarDadosDoPersonal(token, idPersonal, nome, email, telefone, registroProfissional, bloqueado, cadastroConfirmado) {
    await spec()
         .patch(`${configuracoes.urlDaApi}/admin/personalTrainers/${idPersonal}`)
         .withHeaders("Authorization", "Bearer " + token)
         .withJson({
             "nome": nome,
             "email": email,
             "telefone": telefone,
             "registroProfissional": registroProfissional,
             "bloqueado": bloqueado,
             "cadastroConfirmado": cadastroConfirmado
         })
         .expectStatus(200); 
 }
 


async function criarTreino(tokenPersonal, idAssinante, nomeTreino, dataInicio, dataFim, objetivo, exercicios) {
    return await spec()
    .post(`${configuracoes.urlDaApi}/personalTrainer/alunos/${idAssinante}/treinos`)
    .withHeaders("Authorization", "Bearer " + tokenPersonal)
    .withJson({
        "nomeTreino": nomeTreino,
        "dataInicio":dataInicio,
        "dataFim": dataFim,
        "objetivo": objetivo,
        "exercicios": exercicios
    })
    .returns("idTreino");

}


module.exports = {
    cadastrarPersonal: cadastrarPersonal,
    alterarDadosDoPersonal: alterarDadosDoPersonal,
    criarTreino: criarTreino
}
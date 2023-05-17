const { spec } = require('pactum');
const configuracoes = require('../configuracoes');

async function cadastrarNutri(token, nome, email, telefone, registroProfissional) {
    return await spec()
        .post(`${configuracoes.urlDaApi}/nutricionistas`)
        .withHeaders("Authorization", "Bearer " + token)
        .withJson({
            "nome": nome,
            "email": email,            
            "telefone": telefone,
            "registroProfissional": registroProfissional,
        })
        .returns("idNutri");
       
}

async function alterarDadosDoNutricionista(token, idNutri, nome, email, telefone, registroProfissional, bloqueado, cadastroConfirmado) {
   await spec()
        .patch(`${configuracoes.urlDaApi}/admin/nutricionistas/${idNutri}`)
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



async function criarDieta(tokenNutri, idAssinante, nomeDieta, dataInicio, dataFim, objetivo, itens) {
    return await spec()
    .post(`${configuracoes.urlDaApi}/nutricionista/pacientes/${idAssinante}/dietas`)
    .withHeaders("Authorization", "Bearer " + tokenNutri)
    .withJson({
        "nomeDieta": nomeDieta,
        "dataInicio":dataInicio,
        "dataFim": dataFim,
        "objetivo": objetivo,
        "itens": itens
    })
    .returns("idDieta");

}


module.exports = {
    cadastrarNutri: cadastrarNutri,
    alterarDadosDoNutricionista:alterarDadosDoNutricionista,
    criarDieta: criarDieta
}
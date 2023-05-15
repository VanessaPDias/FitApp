const crypto = require('crypto');
const ItemDaDieta = require('../model/itemDaDieta');

function Dieta(idAssinante, idNutri, nomeDieta, dataInicio, dataFim, objetivo, itens) {
    if (!nomeDieta) {
        throw { mensagem: "Não é possível criar dieta sem nome", interna: true };
    }

    if (!dataInicio) {
        throw { mensagem: "Não é possível criar dieta a data de inicio", interna: true };
    }

    if (!dataFim) {
        throw { mensagem: "Não é possível criar dieta sem a data do fim", interna: true };
    }

    if (!objetivo) {
        throw { mensagem: "Não é possível criar dieta sem o objetivo", interna: true };
    }

    if (!itens || itens.length <= 0) {
        throw { mensagem: "Não é possível criar dieta sem itens", interna: true };
    }

    this.idDieta = crypto.randomUUID();
    this.idAssinante = idAssinante;
    this.idNutri = idNutri;
    this.ativo = true;
    this.nomeDieta = nomeDieta;
    this.dataInicio = new Date(dataInicio);
    this.dataFim = new Date(dataFim);
    this.objetivo = objetivo;
    this.data = new Date();
    this.dietaAtual = true;
    this.itens = [];


    itens.forEach(item => {
        this.itens.push(new ItemDaDieta.ItemDaDieta(this.idDieta, item.descricao, item.refeicao));
    });

}



function validarAlteracaoDaDieta(idDieta, nomeDieta, dataInicio, dataFim, objetivo, itens) {

    if (!idDieta) {
        throw { mensagem: "Não é possível adicionar item sem o id da dieta", interna: true };
    }

    if (!nomeDieta) {
        throw { mensagem: "Não é possível alterar dieta sem o nome", interna: true };
    }

    if (!dataInicio) {
        throw { mensagem: "Não é possível alterar dieta sem a data de inicio", interna: true };
    }

    if (!dataFim) {
        throw { mensagem: "Não é possível alterar dieta sem a data do fim", interna: true };
    }

    if (!objetivo) {
        throw { mensagem: "Não é possível alterar dieta sem o objetivo", interna: true };
    }

    if (!itens || itens.length <= 0) {
        throw { mensagem: "Não é possível alterar dieta sem itens", interna: true };
    }

}

module.exports = {
    Dieta: Dieta,
    validarAlteracaoDaDieta: validarAlteracaoDaDieta
}

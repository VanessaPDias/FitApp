const crypto = require('crypto');

function Plano(nome, valor, duracao, descricao, dataLancamento) {
    if (!nome) {
        throw { mensagem: "Não é possível cadastrar Plano sem o nome", interna: true };
    }

    if (!valor == undefined || valor < 0) {
        throw { mensagem: "Não é possível cadastrar Plano sem valor", interna: true };
    }

    if (!duracao == undefined || duracao < 0) {
        throw { mensagem: "Não é possível cadastrar Plano sem duração", interna: true };
    }

    if (!descricao) {
        throw { mensagem: "Não é possível cadastrar Plano sem descrição", interna: true };
    }

    if (!dataLancamento) {
        throw { mensagem: "Não é possível cadastrar Plano sem data de lançamento", interna: true };
    }

    this.idPlano = crypto.randomUUID();
    this.nome = nome;
    this.valor = valor;
    this.duracao = duracao;
    this.descricao = descricao;
    this.bloqueado = false;
    this.dataLancamento = dataLancamento;

}


function validarAlteracaoDoPlano(nome, valor, duracao, descricao, bloqueado, dataLancamento) {

    if (!nome) {
        throw { mensagem: "O nome do plano precisa ser definido", interna: true };
    }

    if (!valor) {
        throw { mensagem: "O valor do plano precisa ser definido", interna: true };
    }

    if (!duracao) {
        throw { mensagem: "A duracao do plano precisa ser definido", interna: true };
    }

    if (!descricao) {
        throw { mensagem: "A descricao do plano precisa ser definido", interna: true };
    }

    if (!dataLancamento) {
        throw { mensagem: "A data de lançamento do plano precisa ser definida", interna: true };
    }

    if (typeof(bloqueado) != 'boolean') {
        throw { mensagem: "O status do plano precisa ser definido", interna: true };
    }

}

module.exports = {
    Plano: Plano,
    validarAlteracaoDoPlano: validarAlteracaoDoPlano
}
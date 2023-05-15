const crypto = require('crypto');
const ExercicioDoTreino = require('./exercicioDoTreino');

function Treino(idAssinante, idPersonal, nomeTreino, dataInicio, dataFim, objetivo, exercicios) {
    if (!nomeTreino) {
        throw { mensagem: "Não é possível criar Treino sem nome", interna: true };
    }

    if (!dataInicio) {
        throw { mensagem: "Não é possível criar Treino a data de inicio", interna: true };
    }

    if (!dataFim) {
        throw { mensagem: "Não é possível criar Treino sem a data do fim", interna: true };
    }

    if (!objetivo) {
        throw { mensagem: "Não é possível criar Treino sem o objetivo", interna: true };
    }

    this.idTreino = crypto.randomUUID();
    this.idAssinante = idAssinante;
    this.idPersonal = idPersonal;
    this.ativo = true;
    this.nomeTreino = nomeTreino;
    this.dataInicio = new Date(dataInicio);
    this.dataFim = new Date(dataFim);
    this.objetivo = objetivo;
    this.data = new Date();
    this.treinoAtual = true;
    this.exercicios = [];


    exercicios.forEach(exercicio => {
        this.exercicios.push(new ExercicioDoTreino.ExercicioDoTreino(this.idTreino, exercicio.descricao, exercicio.diaDoTreino));
    });

}

function validarAlteracaoDoTreino(idTreino, nomeTreino, dataInicio, dataFim, objetivo, exercicios) {

    if (!idTreino) {
        throw { mensagem: "Não é possível adicionar exercicio sem o id do treino", interna: true };
    }

    if (!nomeTreino) {
        throw { mensagem: "Não é possível alterar treino sem o nome", interna: true };
    }

    if (!dataInicio) {
        throw { mensagem: "Não é possível alterar treino sem a data de inicio", interna: true };
    }

    if (!dataFim) {
        throw { mensagem: "Não é possível alterar treino sem a data do fim", interna: true };
    }

    if (!objetivo) {
        throw { mensagem: "Não é possível alterar treino sem o objetivo", interna: true };
    }

    if (!exercicios || exercicios.length <= 0) {
        throw { mensagem: "Não é possível alterar treino sem exercicios", interna: true };
    }

}



module.exports = {
    Treino: Treino,
    validarAlteracaoDoTreino: validarAlteracaoDoTreino
}

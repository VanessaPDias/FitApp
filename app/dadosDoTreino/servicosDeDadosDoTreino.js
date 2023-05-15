import * as util from "../util/tratamentoDeRespostaApi.js";
import * as configuracoes from "../configuracoes.js";

export async function buscarDados(token, idAssinante, idTreino) {
    const url = `${configuracoes.urlDaApi}/personalTrainer/alunos/${idAssinante}/treinos/${idTreino}`;

    const resposta = await fetch(url, {
        headers: {
            authorization: "Bearer " + token
        }
    });

    return util.tratarRespostaApi(resposta);
}

export async function salvarTreino(token, idAssinante, nomeTreino, dataInicio, dataFim, objetivo, exercicios) {
    const url = `${configuracoes.urlDaApi}/personalTrainer/alunos/${idAssinante}/treinos`;

    const request = new Request(url, {
        method: 'POST',
        body: JSON.stringify(
            {
                nomeTreino: nomeTreino,
                dataInicio: dataInicio,
                dataFim: dataFim,
                objetivo: objetivo,
                exercicios: exercicios
            }),
        headers: {
            authorization: "Bearer " + token,
            "Content-Type": "application/json"
        }

    });

    const resposta = await fetch(request);

    return util.tratarRespostaApi(resposta);
}

export async function alterarTreino(token, idAssinante, idTreino, nomeTreino, dataInicio, dataFim, objetivo, exercicios) {
    const url = `${configuracoes.urlDaApi}/personalTrainer/alunos/${idAssinante}/treinos/${idTreino}`;

    const request = new Request(url, {
        method: 'PATCH',
        body: JSON.stringify(
            {
                nomeTreino: nomeTreino,
                dataInicio: dataInicio,
                dataFim: dataFim,
                objetivo: objetivo,
                exercicios: exercicios
            }),
        headers: {
            authorization: "Bearer " + token,
            "Content-Type": "application/json"
        }
    });

    const resposta = await fetch(request);

    return util.tratarRespostaApi(resposta);
}

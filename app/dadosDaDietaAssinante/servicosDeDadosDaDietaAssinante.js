import * as util from "../util/tratamentoDeRespostaApi.js";
import * as configuracoes from "../configuracoes.js";

export async function buscarDietaPorId(token, idDieta) {
    const url = `${configuracoes.urlDaApi}/assinante/dietas/${idDieta}`;

    const resposta = await fetch(url, {
        headers: {
            authorization: "Bearer " + token
        }
    });

    return util.tratarRespostaApi(resposta);
}

export async function salvarDieta(token, idAssinante, nomeDieta, dataInicio, dataFim, objetivo, itens) {
    const url = `${configuracoes.urlDaApi}/nutricionista/pacientes/${idAssinante}/dietas`;

    const request = new Request(url, {
        method: 'POST',
        body: JSON.stringify(
            {
                nomeDieta: nomeDieta,
                dataInicio: dataInicio,
                dataFim: dataFim,
                objetivo: objetivo,
                itens: itens
            }),
        headers: {
            authorization: "Bearer " + token,
            "Content-Type": "application/json"
        }

    });

    const resposta = await fetch(request);

    return util.tratarRespostaApi(resposta);
}

export async function alterarDieta(token, idAssinante, idDieta, nomeDieta, dataInicio, dataFim, objetivo, itens) {
    const url = `${configuracoes.urlDaApi}/nutricionista/pacientes/${idAssinante}/dietas/${idDieta}`;

    const request = new Request(url, {
        method: 'PATCH',
        body: JSON.stringify(
            {
                nomeDieta: nomeDieta,
                dataInicio: dataInicio,
                dataFim: dataFim,
                objetivo: objetivo,
                itens: itens
            }),
        headers: {
            authorization: "Bearer " + token,
            "Content-Type": "application/json"
        }
    });

    const resposta = await fetch(request);

    return util.tratarRespostaApi(resposta);
}

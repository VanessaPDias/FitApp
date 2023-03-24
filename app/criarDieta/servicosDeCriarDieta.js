import * as util from "../util/tratamentoDeRespostaApi.js";
import * as configuracoes from "../configuracoes.js";

export async function buscarDadosDaDieta(token, idAssinante, idDieta){
    const url = `${configuracoes.urlDaApi}/nutricionista/pacientes/${idAssinante}/dietas/${idDieta}`;

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

export async function excluirMedidas(token, idMedidas) {
    const url = `${configuracoes.urlDaApi}/assinante/medidas/${idMedidas}`;

    const request = new Request(url, {
        method: 'DELETE',        
        headers: {
            authorization: "Bearer " + token,
            "Content-Type": "application/json"
        }
    });

    const resposta = await fetch(request);
    
    return util.tratarRespostaApi(resposta);
}

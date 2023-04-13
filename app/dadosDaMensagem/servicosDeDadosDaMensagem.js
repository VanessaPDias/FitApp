import * as util from "../util/tratamentoDeRespostaApi.js";
import * as configuracoes from "../configuracoes.js";


export async function buscarDadosDaMensagem(token, idMensagem) {
    const url = `${configuracoes.urlDaApi}/mensagens/${idMensagem}`;

    const resposta = await fetch(url, {
        headers: {
            authorization: "Bearer " + token
        }
    });

    return util.tratarRespostaApi(resposta);
}

export async function salvarMensagem(token, idMensagem, texto) {
    const url = `${configuracoes.urlDaApi}/mensagens/${idMensagem}`;

    const request = new Request(url, {
        method: 'POST',
        body: JSON.stringify(
            {
                texto: texto
            }),
        headers: {
            authorization: "Bearer " + token,
            "Content-Type": "application/json"
        }

    });

    const resposta = await fetch(request);

    return util.tratarRespostaApi(resposta);
}

export async function excluirMensagem(token, idMensagem) {
    const url = `${configuracoes.urlDaApi}/mensagens/${idMensagem}`;

    const request = new Request(url, {
        method: 'PATCH',
        headers: {
            authorization: "Bearer " + token,
            "Content-Type": "application/json"
        }
    });

    const resposta = await fetch(request);
    
    return util.tratarRespostaApi(resposta);
}
import * as util from "../util/tratamentoDeRespostaApi.js";
import * as configuracoes from "../configuracoes.js";

export async function buscarRecebidas(token) {
    const url = `${configuracoes.urlDaApi}/mensagem/recebidas/`;

    const resposta = await fetch(url, {
        headers: {
            authorization: "Bearer " + token
        }
    });

    return util.tratarRespostaApi(resposta);
}
export async function buscarEnviadas(token) {
    const url = `${configuracoes.urlDaApi}/mensagem/enviadas/`;

    const resposta = await fetch(url, {
        headers: {
            authorization: "Bearer " + token
        }
    });

    return util.tratarRespostaApi(resposta);
}

export async function buscarExcluidas(token) {
    const url = `${configuracoes.urlDaApi}/mensagem/excluidas/`;

    const resposta = await fetch(url, {
        headers: {
            authorization: "Bearer " + token
        }
    });

    return util.tratarRespostaApi(resposta);
}

export async function buscarDadosDaMensagem(token, idMensagem) {
    const url = `${configuracoes.urlDaApi}/mensagens/${idMensagem}`;

    const resposta = await fetch(url, {
        headers: {
            authorization: "Bearer " + token
        }
    });

    return util.tratarRespostaApi(resposta);
}

export async function salvarMensagem(token, destinatario, assunto, texto) {
    const url = `${configuracoes.urlDaApi}/mensagem/`;

    const request = new Request(url, {
        method: 'POST',        
        body: JSON.stringify(
            {
                destinatario: destinatario,
                assunto: assunto,
                texto: texto,
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
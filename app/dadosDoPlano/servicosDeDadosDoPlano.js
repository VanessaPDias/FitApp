import * as util from "../util/tratamentoDeRespostaApi.js";
import * as configuracoes from "../configuracoes.js";

export async function buscarDados(token, idPlano) {
    const url = `${configuracoes.urlDaApi}/admin/planos/${idPlano}`;

    const resposta = await fetch(url, {
        headers: {
            authorization: "Bearer " + token
        }
    });

    return util.tratarRespostaApi(resposta);
}

export async function gravarAlteracoes(token, idPlano, novosDados) {
    const url = `${configuracoes.urlDaApi}/admin/planos/${idPlano}`;

    const request = new Request(url, {
        method: 'PATCH',        
        body: JSON.stringify(
            {
                nome: novosDados.nome,
                valor: novosDados.valor,
                duracao: novosDados.duracao,
                descricao: novosDados.descricao,
                bloqueado: novosDados.bloqueado

            }),
        headers: {
            authorization: "Bearer " + token,
            "Content-Type": "application/json"
        }

    });

    const resposta = await fetch(request);
    
    return util.tratarRespostaApi(resposta);
}


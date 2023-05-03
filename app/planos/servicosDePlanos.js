import * as util from "../util/tratamentoDeRespostaApi.js";
import * as configuracoes from "../configuracoes.js";

export async function buscarDados(token, nome, bloqueado) {
    const url = `${configuracoes.urlDaApi}/admin/planos?nome=${nome}&bloqueado=${bloqueado}`;

    const resposta = await fetch(url, {
        headers: {
            authorization: "Bearer " + token
        }
    });

    return util.tratarRespostaApi(resposta);
}

export async function salvarPlano(token, nome, valor, duracao, descricao) {
    const url = `${configuracoes.urlDaApi}/admin/planos`;

    const request = new Request(url, {
        method: 'POST',        
        body: JSON.stringify(
            {
                nome: nome,
                valor: valor,
                duracao: duracao,
                descricao: descricao
            }),
        headers: {
            authorization: "Bearer " + token,
            "Content-Type": "application/json"
        }

    });

    const resposta = await fetch(request);
    
    return util.tratarRespostaApi(resposta);
}


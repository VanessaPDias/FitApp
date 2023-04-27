import * as util from "../util/tratamentoDeRespostaApi.js";
import * as configuracoes from "../configuracoes.js";

export async function buscarDados(token, idAssinatura) {
    const url = `${configuracoes.urlDaApi}/assinante/assinaturas/${idAssinatura}`;

    const resposta = await fetch(url, {
        headers: {
            authorization: "Bearer " + token
        }
    });

    return util.tratarRespostaApi(resposta);
}

export async function buscarPlanosAtivos() {
    const url = `${configuracoes.urlDaApi}/planos`;

    const resposta = await fetch(url);

    return util.tratarRespostaApi(resposta);
}

export async function alterarPlanoDaAssinatura(token, idAssinatura, idNovoPlano) {
    const url = `${configuracoes.urlDaApi}/assinante/assinaturas/${idAssinatura}`;

    const request = new Request(url, {
        method: 'PATCH',        
        body: JSON.stringify(
            {
                idPlano: idNovoPlano

            }),
        headers: {
            authorization: "Bearer " + token,
            "Content-Type": "application/json"
        }

    });

    const resposta = await fetch(request);
    
    return util.tratarRespostaApi(resposta);
}

export async function cancelarAssinatura(token, idAssinatura) {
    const url = `${configuracoes.urlDaApi}/assinante/assinaturas/${idAssinatura}`;

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


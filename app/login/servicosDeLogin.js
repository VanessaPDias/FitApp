import * as util from "../util/tratamentoDeRespostaApi.js";
import * as configuracoes from "../configuracoes.js";

export async function fazerLogin(email, senha) {
    const url = `${configuracoes.urlDaApi}/login`;

    const request = new Request(url, {
        method: 'POST',
        body: JSON.stringify(
            {
                email: email,
                senha: senha
            }),
        headers: {
            "Content-Type": "application/json"
        }

    });

    const resposta = await fetch(request);

    return util.tratarRespostaApi(resposta);
}

export async function fazerLoginGoogle(tokenGoogle) {
    const url = `${configuracoes.urlDaApi}/loginGoogle`;

    const request = new Request(url, {
        method: 'POST',
        body: JSON.stringify(
            {
                tokenGoogle: tokenGoogle
            }),
        headers: {
            "Content-Type": "application/json"
        }

    });

    const resposta = await fetch(request);

    return util.tratarRespostaApi(resposta);
}
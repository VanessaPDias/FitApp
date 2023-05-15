import * as util from "../util/tratamentoDeRespostaApi.js";
import * as configuracoes from "../configuracoes.js";

export async function cadastrarNutricionista(nome, email, telefone, registroProfissional) {
    const url = `${configuracoes.urlDaApi}/nutricionistas`;

    const request = new Request(url, {
        method: 'POST',
        body: JSON.stringify(
            {
                nome: nome,
                email: email,
                telefone: telefone,
                registroProfissional: registroProfissional
            }),
        headers: {
            "Content-Type": "application/json"
        }
    });

    const resposta = await fetch(request);

    return util.tratarRespostaApi(resposta);
}

export async function cadastrarPersonal(nome, email, telefone, registroProfissional) {
    const url = `${configuracoes.urlDaApi}/personalTrainers`;

    const request = new Request(url, {
        method: 'POST',
        body: JSON.stringify(
            {
                nome: nome,
                email: email,
                telefone: telefone,
                registroProfissional: registroProfissional
            }),
        headers: {
            "Content-Type": "application/json"
        }
    });

    const resposta = await fetch(request);

    return util.tratarRespostaApi(resposta);
}


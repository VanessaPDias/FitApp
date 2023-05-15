import * as util from "../util/tratamentoDeRespostaApi.js";
import * as configuracoes from "../configuracoes.js";

export async function buscarDados(token) {
    const url = `${configuracoes.urlDaApi}/nutricionista/perfil`;

    const resposta = await fetch(url, {
        headers: {
            authorization: "Bearer " + token
        }
    });

    return util.tratarRespostaApi(resposta);
}

export async function salvarDados(token, nome, telefone) {
    const url = `${configuracoes.urlDaApi}/nutricionista/perfil`;

    const request = new Request(url, {
        method: 'PATCH',
        body: JSON.stringify(
            {
                nome: nome,
                telefone: telefone
            }),
        headers: {
            authorization: "Bearer " + token,
            "Content-Type": "application/json"
        }

    });

    const resposta = await fetch(request);

    return util.tratarRespostaApi(resposta);
}

export async function salvarDadosSobreMim(token, texto) {
    const url = `${configuracoes.urlDaApi}/nutricionista/sobreMim`;

    const request = new Request(url, {
        method: 'PATCH',
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

export async function salvarImagem(token, imagem) {
    const url = `${configuracoes.urlDaApi}/usuarios/imagem`;

    const formData = new FormData();
    formData.append("imagem", imagem, imagem.name);

    const resposta = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
            authorization: "Bearer " + token
        }
    });

    return util.tratarRespostaApi(resposta);
}

export async function alterarSenha(token, senhaAtual, novaSenha) {
    const url = `${configuracoes.urlDaApi}/usuarios/senha`;

    const request = new Request(url, {
        method: 'PATCH',
        body: JSON.stringify(
            {
                senhaAtual: senhaAtual,
                novaSenha: novaSenha
            }),
        headers: {
            authorization: "Bearer " + token,
            "Content-Type": "application/json"
        }

    });

    const resposta = await fetch(request);

    return util.tratarRespostaApi(resposta);
}
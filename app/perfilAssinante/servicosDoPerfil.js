import * as util from "../util/tratamentoDeRespostaApi.js";
import * as configuracoes from "../configuracoes.js";

export async function buscarDados(token) {
    const url = `${configuracoes.urlDaApi}/assinante/perfil`;

    const resposta = await fetch(url, {
        headers: {
            authorization: "Bearer " + token
        }
    });

    return util.tratarRespostaApi(resposta);
}

export async function salvarDados(token, nome, dataNascimento, sexo, altura) {
    const url = `${configuracoes.urlDaApi}/assinante/perfil`;

    const request = new Request(url, {
        method: 'PATCH',
        body: JSON.stringify(
            {
                nome: nome,
                dataNascimento: dataNascimento,
                idSexo: sexo,
                altura: altura
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

export async function buscarDadosNutri(token, idNutri) {
    const url = `${configuracoes.urlDaApi}/assinante/perfil/nutricionistas/${idNutri}`;

    const resposta = await fetch(url, {
        headers: {
            authorization: "Bearer " + token
        }
    });

    return util.tratarRespostaApi(resposta);
}

export async function buscarDadosPersonal(token, idPersonal) {
    const url = `${configuracoes.urlDaApi}/assinante/perfil/personalTrainers/${idPersonal}`;

    const resposta = await fetch(url, {
        headers: {
            authorization: "Bearer " + token
        }
    });

    return util.tratarRespostaApi(resposta);
}
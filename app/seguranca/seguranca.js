const chaveToken = "fitapp_token";
const chaveNomeUsuario = "fitapp_nome_usuario";
const chaveImagemUsuario = "fitapp_imagem_usuario";
import * as mensagens from "../util/mensagens.js";

export function deslogarSeTokenEstiverExpirado(paginaParaRedirecionar) {

    if (!tokenValido()) {
        removerDadosDoUsuario();
        mensagens.mostrarMensagemInformativa("Sua sessão expirou. Faça o login novamente.", true);
        window.location.href = paginaParaRedirecionar;
    }
}

export function tokenValido() {
    const token = pegarToken();

    if (!token) {
        return false;
    }

    if (tokenExpirado(token) == true) {
        return false;
    }

    return true;
}

export function gravarToken(token) {
    localStorage.setItem(chaveToken, token);
    localStorage.setItem(chaveNomeUsuario, pegarUsuarioDoToken().nome);

    const imagem = pegarUsuarioDoToken().imagem;
    
    if (imagem) {
        localStorage.setItem(chaveImagemUsuario, imagem);
    }

}

export function pegarToken() {
    return localStorage.getItem(chaveToken);
}

export function pegarUsuarioDoToken() {
    const token = pegarToken();

    const tokenDecodificado = decodificarToken(token);

    return {
        idUsuario: tokenDecodificado.idUsuario,
        nome: tokenDecodificado.nome,
        email: tokenDecodificado.email,
        perfil: tokenDecodificado.perfil,
        imagem: tokenDecodificado.imagem
    }
}

export function atualizarNomeUsuarioLogado(nome) {
    localStorage.setItem(chaveNomeUsuario, nome);
}

export function atualizarImagemUsuarioLogado(imagem) {
    localStorage.setItem(chaveImagemUsuario, imagem);
}

export function pegarNomeDoUsuario() {
    return localStorage.getItem(chaveNomeUsuario);
}

export function pegarImagemDoUsuario() {
    return localStorage.getItem(chaveImagemUsuario);
}

export function removerDadosDoUsuario() {
    localStorage.removeItem(chaveNomeUsuario);
    localStorage.removeItem(chaveImagemUsuario);
    localStorage.removeItem(chaveToken);
}

function decodificarToken(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function tokenExpirado(token) {
    const tokenDecodificado = decodificarToken(token);
    const dataAtual = new Date().getTime() / 1000;

    if (dataAtual > tokenDecodificado.exp) {
        return true;
    }

    return false;
}


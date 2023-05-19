import * as servicos from "./servicosDeLogin.js";
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";

window.onload = aoCarregarPagina;

async function aoCarregarPagina() {
    debugger;
    const dados = buscarDadosDaUrl();

    await entrar(dados);
}

async function entrar(dados) {
    try {
        const resposta = await servicos.fazerLoginGoogle(dados.access_token);
        seguranca.gravarToken(resposta.token);

        const usuario = seguranca.pegarUsuarioDoToken(resposta.token);

        if (usuario.perfil == "assinante") {
            window.location.href = "../dashboard/dashboard.html#inicio"
        }
        if (usuario.perfil == "administrador") {
            window.location.href = "../assinantes/assinantes.html#assinantes"
        }
        if (usuario.perfil == "nutricionista") {
            window.location.href = "../pacientes/pacientes.html#pacientes"
        }
        if (usuario.perfil == "personalTrainer") {
            window.location.href = "../alunos/alunos.html#alunos"
        }

    } catch (error) {
        erros.tratarErro(error);
    }
}

function buscarDadosDaUrl() {
    var fragmentString = location.hash.substring(1);

    var params = {};
    var regex = /([^&=]+)=([^&]*)/g, m;
    while (m = regex.exec(fragmentString)) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }

    return params;
}
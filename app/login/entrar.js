import * as servicos from "./servicosDeLogin.js";
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";
import * as paginaMestraSite from "../paginaMestraSite/paginaMestraSite.js";
import * as mensagens from "../util/mensagens.js";

window.onload = aoCarregarPagina;

async function aoCarregarPagina() {
    await paginaMestraSite.carregar("login/entrar-conteudo.html", "Entrar");
    document.querySelector("#btn-fazerLogin").onclick = entrar;
    document.querySelector("#btn-login-google").onclick = entrarComGoogle;
    mensagens.exibirMensagemAoCarregarAPagina();
}

async function entrar(evento) {
    const email = document.querySelector("#email").value;
    const senha = document.querySelector("#senha").value;
    const formulario = document.querySelector("#formulario");

    if (formulario.checkValidity() == false) {
        return false;
    }

    evento.preventDefault();

    try {
        const resposta = await servicos.fazerLogin(email, senha);
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

function entrarComGoogle() {
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    var form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', oauth2Endpoint);

    var params = {
        'client_id': '228294881734-t18ukuse4ea3k9tm88ck7sb286kbs0h8.apps.googleusercontent.com',
        'redirect_uri': 'https://green-bay-0aa81ec03.2.azurestaticapps.net/login/entrarGoogle.html',
        'response_type': 'token',
        'scope': 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/userinfo.email',
        'include_granted_scopes': 'true',
        'state': 'sample'
    };

    for (var p in params) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
}
import * as servicos from "./servicosDeLogin.js";
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";
import * as paginaMestraSite from "../paginaMestraSite/paginaMestraSite.js";
import * as mensagens from "../util/mensagens.js";

window.onload = aoCarregarPagina;

async function aoCarregarPagina() {
    await paginaMestraSite.carregar("login/entrar-conteudo.html", "Entrar");
    document.querySelector("#btn-fazerLogin").onclick = entrar;
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

        if(usuario.perfil == "assinante") {
           window.location.href = "../dashboard/dashboard.html#inicio" 
        }
        if(usuario.perfil == "administrador") {
           window.location.href = "../assinantes/assinantes.html#assinantes" 
        }
        if(usuario.perfil == "nutricionista") {
           window.location.href = "../pacientes/pacientes.html#pacientes" 
        }
        if(usuario.perfil == "personalTrainer") {
           window.location.href = "../alunos/alunos.html#alunos" 
        }

    } catch (error) {
        erros.tratarErro(error);
    }
}
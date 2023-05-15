import * as servicos from "./servicosDeTrabalheConosco.js";
import * as erros from "../util/tratamentoDeErros.js";
import * as mensagens from "../util/mensagens.js";
import * as paginaMestraSite from "../paginaMestraSite/paginaMestraSite.js";

window.onload = aoCarregarPagina;

async function aoCarregarPagina() {
    await paginaMestraSite.carregar("trabalheConosco/trabalheConosco-conteudo.html", "Trabalhe Conosco");

    document.querySelector("#btn-enviar-fromulario").onclick = cadastrarProfissional;
    mensagens.exibirMensagemAoCarregarAPagina();
}

async function cadastrarProfissional(evento) {
    const nome = document.querySelector("#form-nome").value;
    const email = document.querySelector("#form-email").value;
    const telefone = document.querySelector("#form-telefone").value;
    const areaInteresse = document.querySelector("#form-area-interesse").value;
    const registroProfissional = document.querySelector("#form-registro-profissional").value;

    const formulario = document.querySelector("#formulario-trabalhe-conosco");
    if (formulario.checkValidity() == false) {
        return false;
    }

    evento.preventDefault();

    try {
        if(areaInteresse == "nutricionista") {
           await servicos.cadastrarNutricionista(nome, email, telefone, registroProfissional); 
        }

        if(areaInteresse == "personal-trainer") {
           await servicos.cadastrarPersonal(nome, email, telefone, registroProfissional); 
        }
        
        mensagens.mostrarMensagemDeSucesso("Cadastrado com sucesso! Aguarde o nosso contato.", true);
        window.location.reload();
    } catch (error) {
        erros.tratarErro(error);
    }
}

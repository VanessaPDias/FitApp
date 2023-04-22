import * as servicos from "./servicosDeCriacaoDeConta.js";
import * as erros from "../util/tratamentoDeErros.js";
import * as configuracoes from "../configuracoes.js";
import * as paginaMestraSite from "../paginaMestraSite/paginaMestraSite.js";
import * as mensagens from "../util/mensagens.js";

window.onload = aoCarregarPagina;

let dadosDoPlano;
let dadosDoNutri;
let dadosDoPersonal;

async function aoCarregarPagina() {
    
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    dadosDoPlano = await servicos.buscarDadosDoPlano(params.idPlano);
    dadosDoNutri = await servicos.buscarDadosDoNutri(params.idNutri);
    dadosDoPersonal = await servicos.buscarDadosDoPersonal(params.idPersonal);

    await paginaMestraSite.carregar("criarConta/criarConta-conteudo.html", "Criar conta");

    preencherCardPlano();
    preencherCardNutri();
    preencherCardPersonal();

    document.querySelector("#btn-cadastrarAssinante").onclick = cadastrarAssinante;
}

function preencherCardPlano() {
    document.querySelector("#card-plano-nome").innerHTML = dadosDoPlano.nome;
    document.querySelector("#card-plano-valor").innerHTML = dadosDoPlano.valor;
}

function preencherCardNutri() {
    
    if (!dadosDoNutri.imagem.endsWith("null")) {
        document.querySelector("#card-nutri-imagem").src = `${configuracoes.urlDaApi}/${dadosDoNutri.imagem}`;
    }

    document.querySelector("#card-nutri-nome").innerHTML = dadosDoNutri.nome;
}

function preencherCardPersonal() {
    if (!dadosDoPersonal.imagem.endsWith("null")) {
        document.querySelector("#card-personal-imagem").src = `${configuracoes.urlDaApi}/${dadosDoPersonal.imagem}`;
    }

    document.querySelector("#card-personal-nome").innerHTML = dadosDoPersonal.nome;
}

async function cadastrarAssinante(evento) {
    const nome = document.querySelector("#nome").value;
    const email = document.querySelector("#email").value;
    const plano = dadosDoPlano.idPlano;
    const nutricionista = dadosDoNutri.idNutri;
    const personalTrainer = dadosDoPersonal.idPersonal;

    const formulario = document.querySelector("#formulario");
    if (formulario.checkValidity() == false) {
        return false;
    }

    evento.preventDefault();
    try {
        await servicos.criarConta(nome, email, plano, nutricionista, personalTrainer);
        mensagens.mostrarMensagemDeSucesso("Cadastro realizado com sucesso! Verifique seu e-mail.", true);
        window.location.href = "../login/entrar.html";
    } catch (error) {
        erros.tratarErro(error);
    }
}
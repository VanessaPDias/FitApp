import * as servicos from "./servicosDeAssinatura.js";
import * as erros from "../util/tratamentoDeErros.js";
import * as configuracoes from "../configuracoes.js";
import * as mensagens from "../util/mensagens.js";
import * as paginaMestraSite from "../paginaMestraSite/paginaMestraSite.js";

window.onload = aoCarregarPagina;

let idPlano;
let idNutri;
let idPersonal;

async function aoCarregarPagina() {

    await paginaMestraSite.carregar("assinatura/assinatura-conteudo.html", "Assinatura");

    document.querySelector("#btn-finalizar-cadastro").onclick = finalizarCadastro;
    buscarPlanos();
    buscarNutricionistas();
    buscarPersonalTrainers();

    mensagens.exibirMensagemAoCarregarAPagina();
}

async function buscarPlanos() {
    const planosAtivos = await servicos.buscarPlanosAtivos();

    planosAtivos.forEach(plano => {
        preencherCaixaPlanoHtml(plano);
    });
}

function preencherCaixaPlanoHtml(plano) {

    const planosAtivos = document.querySelector("#planos-ativos");
    const planoModelo = document.querySelector("#card-modelo-plano");

    const clonePlanoModeloHtml = planoModelo.firstElementChild.cloneNode(true);

    clonePlanoModeloHtml.style.display = "block";

    clonePlanoModeloHtml.querySelector(".card-modelo-plano-nome").innerHTML = plano.nome;
    clonePlanoModeloHtml.querySelector(".card-modelo-plano-valor").innerHTML = plano.valor;
    clonePlanoModeloHtml.querySelector(".card-modelo-plano-descricao").innerHTML = plano.descricao;
    clonePlanoModeloHtml.querySelector("input").id = `${plano.idPlano}`;
    clonePlanoModeloHtml.querySelector("input").onclick = salvarIdPlano;

    planosAtivos.appendChild(clonePlanoModeloHtml);
}

function salvarIdPlano(evento) {
    idPlano = evento.target.id;
}

async function buscarNutricionistas() {
    const nutricionistasAtivos = await servicos.buscarNutricionistasAtivos();

    nutricionistasAtivos.forEach(nutri => {
        preencherCaixaNutriHtml(nutri);
    });
}

function preencherCaixaNutriHtml(nutri) {

    const nutricionistasAtivos = document.querySelector("#nutricionistas-ativos");
    const cardModeloNutri = document.querySelector("#card-modelo-nutri");

    const cloneCardModeloNutriHtml = cardModeloNutri.firstElementChild.cloneNode(true);

    cloneCardModeloNutriHtml.style.display = "block";

    if (!nutri.imagem.endsWith("null")) {
        cloneCardModeloNutriHtml.querySelector(".card-modelo-imagem-nutri").src = `${configuracoes.urlDaApi}/${nutri.imagem}`;
    }

    cloneCardModeloNutriHtml.querySelector(".card-modelo-nome-nutri").innerHTML = nutri.nome;
    cloneCardModeloNutriHtml.querySelector(".plano-modelo-descricao-nutri").innerHTML = nutri.sobreMim;
    cloneCardModeloNutriHtml.querySelector("input").id = `${nutri.idNutri}`;
    cloneCardModeloNutriHtml.querySelector("input").onclick = salvarIdNutri;

    nutricionistasAtivos.appendChild(cloneCardModeloNutriHtml);
}

function salvarIdNutri(evento) {
    idNutri = evento.target.id;
}

async function buscarPersonalTrainers() {
    const personalTrainersAtivos = await servicos.buscarPersonalTrainersAtivos();

    personalTrainersAtivos.forEach(personal => {
        preencherCaixaPersonalHtml(personal);
    });
}

function preencherCaixaPersonalHtml(personal) {

    const personalTrainersAtivos = document.querySelector("#personal-trainers-ativos");
    const cardModeloPersonal = document.querySelector("#card-modelo-personal");

    const cloneCardModeloPersonalHtml = cardModeloPersonal.firstElementChild.cloneNode(true);

    cloneCardModeloPersonalHtml.style.display = "block";

    if (!personal.imagem.endsWith("null")) {
        cloneCardModeloPersonalHtml.querySelector(".card-modelo-imagem-personal").src = `${configuracoes.urlDaApi}/${personal.imagem}`;
    }

    cloneCardModeloPersonalHtml.querySelector(".card-modelo-nome-personal").innerHTML = personal.nome;
    cloneCardModeloPersonalHtml.querySelector(".plano-modelo-descricao-personal").innerHTML = personal.sobreMim;
    cloneCardModeloPersonalHtml.querySelector("input").id = `${personal.idPersonal}`;
    cloneCardModeloPersonalHtml.querySelector("input").onclick = salvarIdPersonal;

    personalTrainersAtivos.appendChild(cloneCardModeloPersonalHtml);
}

function salvarIdPersonal(evento) {
    idPersonal = evento.target.id;
}

function finalizarCadastro() {
    window.location.href = `../criarConta/criarConta.html?idPlano=${idPlano}&idNutri=${idNutri}&idPersonal=${idPersonal}`;
}
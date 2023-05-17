import * as servicos from "./servicosDeCriarDieta.js"
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";
import * as paginaMestra from "../paginaMestra/paginaMestra.js";
import * as mensagens from "../util/mensagens.js";

seguranca.deslogarSeTokenEstiverExpirado("/login/entrar.html");

window.onload = aoCarregarPagina;

let token;
let idPaciente;
let nomePaciente;
let itensDaDieta = [];

async function aoCarregarPagina() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    idPaciente = params.idAssinante;
    nomePaciente = params.nomeAssinante;

    await paginaMestra.carregar("criarDieta/criarDieta-conteudo.html", "Criar Dieta");

    document.querySelector("#breadcrumb-dados-paciente").innerHTML = `<a href="/dadosDoPaciente/dadosDoPaciente.html?idAssinante=${idPaciente}#pacientes">Dados do Paciente</a>`;
    document.querySelector("#nome-paciente").innerHTML = ` / ${nomePaciente}`;

    document.querySelector("#inserir-item-cafeDaManha").onclick = inserirItem;
    document.querySelector("#inserir-item-lancheDaManha").onclick = inserirItem;
    document.querySelector("#inserir-item-almoco").onclick = inserirItem;
    document.querySelector("#inserir-item-lancheDaTarde").onclick = inserirItem;
    document.querySelector("#inserir-item-jantar").onclick = inserirItem;
    document.querySelector("#inserir-item-lancheDaNoite").onclick = inserirItem;

    document.querySelector("#btn-salvar-dieta").onclick = gravarDieta;
    document.querySelector("#btn-voltar-para-dados-paciente").onclick = voltarParaDadosDoPaciente;

    token = seguranca.pegarToken();

    mensagens.exibirMensagemAoCarregarAPagina();
}

function inserirItem(evento) {
    
    const refeicao = evento.target.dataset.refeicao;
    
    if(document.querySelector(`#input-item-${refeicao}`).value == "") {
        mensagens.mostrarMensagemDeErro("Não é possível inserir item sem descricão!", false);
        return;
    }

    const descricaoDoItem = document.querySelector(`#input-item-${refeicao}`).value;


    document.querySelector(`#input-item-${refeicao}`).value = "";


    itensDaDieta.push({ refeicao: refeicao, descricao: descricaoDoItem });

    mostrarItensDaDieta();

}

function mostrarItensDaDieta() {
    document.querySelector(`#lista-itens-cafeDaManha`).innerHTML = "";
    document.querySelector(`#lista-itens-lancheDaManha`).innerHTML = "";
    document.querySelector(`#lista-itens-almoco`).innerHTML = "";
    document.querySelector(`#lista-itens-lancheDaTarde`).innerHTML = "";
    document.querySelector(`#lista-itens-jantar`).innerHTML = "";
    document.querySelector(`#lista-itens-lancheDaNoite`).innerHTML = "";


    itensDaDieta.forEach(item => {

        document.querySelector(`#lista-itens-${item.refeicao}`).innerHTML = document.querySelector(`#lista-itens-${item.refeicao}`).innerHTML +
            `<li class="list-group-item lista-itens-dieta mb-2 d-flex justify-content-between">
            ${item.descricao}<i class="bi bi-trash3 btn-excluir-item" data-refeicao=${item.refeicao} data-descricao=${item.descricao} style= "cursor: pointer"></i>
        </li>`;
    });

    adicionarEventoExcluir();
}


function adicionarEventoExcluir() {
    const listaBtnExcluir = document.querySelectorAll(".btn-excluir-item");
    listaBtnExcluir.forEach(element => {
        element.onclick = excluirItem;
    });
}

function excluirItem(evento) {
    const refeicao = evento.target.dataset.refeicao;
    const descricao = evento.target.dataset.descricao;

    itensDaDieta = itensDaDieta.filter(item => filtrarItens(item, refeicao, descricao));

    mostrarItensDaDieta();
}

function filtrarItens(item, refeicao, descricao) {
    if (item.refeicao == refeicao) {
        if (item.descricao == descricao) {
            return false;
        }
        else {
            return true;
        }
    } else {
        return true;
    }
}


async function gravarDieta(evento) {
    const nomeDieta = document.querySelector("#nome-dieta").value;
    const dataInicio = document.querySelector("#inicio-dieta").value;
    const dataFim = document.querySelector("#fim-dieta").value;
    const objetivo = document.querySelector("#objetivo-dieta").value;

    const formulario = document.querySelector("#formulario");
    if (formulario.checkValidity() == false) {
        return false;
    }

    evento.preventDefault();

    try {
        const resposta = await servicos.salvarDieta(token, idPaciente, nomeDieta, dataInicio, dataFim, objetivo, itensDaDieta);
        mensagens.mostrarMensagemDeSucesso("Dieta criada com sucesso!", true);
        window.location.href = `../dadosDaDieta/dadosDaDieta.html?idAssinante=${idPaciente}&nomeAssinante=${nomePaciente}&idDieta=${resposta.idDieta}#pacientes`;
    } catch (error) {
        erros.tratarErro(error);
    }
}

function voltarParaDadosDoPaciente() {
    window.location.href = `../dadosDoPaciente/dadosDoPaciente.html?idAssinante=${idPaciente}#pacientes`;
}

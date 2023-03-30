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
const itensDaDieta = [];

async function aoCarregarPagina() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    idPaciente = params.idAssinante;
    nomePaciente = params.nomeAssinante;

    await paginaMestra.carregar("criarDieta/criarDieta-conteudo.html", "Criar Dieta");

    document.querySelector("#nome-paciente").innerHTML = nomePaciente;

    document.querySelector("#inserir-item-cafeDaManha").onclick = inserirItem;
    document.querySelector("#inserir-item-lancheDaManha").onclick = inserirItem;
    document.querySelector("#inserir-item-almoco").onclick = inserirItem;
    document.querySelector("#inserir-item-lancheDatarde").onclick = inserirItem;
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

    document.querySelector(`#lista-itens-${refeicao}`).innerHTML = "";

    itensDaDieta.filter(item => item.refeicao == refeicao).forEach(elemento => {
        document.querySelector(`#lista-itens-${refeicao}`).innerHTML = document.querySelector(`#lista-itens-${refeicao}`).innerHTML +
            `<li class="list-group-item mb-2 d-flex justify-content-between">
            ${elemento.descricao}<i class="bi bi-trash3 btn-excluir-medidas" style= "cursor: pointer"></i>
        </li>`;
    });
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
        window.location.href = `../dadosDaDieta/dadosDaDieta.html?idAssinante=${idPaciente}&nomeAssinante=${nomePaciente}&idDieta=${resposta.idDieta}`;
    } catch (error) {
        erros.tratarErro(error);
    }
}

function voltarParaDadosDoPaciente() {
    window.location.href = `../dadosDoPaciente/dadosDoPaciente.html?idAssinante=${idPaciente}`;
}

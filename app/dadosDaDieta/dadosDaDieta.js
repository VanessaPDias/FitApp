import * as servicos from "./servicosDeDadosDaDieta.js"
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";
import * as paginaMestra from "../paginaMestra/paginaMestra.js";
import * as mensagens from "../util/mensagens.js";

seguranca.deslogarSeTokenEstiverExpirado("/login/entrar.html");

window.onload = aoCarregarPagina;

let token;
let idPaciente;
let nomePaciente;
let dietaAtual;
let idDieta;
let itensDaDieta = [];

async function aoCarregarPagina() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    idPaciente = params.idAssinante;
    nomePaciente = params.nomeAssinante;
    idDieta = params.idDieta;
    dietaAtual = params.dietaAtual;

    await paginaMestra.carregar("dadosDaDieta/dadosDaDieta-conteudo.html", "Dados da Dieta");

    document.querySelector("#nome-paciente").innerHTML = nomePaciente;


    if (dietaAtual == false) {

        document.querySelector("#input-item-cafeDaManha").hidden = true;
        document.querySelector("#input-item-lancheDaManha").hidden = true;
        document.querySelector("#input-item-almoco").hidden = true;
        document.querySelector("#input-item-lancheDatarde").hidden = true;
        document.querySelector("#input-item-jantar").hidden = true;
        document.querySelector("#input-item-lancheDaNoite").hidden = true;

        document.querySelector("#inserir-item-cafeDaManha").hidden = true;
        document.querySelector("#inserir-item-lancheDaManha").hidden = true;
        document.querySelector("#inserir-item-almoco").hidden = true;
        document.querySelector("#inserir-item-lancheDatarde").hidden = true;
        document.querySelector("#inserir-item-jantar").hidden = true;
        document.querySelector("#inserir-item-lancheDaNoite").hidden = true;

        document.querySelector("#btn-alterar-dieta").hidden = true;
    }

    document.querySelector("#inserir-item-cafeDaManha").onclick = inserirItem;
    document.querySelector("#inserir-item-lancheDaManha").onclick = inserirItem;
    document.querySelector("#inserir-item-almoco").onclick = inserirItem;
    document.querySelector("#inserir-item-lancheDatarde").onclick = inserirItem;
    document.querySelector("#inserir-item-jantar").onclick = inserirItem;
    document.querySelector("#inserir-item-lancheDaNoite").onclick = inserirItem;
    document.querySelector("#btn-alterar-dieta").onclick = alterarDieta;
    document.querySelector("#btn-voltar-para-dados-paciente").onclick = voltarParaDadosDoPaciente;

    token = seguranca.pegarToken();
    buscarDadosDaDieta();
    mensagens.exibirMensagemAoCarregarAPagina();
}

async function buscarDadosDaDieta() {
    const resposta = await servicos.buscarDados(token, idPaciente, idDieta);
    itensDaDieta = resposta.itensDaDieta;

    const dataInicio = formatarData(resposta.dieta.dataInicio);
    const dataFim = formatarData(resposta.dieta.dataFim);

    const inputNomeDieta = document.querySelector("#nome-dieta");
    const inputDataInicio = document.querySelector("#inicio-dieta");
    const inputDataFim = document.querySelector("#fim-dieta");
    const inputObjetivo = document.querySelector("#objetivo-dieta");

    if (resposta.dieta.dietaAtual == true) {
        inputNomeDieta.value = resposta.dieta.nome;
        inputDataInicio.value = dataInicio;
        inputDataFim.value = dataFim;
        inputObjetivo.value = resposta.dieta.objetivo;

        itensDaDieta.forEach(item => {
            document.querySelector(`#lista-itens-${item.refeicao}`).innerHTML = document.querySelector(`#lista-itens-${item.refeicao}`).innerHTML +
                `<li class="list-group-item mb-2 d-flex justify-content-between lista-itens-dieta">${item.descricao}
                    <i class="bi bi-trash3 btn-excluir-item" data-refeicao=${item.refeicao} data-descricao=${item.descricao} style= "cursor: pointer"></i>
                </li>`;
        });

        adicionarEventoExcluir()
    } else {
        inputNomeDieta.setAttribute("disabled", "");
        inputDataInicio.setAttribute("disabled", "");
        inputDataFim.setAttribute("disabled", "");
        inputObjetivo.setAttribute("disabled", "");

        inputNomeDieta.value = resposta.dieta.nome;
        inputDataInicio.value = dataInicio;
        inputDataFim.value = dataFim;
        inputObjetivo.value = resposta.dieta.objetivo;

        itensDaDieta.forEach(item => {
            document.querySelector(`#lista-itens-${item.refeicao}`).innerHTML = document.querySelector(`#lista-itens-${item.refeicao}`).innerHTML +
                `<li class="list-group-item mb-2 d-flex justify-content-between lista-itens-dieta">${item.descricao}</li>`;
        });
    }
}

function inserirItem(evento) {
    const refeicao = evento.target.dataset.refeicao;

    const descricaoDoItem = document.querySelector(`#input-item-${refeicao}`).value;

    if (document.querySelector(`#input-item-${refeicao}`).value == "") {
        mensagens.mostrarMensagemDeErro("Não é possível inserir item sem descricão!", false);
        return;
    }

    document.querySelector(`#input-item-${refeicao}`).value = "";


    itensDaDieta.push({ refeicao: refeicao, descricao: descricaoDoItem });

    mostrarItensDaDieta();
}


async function alterarDieta(evento) {
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
        await servicos.alterarDieta(token, idPaciente, idDieta, nomeDieta, dataInicio, dataFim, objetivo, itensDaDieta);
        window.location.href = `../dadosDaDieta/dadosDaDieta.html?idAssinante=${idPaciente}&nomeAssinante=${nomePaciente}&idDieta=${idDieta}`;
        mensagens.mostrarMensagemDeSucesso("Dieta alterada com sucesso!", true);
    } catch (error) {
        erros.tratarErro(error);
    }
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

    adicionarEventoExcluir()
}

function formatarData(dataRecebida) {
    const data = new Date(dataRecebida);
    const zeroEsquerdaMes = (data.getMonth() + 1) < 10 ? '0' : '';
    const zeroEsquerdaDia = (data.getDate() + 1) < 10 ? '0' : '';
    return data.getFullYear() + '-' + zeroEsquerdaMes + (data.getMonth() + 1) + '-' + zeroEsquerdaDia + data.getDate();
}

function voltarParaDadosDoPaciente() {
    window.location.href = `../dadosDoPaciente/dadosDoPaciente.html?idAssinante=${idPaciente}`;
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

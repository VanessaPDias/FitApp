import * as servicos from "./servicosDeCriarDieta.js"
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";
import * as paginaMestra from "../paginaMestra/paginaMestra.js";
import * as mensagens from "../util/mensagens.js";
import * as configuracoes from "../configuracoes.js";

seguranca.deslogarSeTokenEstiverExpirado("/login/entrar.html");

window.onload = aoCarregarPagina;

let token;
let idPaciente;
let nomePaciente;
let idDieta;
const dadosDaDieta = [];
const itensDaDieta = [];

async function aoCarregarPagina() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    idPaciente = params.idAssinante;
    nomePaciente = params.nomeAssinante;
    idDieta = params.idDieta;

    await paginaMestra.carregar("criarDieta/criarDieta-conteudo.html", "Dieta");

    document.querySelector("#nome-paciente").innerHTML = nomePaciente;

    document.querySelector("#inserir-item-cafeDaManha").onclick = inserirItem;
    document.querySelector("#inserir-item-lancheDaManha").onclick = inserirItem;
    document.querySelector("#inserir-item-almoco").onclick = inserirItem;
    document.querySelector("#inserir-item-lancheDatarde").onclick = inserirItem;
    document.querySelector("#inserir-item-jantar").onclick = inserirItem;
    document.querySelector("#inserir-item-lancheDaNoite").onclick = inserirItem;

    document.querySelector("#btn-salvar-dieta").onclick = gravarDieta;

    token = seguranca.pegarToken();

    if (idDieta) {
        const resposta = await servicos.buscarDadosDaDieta(token, idPaciente, idDieta);
        dadosDaDieta.push(resposta.dieta);
        itensDaDieta.push(resposta.itensDaDieta);
        mostrarDadosDaDieta(dadosDaDieta, itensDaDieta);
    }

    mensagens.exibirMensagemAoCarregarAPagina();
}

function inserirItem(evento) {
    const refeicao = evento.target.dataset.refeicao;

    const descricaoDoItem = document.querySelector(`#input-item-${refeicao}`).value;

    document.querySelector(`#input-item-${refeicao}`).value = "";


    itensDaDieta.push({ refeicao: refeicao, descricao: descricaoDoItem });

    document.querySelector(`#lista-itens-${refeicao}`).innerHTML = "";

    itensDaDieta.filter(item => item.refeicao == refeicao).forEach(elemento => {
        document.querySelector(`#lista-itens-${refeicao}`).innerHTML = document.querySelector(`#lista-itens-${refeicao}`).innerHTML +
            `<li class="list-group-item mb-2 d-flex">
            ${elemento.descricao}
        </li><i class="bi bi-trash3 btn-excluir-medidas" style= "cursor: pointer"></i>`;
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
        window.location.href = `criarDieta.html?idAssinante=${idPaciente}&nomeAssinante=${nomePaciente}&idDieta=${resposta.idDieta}`;
    } catch (error) {
        erros.tratarErro(error);
    }
}

function mostrarDadosDaDieta(dadosDaDieta, itensDaDieta) {
    const dataInicio = formatarData(dadosDaDieta[0].dataInicio);
    const dataFim = formatarData(dadosDaDieta[0].dataFim);

    document.querySelector("#nome-dieta").value = dadosDaDieta[0].nome;
    document.querySelector("#inicio-dieta").value = dataInicio;
    document.querySelector("#fim-dieta").value = dataFim;
    document.querySelector("#objetivo-dieta").value = dadosDaDieta[0].objetivo;

    itensDaDieta[0].forEach(item => {
        document.querySelector(`#lista-itens-${item.refeicao}`).innerHTML = document.querySelector(`#lista-itens-${item.refeicao}`).innerHTML +
            `<li class="list-group-item mb-2 d-flex">
            ${item.descricao}
        </li>`;
    });
}

function formatarData(dataRecebida) {
    const data = new Date(dataRecebida);
    const zeroEsquerdaMes = (data.getMonth() + 1) < 10 ? '0' : '';
    const zeroEsquerdaDia = (data.getDate() + 1) < 10 ? '0' : '';
    return data.getFullYear() + '-' + zeroEsquerdaMes + (data.getMonth() + 1) + '-' + zeroEsquerdaDia + data.getDate();
}

//
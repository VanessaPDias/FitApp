import * as servicos from "./servicosDeDadosDoTreino.js";
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";
import * as paginaMestra from "../paginaMestra/paginaMestra.js";
import * as mensagens from "../util/mensagens.js";

seguranca.deslogarSeTokenEstiverExpirado("/login/entrar.html");

window.onload = aoCarregarPagina;

let token;
let idAluno;
let nomeALuno;
let treinoAtual;
let idTreino;
let exerciciosDoTreino = [];

async function aoCarregarPagina() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    idAluno = params.idAssinante;
    nomeALuno = params.nomeAssinante;
    idTreino = params.idTreino;
    treinoAtual = params.treinoAtual;

    await paginaMestra.carregar("dadosDoTreino/dadosDoTreino-conteudo.html", "Dados do Treino");

    document.querySelector("#nome-aluno").innerHTML = nomeALuno;


    if (treinoAtual == false) {

        document.querySelector("#input-exercicio-segunda").hidden = true;
        document.querySelector("#input-exercicio-terca").hidden = true;
        document.querySelector("#input-exercicio-quarta").hidden = true;
        document.querySelector("#input-exercicio-quinta").hidden = true;
        document.querySelector("#input-exercicio-sexta").hidden = true;
        document.querySelector("#input-exercicio-sabado").hidden = true;
        document.querySelector("#input-exercicio-domingo").hidden = true;

        document.querySelector("#inserir-exercicio-segunda").hidden = true;
        document.querySelector("#inserir-exercicio-terca").hidden = true;
        document.querySelector("#inserir-exercicio-quarta").hidden = true;
        document.querySelector("#inserir-exercicio-quinta").hidden = true;
        document.querySelector("#inserir-exercicio-sexta").hidden = true;
        document.querySelector("#inserir-exercicio-sabado").hidden = true;
        document.querySelector("#inserir-exercicio-domingo").hidden = true;

        document.querySelector("#btn-alterar-treino").hidden = true;
    }

    document.querySelector("#inserir-exercicio-segunda").onclick = inserirExercicio;
    document.querySelector("#inserir-exercicio-terca").onclick = inserirExercicio;
    document.querySelector("#inserir-exercicio-quarta").onclick = inserirExercicio;
    document.querySelector("#inserir-exercicio-quinta").onclick = inserirExercicio;
    document.querySelector("#inserir-exercicio-sexta").onclick = inserirExercicio;
    document.querySelector("#inserir-exercicio-sabado").onclick = inserirExercicio;
    document.querySelector("#inserir-exercicio-domingo").onclick = inserirExercicio;
    document.querySelector("#btn-alterar-treino").onclick = alterarTreino;
    document.querySelector("#btn-voltar-para-dados-aluno").onclick = voltarParaDadosDoAluno;

    token = seguranca.pegarToken();
    buscarDadosDoTreino();
    mensagens.exibirMensagemAoCarregarAPagina();
}

async function buscarDadosDoTreino() {
    
    const resposta = await servicos.buscarDados(token, idAluno, idTreino);
    exerciciosDoTreino = resposta.exercicios;

    const dataInicio = formatarData(resposta.treino.dataInicio);
    const dataFim = formatarData(resposta.treino.dataFim);

    const inputNomeTreino = document.querySelector("#nome-treino");
    const inputDataInicio = document.querySelector("#inicio-treino");
    const inputDataFim = document.querySelector("#fim-treino");
    const inputObjetivo = document.querySelector("#objetivo-treino");

    if (resposta.treino.treinoAtual == true) {
        inputNomeTreino.value = resposta.treino.nome;
        inputDataInicio.value = dataInicio;
        inputDataFim.value = dataFim;
        inputObjetivo.value = resposta.treino.objetivo;

        exerciciosDoTreino.forEach(exercicio => {
            document.querySelector(`#lista-exercicios-${exercicio.diaDoTreino}`).innerHTML = document.querySelector(`#lista-exercicios-${exercicio.diaDoTreino}`).innerHTML +
                `<li class="list-group-item mb-2 d-flex justify-content-between lista-exercicios-treino">${exercicio.descricao}
                    <i class="bi bi-trash3 btn-excluir-exercicio" data-diadotreino=${exercicio.diaDoTreino} data-descricao=${exercicio.descricao} style= "cursor: pointer"></i>
                </li>`;
        });

        adicionarEventoExcluir()
    } else {
        inputNomeTreino.setAttribute("disabled", "");
        inputDataInicio.setAttribute("disabled", "");
        inputDataFim.setAttribute("disabled", "");
        inputObjetivo.setAttribute("disabled", "");

        inputNomeTreino.value = resposta.treino.nome;
        inputDataInicio.value = dataInicio;
        inputDataFim.value = dataFim;
        inputObjetivo.value = resposta.treino.objetivo;

        exerciciosDoTreino.forEach(exercicio => {
            document.querySelector(`#lista-exercicios-${exercicio.diaDoTreino}`).innerHTML = document.querySelector(`#lista-exercicios-${exercicio.diaDoTreino}`).innerHTML +
                `<li class="list-group-item mb-2 d-flex justify-content-between lista-exercicios-treino">${exercicio.descricao}</li>`;
        });
    }
}

function inserirExercicio(evento) {
    const diaDoTreino = evento.target.dataset.diadotreino;

    const descricaoDoExercicio = document.querySelector(`#input-exercicio-${diaDoTreino}`).value;

    if (document.querySelector(`#input-exercicio-${diaDoTreino}`).value == "") {
        mensagens.mostrarMensagemDeErro("Não é possível inserir exercicio sem descricão!", false);
        return;
    }

    document.querySelector(`#input-exercicio-${diaDoTreino}`).value = "";


    exerciciosDoTreino.push({ diaDoTreino: diaDoTreino, descricao: descricaoDoExercicio });

    mostrarExerciciosDoTreino();
}


async function alterarTreino(evento) {
    const nomeTreino = document.querySelector("#nome-treino").value;
    const dataInicio = document.querySelector("#inicio-treino").value;
    const dataFim = document.querySelector("#fim-treino").value;
    const objetivo = document.querySelector("#objetivo-treino").value;

    const formulario = document.querySelector("#formulario");
    if (formulario.checkValidity() == false) {
        return false;
    }

    evento.preventDefault();

    try {
        await servicos.alterarTreino(token, idAluno, idTreino, nomeTreino, dataInicio, dataFim, objetivo, exerciciosDoTreino);
        window.location.href = `../dadosDoTreino/dadosDoTreino.html?idAssinante=${idAluno}&nomeAssinante=${nomeALuno}&idTreino=${idTreino}&treinoAtual=true#alunos`;
        mensagens.mostrarMensagemDeSucesso("Treino alterado com sucesso!", true);
    } catch (error) {
        erros.tratarErro(error);
    }
}

function mostrarExerciciosDoTreino() {
    document.querySelector(`#lista-exercicios-segunda`).innerHTML = "";
    document.querySelector(`#lista-exercicios-terca`).innerHTML = "";
    document.querySelector(`#lista-exercicios-quarta`).innerHTML = "";
    document.querySelector(`#lista-exercicios-quinta`).innerHTML = "";
    document.querySelector(`#lista-exercicios-sexta`).innerHTML = "";
    document.querySelector(`#lista-exercicios-sabado`).innerHTML = "";
    document.querySelector(`#lista-exercicios-domingo`).innerHTML = "";

    exerciciosDoTreino.forEach(exercicio => {

        document.querySelector(`#lista-exercicios-${exercicio.diaDoTreino}`).innerHTML = document.querySelector(`#lista-exercicios-${exercicio.diaDoTreino}`).innerHTML +
            `<li class="list-group-item lista-exercicios-treino mb-2 d-flex justify-content-between">
            ${exercicio.descricao}<i class="bi bi-trash3 btn-excluir-exercicio" data-diadotreino=${exercicio.diaDoTreino} data-descricao=${exercicio.descricao} style= "cursor: pointer"></i>
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

function voltarParaDadosDoAluno() {
    window.location.href = `../dadosDoAluno/dadosDoAluno.html?idAssinante=${idAluno}#alunos`;
}

function adicionarEventoExcluir() {
    const listaBtnExcluir = document.querySelectorAll(".btn-excluir-exercicio");
    listaBtnExcluir.forEach(element => {
        element.onclick = excluirExercicio;
    });
}

function excluirExercicio(evento) {
    const diaDoTreino = evento.target.dataset.diadotreino;
    const descricao = evento.target.dataset.descricao;

    exerciciosDoTreino = exerciciosDoTreino.filter(exercicio => filtrarExercicios(exercicio, diaDoTreino, descricao));

    mostrarExerciciosDoTreino();
}

function filtrarExercicios(exercicio, diaDoTreino, descricao) {
    if (exercicio.diaDoTreino == diaDoTreino) {
        if (exercicio.descricao == descricao) {
            return false;
        }
        else {
            return true;
        }
    } else {
        return true;
    }
}

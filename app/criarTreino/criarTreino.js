import * as servicos from "./servicosDeCriarTreino.js"
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";
import * as paginaMestra from "../paginaMestra/paginaMestra.js";
import * as mensagens from "../util/mensagens.js";

seguranca.deslogarSeTokenEstiverExpirado("/login/entrar.html");

window.onload = aoCarregarPagina;

let token;
let idAluno;
let nomeAluno;
let exerciciosDoTreino = [];

async function aoCarregarPagina() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    idAluno = params.idAssinante;
    nomeAluno = params.nomeAssinante;

    await paginaMestra.carregar("criarTreino/criarTreino-conteudo.html", "Criar Treino");

    document.querySelector("#nome-aluno").innerHTML = nomeAluno;

    document.querySelector("#inserir-exercicio-segunda").onclick = inserirExercicio;
    document.querySelector("#inserir-exercicio-terca").onclick = inserirExercicio;
    document.querySelector("#inserir-exercicio-quarta").onclick = inserirExercicio;
    document.querySelector("#inserir-exercicio-quinta").onclick = inserirExercicio;
    document.querySelector("#inserir-exercicio-sexta").onclick = inserirExercicio;
    document.querySelector("#inserir-exercicio-sabado").onclick = inserirExercicio;
    document.querySelector("#inserir-exercicio-domingo").onclick = inserirExercicio;

    document.querySelector("#btn-salvar-treino").onclick = gravarTreino;
    document.querySelector("#btn-voltar-para-dados-alunos").onclick = voltarParaDadosDoAluno;

    token = seguranca.pegarToken();

    mensagens.exibirMensagemAoCarregarAPagina();
}

function inserirExercicio(evento) {
    const diaDoTreino = evento.target.dataset.diadotreino;
    
    if(document.querySelector(`#input-exercicio-${diaDoTreino}`).value == "") {
        mensagens.mostrarMensagemDeErro("Não é possível inserir exercício sem descricão!", false);
        return;
    }

    const descricaoDoExercicio = document.querySelector(`#input-exercicio-${diaDoTreino}`).value;


    document.querySelector(`#input-exercicio-${diaDoTreino}`).value = "";


    exerciciosDoTreino.push({ diaDoTreino: diaDoTreino, descricao: descricaoDoExercicio });

    mostrarExerciciosDoTreino();

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


async function gravarTreino(evento) {
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
        const resposta = await servicos.salvarTreino(token, idAluno, nomeTreino, dataInicio, dataFim, objetivo, exerciciosDoTreino);
        mensagens.mostrarMensagemDeSucesso("Treino criado com sucesso!", true);
        window.location.href = `../dadosDoTreino/dadosDoTreino.html?idAssinante=${idAluno}&nomeAssinante=${nomeAluno}&idTreino=${resposta.idTreino}#alunos`;
    } catch (error) {
        erros.tratarErro(error);
    }
}

function voltarParaDadosDoAluno() {
    window.location.href = `../dadosDoAluno/dadosDoAluno.html?idAssinante=${idAluno}#alunos`;
}

import * as servicos from "./servicosDeDadosDoAluno.js"
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";
import * as paginaMestra from "../paginaMestra/paginaMestra.js";
import * as mensagens from "../util/mensagens.js";
import * as configuracoes from "../configuracoes.js";

seguranca.deslogarSeTokenEstiverExpirado("/login/entrar.html");

window.onload = aoCarregarPagina;

let idAluno;
let nomeAluno;
let idTreinoAtual;
let treinoAtual;

async function aoCarregarPagina() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    idAluno = params.idAssinante;

    await paginaMestra.carregar("dadosDoAluno/dadosDoAluno-conteudo.html", "Dados do Aluno");

    await buscarDadosDoAluno(idAluno);

    document.querySelector("#btn-treino-atual").onclick = irParaPaginaDeDadosDoTreino;
    document.querySelector("#btn-medidas").onclick = irParaPaginaDeMedidas;
    document.querySelector("#btn-novo-treino").onclick = irParaPaginaDeCriarTreino;

    mensagens.exibirMensagemAoCarregarAPagina();
}

async function buscarDadosDoAluno(idAssinante) {
    try {
        const token = seguranca.pegarToken();
        const resposta = await servicos.buscarDados(token, idAssinante);

        nomeAluno = resposta.nome;
        
        document.querySelector("#breadcrumb-nome-aluno").innerHTML = ` / ${resposta.nome}`;

        if (resposta.imagem) {
            document.querySelector("#imagem-aluno").setAttribute("src", `${configuracoes.urlDaApi}/${resposta.imagem}`);
        }

        document.querySelector("#nome-aluno").innerHTML = resposta.nome;
        document.querySelector("#objetivo-aluno").innerHTML = !resposta.objetivo ? "" : resposta.objetivo;
        document.querySelector("#idade-aluno").innerHTML = resposta.dataNascimento;
        document.querySelector("#altura-aluno").innerHTML = resposta.altura;
        document.querySelector("#peso-aluno").innerHTML = resposta.peso;
        document.querySelector("#pescoco-aluno").innerHTML = resposta.pescoco;
        document.querySelector("#cintura-aluno").innerHTML = resposta.cintura;
        document.querySelector("#quadril-aluno").innerHTML = resposta.quadril;
        document.querySelector("#imc-aluno").innerHTML = resposta.imc.toFixed(2);

        document.querySelector("#lista-treinos").innerHTML = "";

        if (resposta.treinos.length > 0) {
            idTreinoAtual = resposta.treinoAtual.idTreino;
            treinoAtual = resposta.treinoAtual.treinoAtual;

            resposta.treinos.filter(treino => treino.idTreino != idTreinoAtual).forEach(treino => {

                document.querySelector("#lista-treinos").innerHTML = document.querySelector("#lista-treinos").innerHTML +
                    `<tr>
                        <td data-label="Nome">${treino.nome}</td>
                        <td data-label="Ínicio">${new Date(treino.dataInicio).toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric', year: 'numeric' })}</td>
                        <td data-label="Fim">${new Date(treino.dataFim).toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric', year: 'numeric' })}</td>
                        <td data-label="Ver"><a href="../dadosDoTreino/dadosDoTreino.html?idAssinante=${idAluno}&nomeAssinante=${nomeAluno}&idTreino=${treino.idTreino}&treinoAtual=${treino.treinoAtual}#alunos" class="text-decoration-none link-dark"><i class="bi bi-eye fs-4 me-2"></i></a></td>
                    </tr>`;
            });
        }
        else {
            document.querySelector("#lista-treinos").innerHTML = document.querySelector("#lista-treinos").innerHTML +
                `<tr>
                    <td colspan="4">
                        Nenhum Treino encontrado
                    </td>
                </tr>`;
        }

    } catch (error) {
        erros.tratarErro(error);
    }
}

function irParaPaginaDeMedidas() {
    window.location.href = `../historicoDeMedidasDoAluno/historicoDeMedidasDoAluno.html?idAssinante=${idAluno}#alunos`;
}

function irParaPaginaDeCriarTreino() {
        window.location.href = `../criarTreino/criarTreino.html?idAssinante=${idAluno}&nomeAssinante=${nomeAluno}#alunos`;
}

function irParaPaginaDeDadosDoTreino() {
    if(!treinoAtual ) {
        mensagens.mostrarMensagemDeErro("O aluno ainda não tem treino!", false);
        return;
    }
    window.location.href = `../dadosDoTreino/dadosDoTreino.html?idAssinante=${idAluno}&nomeAssinante=${nomeAluno}&idTreino=${idTreinoAtual}&treinoAtual=${treinoAtual}#alunos`;

}


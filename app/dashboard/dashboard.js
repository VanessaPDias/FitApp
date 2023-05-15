import * as servicos from "./servicosDoDashboard.js"
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";
import * as paginaMestra from "../paginaMestra/paginaMestra.js";
import * as mensagens from "../util/mensagens.js";

seguranca.deslogarSeTokenEstiverExpirado("/login/entrar.html");

window.onload = aoCarregarPagina();

let idDietaAtual;
let idTreinoAtual;

async function aoCarregarPagina() {
    await paginaMestra.carregar("dashboard/dashboard-conteudo.html", "Inicio");
    await buscarDadosDoPerfil();

    document.querySelector("#btn-dieta-atual").onclick = irParaPaginaDeDadosDaDietaAssinante;
    document.querySelector("#btn-treino-atual").onclick = irParaPaginaDeDadosDoTreinoAssinante;
}

async function buscarDadosDoPerfil() {
    try {
        const token = seguranca.pegarToken();
        const resposta = await servicos.buscarDados(token);
        const ctx = document.querySelector("#myChart");

        document.querySelector("#altura").innerHTML = resposta.altura;
        document.querySelector("#peso").innerHTML = resposta.peso;
        document.querySelector("#idade").innerHTML = resposta.idade;
        document.querySelector("#imc").innerHTML = resposta.imc.toFixed(2);

        if (resposta.dietaAtual) {
            idDietaAtual = resposta.dietaAtual.idDieta;
        }

        if (resposta.treinoAtual) {
            idTreinoAtual = resposta.treinoAtual.idTreino;
        }

        criarGrafico(ctx, resposta.medidas);

    } catch (error) {
        erros.tratarErro(error);
    }
}


function criarGrafico(ctx, medidas) {
    return new Chart(ctx, {
        options: {
            responsive: true,
            aspectRatio: 1,
            maintainAspectRatio: false
        },
        type: 'line',
        data: {
            labels: medidas.map(medida => new Date(medida.data).toLocaleDateString("pt-BR", { year: "numeric", month: "numeric", day: "numeric" })),
            datasets: [{
                label: 'Peso',
                data: medidas.map(medida => medida.peso),
                borderWidth: 2,
                borderColor: '#548CA8',
                backgroundColor: '#548CA8',
            }]
        }
    });
}

function irParaPaginaDeDadosDaDietaAssinante() {
    if(!idDietaAtual ) {
        mensagens.mostrarMensagemDeErro("Você ainda não tem Dieta!", false);
        return;
    }
    window.location.href = `../dadosDaDietaAssinante/dadosDaDietaAssinante.html?idDieta=${idDietaAtual}#dietas`;

}

function irParaPaginaDeDadosDoTreinoAssinante() {
    if(!idTreinoAtual ) {
        mensagens.mostrarMensagemDeErro("Você ainda não tem Treino!", false);
        return;
    }
    window.location.href = `../dadosDoTreinoAssinante/dadosDoTreinoAssinante.html?idTreino=${idTreinoAtual}#treinos`;

}
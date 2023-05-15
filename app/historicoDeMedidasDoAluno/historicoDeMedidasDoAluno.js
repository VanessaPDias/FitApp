import * as servicos from "./servicosDeHistoricoDeMedidasDoAluno.js"
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";
import * as paginaMestra from "../paginaMestra/paginaMestra.js";

let chart;
const corChart = `#548CA8`;
let idAluno;

seguranca.deslogarSeTokenEstiverExpirado("/login/entrar.html");

window.onload = aoCarregarPagina;

async function aoCarregarPagina() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    idAluno = params.idAssinante;

    await paginaMestra.carregar("historicoDeMedidasDoAluno/historicoDeMedidasDoAluno-conteudo.html", "Histórico de Medidas do Aluno");

    await buscarMedidas();

    document.querySelector("#opcoes-medidas").onchange = buscarMedidas;
    document.querySelector("#data-inicio").onchange = buscarMedidas;
    document.querySelector("#data-fim").onchange = buscarMedidas;

    document.querySelector("#btn-voltar").onclick = irParaPaginaDeDadosDoAluno;
}

async function buscarMedidas() {
    try {
        const token = seguranca.pegarToken();
        const resposta = await servicos.buscarDados(token, idAluno);

        document.querySelector("#nome-aluno").innerHTML = resposta.nomeAluno;

        criarRelatorio(resposta.historicoDeMedidas);

    } catch (error) {
        erros.tratarErro(error);
    }
}

function criarRelatorio(medidas) {
    const medidaEscolhida = document.querySelector("#opcoes-medidas").value;
    let dataInicio = document.querySelector("#data-inicio").value;
    let dataFim = document.querySelector("#data-fim").value;

    if(dataInicio) {
        dataInicio = new Date(dataInicio);
        medidas = medidas.filter(medida => new Date(medida.data).getTime() >= dataInicio.getTime());
    }
    if(dataFim) {
        dataFim = new Date(dataFim);
        dataFim.setHours(23, 59, 59);
        medidas = medidas.filter(medida => new Date(medida.data).getTime() <= dataFim.getTime());
    }

    const ctx = document.querySelector("#myChart");
    criarGrafico(ctx, medidaEscolhida, medidas);
}

function criarGrafico(ctx, medidaEscolhida, medidas) {
    const datasets = new Array();

    if (medidaEscolhida == "peso") {
        datasets.push({
            label: 'Peso',
            data: medidas.map(medida => medida.peso),
            borderWidth: 2,
            borderColor: corChart,
            backgroundColor: corChart,
        });
    } else if (medidaEscolhida == "pescoco") {
        datasets.push({
            label: 'Pescoço',
            data: medidas.map(medida => medida.pescoco),
            borderWidth: 2,
            borderColor: corChart,
            backgroundColor: corChart,
        });
    } else if (medidaEscolhida == "cintura") {
        datasets.push({
            label: 'Cintura',
            data: medidas.map(medida => medida.cintura),
            borderWidth: 2,
            borderColor: corChart,
            backgroundColor: corChart,
        });
    } else if (medidaEscolhida == "quadril") {
        datasets.push({
            label: 'Quadril',
            data: medidas.map(medida => medida.quadril),
            borderWidth: 2,
            borderColor: corChart,
            backgroundColor: corChart,
        });
    }

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        options: {
            responsive: true,
            aspectRatio: 1,
            maintainAspectRatio: false
        },
        type: 'line',
        data: {
            labels: medidas.map(medida => new Date(medida.data).toLocaleDateString("pt-BR", { year: "numeric", month: "numeric", day: "numeric" })),
            datasets: datasets
        }
    });

    return chart;
}

function irParaPaginaDeDadosDoAluno() {
    window.location.href = `../dadosDoAluno/dadosDoAluno.html?idAssinante=${idAluno}#alunos`;
}
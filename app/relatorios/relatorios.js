import * as servicos from "./servicosDeRelatorios.js"
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";
import * as paginaMestra from "../paginaMestra/paginaMestra.js";

let chart;

if (!seguranca.tokenValido()) {
    window.location.href = "/app/login/entrar.html";
}

window.onload = aoCarregarPagina;

async function aoCarregarPagina() {
    await paginaMestra.carregar("relatorios/relatorios-conteudo.html", "Relatórios");
    await buscarMedidas();
    document.querySelector("#opcoes-medidas").onchange = buscarMedidas;
    document.querySelector("#data-inicio").onchange = buscarMedidas;
    document.querySelector("#data-fim").onchange = buscarMedidas;
}

async function buscarMedidas() {
    try {
        const token = seguranca.pegarToken();
        const resposta = await servicos.buscarDados(token);

        criarRelatorio(resposta.historicoMedidas);

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
            borderColor: '#FED233',
            backgroundColor: '#FED233',
        });
    } else if (medidaEscolhida == "pescoco") {
        datasets.push({
            label: 'Pescoço',
            data: medidas.map(medida => medida.pescoco),
            borderWidth: 2,
            borderColor: '#FED233',
            backgroundColor: '#FED233',
        });
    } else if (medidaEscolhida == "cintura") {
        datasets.push({
            label: 'Cintura',
            data: medidas.map(medida => medida.cintura),
            borderWidth: 2,
            borderColor: '#FED233',
            backgroundColor: '#FED233',
        });
    } else if (medidaEscolhida == "quadril") {
        datasets.push({
            label: 'Quadril',
            data: medidas.map(medida => medida.quadril),
            borderWidth: 2,
            borderColor: '#FED233',
            backgroundColor: '#FED233',
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
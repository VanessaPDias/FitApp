import * as servicos from "./servicosDoDashboard.js"
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";
import * as paginaMestra from "../paginaMestra/paginaMestra.js";

seguranca.deslogarSeTokenEstiverExpirado("/login/entrar.html");

window.onload = aoCarregarPagina();

async function aoCarregarPagina() {
    await paginaMestra.carregar("dashboard/dashboard-conteudo.html", "Inicio");
    await buscarDadosDoPerfil();
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
            labels: medidas.map(medida => new Date(medida.data).toLocaleDateString("pt-BR", {year: "numeric", month: "numeric", day: "numeric"})),
            datasets: [{
                label: 'Peso',
                data: medidas.map(medida => medida.peso),
                borderWidth: 2,
                borderColor: '#FED233',
                backgroundColor: '#FED233',
            }]
        }
    });
}
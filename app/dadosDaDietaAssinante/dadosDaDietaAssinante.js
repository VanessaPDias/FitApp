import * as servicos from "./servicosDeDadosDaDietaAssinante.js"
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";
import * as paginaMestra from "../paginaMestra/paginaMestra.js";
import * as mensagens from "../util/mensagens.js";

seguranca.deslogarSeTokenEstiverExpirado("/login/entrar.html");

window.onload = aoCarregarPagina;

let token;
let idDieta;
let itensDaDieta = [];

async function aoCarregarPagina() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    idDieta = params.idDieta;

    await paginaMestra.carregar("dadosDaDietaAssinante/dadosDaDietaAssinante-conteudo.html", "Dados da Dieta");

    token = seguranca.pegarToken();
    buscarDadosDaDieta();
    mensagens.exibirMensagemAoCarregarAPagina();
}

async function buscarDadosDaDieta() {

    try {
        const resposta = await servicos.buscarDietaPorId(token, idDieta);
        itensDaDieta = resposta.itens;

        document.querySelector("#nome-dieta").innerHTML = resposta.nome;
        document.querySelector("#objetivo-dieta").innerHTML = resposta.objetivo;
        document.querySelector("#inicio-dieta").innerHTML = new Date(resposta.dataInicio).toLocaleString('pt-BR', { day: 'numeric', month: 'numeric', year: 'numeric' });
        document.querySelector("#fim-dieta").innerHTML = new Date(resposta.dataFim).toLocaleString('pt-BR', { day: 'numeric', month: 'numeric', year: 'numeric' });

        mostrarItensDaDieta();
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
            `<li class="list-group-item lista-itens-dieta"><i class="bi bi-arrow-right-short me-2"></i>${item.descricao}</li>`;
    });


}


function voltarParaDadosDoPaciente() {
    window.location.href = `../dadosDoPaciente/dadosDoPaciente.html?idAssinante=${idPaciente}#pacientes`;
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

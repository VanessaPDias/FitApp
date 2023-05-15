import * as servicos from "./servicosDeHistoricoDeTreinosDoAssinante.js"
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";
import * as paginaMestra from "../paginaMestra/paginaMestra.js";

seguranca.deslogarSeTokenEstiverExpirado("/login/entrar.html");

window.onload = aoCarregarPagina();

async function aoCarregarPagina() {

    await paginaMestra.carregar("historicoDeTreinosDoAssinante/historicoDeTreinosDoAssinante-conteudo.html", "Treinos");

    buscarTreinos();

    document.querySelector("#btn-pesquisar").onclick = buscarTreinos;

}

async function buscarTreinos() {
    try {
        const token = seguranca.pegarToken();
        const resposta = await servicos.buscarDados(token, document.querySelector("#input-pesquisar").value);

        document.querySelector("#lista-treinos").innerHTML = "";

        if (resposta.length > 0) {
            resposta.forEach(treino => {
                
                let objetivo = !treino.objetivo ? `- - -` : treino.objetivo;
                const dataInicio = new Date(treino.dataInicio).toLocaleString('pt-BR', { day: 'numeric', month: 'numeric', year: 'numeric' });
                const dataFim = new Date(treino.dataFim).toLocaleString('pt-BR', { day: 'numeric', month: 'numeric', year: 'numeric' });
                 
                document.querySelector("#lista-treinos").innerHTML = document.querySelector("#lista-treinos").innerHTML +
                    `<tr>
                        <td data-label="Nome">${treino.nome}</td>
                        <td data-label="Objetivo">${objetivo}</td>
                        <td data-label="Início">${dataInicio}</td>
                        <td data-label="Fim">${dataFim}</td>
                        <td data-label="Ver"><a href="../dadosDoTreinoAssinante/dadosDoTreinoAssinante.html?idTreino=${treino.idTreino}#treinos" class="text-decoration-none link-dark"><i class="bi bi-eye fs-4 me-2"></i></a></td>
                    </tr>`;
            });
        }
        else {
            document.querySelector("#lista-treinos").innerHTML = document.querySelector("#lista-treinos").innerHTML +
                `<tr>
                    <td colspan="4">
                        Nenhum Treino encontrado.
                    </td>
                </tr>`;
        }


    } catch (error) {
        erros.tratarErro(error);
    }
}

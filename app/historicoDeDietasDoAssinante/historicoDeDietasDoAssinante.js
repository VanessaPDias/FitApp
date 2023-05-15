import * as servicos from "./servicosDeHistoricoDeDietasDoAssinante.js"
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";
import * as paginaMestra from "../paginaMestra/paginaMestra.js";

seguranca.deslogarSeTokenEstiverExpirado("/login/entrar.html");

window.onload = aoCarregarPagina();

async function aoCarregarPagina() {

    await paginaMestra.carregar("historicoDeDietasDoAssinante/historicoDeDietasDoAssinante-conteudo.html", "Dietas");

    buscarDietas();

    document.querySelector("#btn-pesquisar").onclick = buscarDietas;

}

async function buscarDietas() {
    try {
        const token = seguranca.pegarToken();
        const resposta = await servicos.buscarDados(token, document.querySelector("#input-pesquisar").value);

        document.querySelector("#lista-dietas").innerHTML = "";

        if (resposta.length > 0) {
            resposta.forEach(dieta => {
                
                let objetivo = !dieta.objetivo ? `- - -` : dieta.objetivo;
                const dataInicio = new Date(dieta.dataInicio).toLocaleString('pt-BR', { day: 'numeric', month: 'numeric', year: 'numeric' });
                const dataFim = new Date(dieta.dataFim).toLocaleString('pt-BR', { day: 'numeric', month: 'numeric', year: 'numeric' });
                 
                document.querySelector("#lista-dietas").innerHTML = document.querySelector("#lista-dietas").innerHTML +
                    `<tr>
                        <td data-label="Nome">${dieta.nome}</td>
                        <td data-label="Objetivo">${objetivo}</td>
                        <td data-label="Início">${dataInicio}</td>
                        <td data-label="Fim">${dataFim}</td>
                        <td data-label="Ver"><a href="../dadosDaDietaAssinante/dadosDaDietaAssinante.html?idDieta=${dieta.idDieta}#dietas" class="text-decoration-none link-dark"><i class="bi bi-eye fs-4 me-2"></i></a></td>
                    </tr>`;
            });
        }
        else {
            document.querySelector("#lista-dietas").innerHTML = document.querySelector("#lista-dietas").innerHTML +
                `<tr>
                    <td colspan="4">
                        Nenhuma Dieta encontrada.
                    </td>
                </tr>`;
        }


    } catch (error) {
        erros.tratarErro(error);
    }
}

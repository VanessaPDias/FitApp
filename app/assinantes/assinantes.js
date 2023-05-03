import * as servicos from "./servicosDeAssinantes.js"
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";
import * as paginaMestra from "../paginaMestra/paginaMestra.js";

seguranca.deslogarSeTokenEstiverExpirado("/login/entrar.html");

window.onload = aoCarregarPagina;

async function aoCarregarPagina() {

    await paginaMestra.carregar("assinantes/assinantes-conteudo.html", "Assinantes");

    await buscarAssinantes();

    document.querySelector("#btn-pesquisar").onclick = buscarAssinantes;

}

async function buscarAssinantes() {

    try {
        const nome = document.querySelector("#input-nome-assinante").value;
        const status = document.querySelector("#input-select-status").value;

        const token = seguranca.pegarToken();
        const resposta = await servicos.buscarDados(token, nome, status);

        document.querySelector("#lista-assinantes").innerHTML = "";

        if (resposta.length > 0) {
            resposta.forEach(assinante => {

                let status;

                if (assinante.bloqueado == false) {
                    status = "Desbloqueado"
                    
                } else {
                    status = "Bloqueado"
                }

                document.querySelector("#lista-assinantes").innerHTML = document.querySelector("#lista-assinantes").innerHTML +
                    `<tr>
                        <td data-label="Nome">${assinante.nome}</td>
                        <td data-label="Email">${assinante.email}</td>
                        <td data-label="Status">${status}</td>
                        <td data-label="Ver"><a href="../dadosDoAssinante/dadosDoAssinante.html?idAssinante=${assinante.idAssinante}#assinantes" class="text-decoration-none link-dark"><i class="bi bi-eye fs-4 me-2"></i></a></td>
                    </tr>`;
            });
        }
        else {
            document.querySelector("#lista-assinantes").innerHTML = document.querySelector("#lista-assinantes").innerHTML +
                `<tr>
                    <td colspan="4">
                        Nenhum Assinante encontrado
                    </td>
                </tr>`;
        }


    } catch (error) {
        erros.tratarErro(error);
    }
}

import * as servicos from "./servicosDeNutricionistas.js"
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";
import * as paginaMestra from "../paginaMestra/paginaMestra.js";

seguranca.deslogarSeTokenEstiverExpirado("/login/entrar.html");

window.onload = aoCarregarPagina;

async function aoCarregarPagina() {

    await paginaMestra.carregar("nutricionistas/nutricionistas-conteudo.html", "Nutricionistas");

    await buscarNutricionistas();

    document.querySelector("#btn-pesquisar").onclick = buscarNutricionistas;

}

async function buscarNutricionistas() {
    try {
        const nome = document.querySelector("#input-pesquisar").value;
        const status = document.querySelector("#input-select-status").value;
        const cadastro = document.querySelector("#input-select-cadastro").value;

        const token = seguranca.pegarToken();
        
        const resposta = await servicos.buscarDados(token,nome, status, cadastro);

        document.querySelector("#lista-nutricionistas").innerHTML = "";

        if (resposta.length > 0) {
            resposta.forEach(nutricionista => {

                let status;
                let cadastroConfirmado;

                if (nutricionista.bloqueado == false) {
                    status = `Desbloqueado`

                } else {
                    status = `Bloqueado`
                }

                if (nutricionista.cadastroConfirmado == 0) {
                    cadastroConfirmado = `<i class="bi bi-question-lg fs-4 me-2"></i>`

                } else if (nutricionista.cadastroConfirmado == 1){
                    cadastroConfirmado = `<i class="bi bi-check-lg fs-4 me-2"></i>`

                } else {
                    cadastroConfirmado = `<i class="bi bi-x-lg fs-4 me-2"></i>`
                }


                document.querySelector("#lista-nutricionistas").innerHTML = document.querySelector("#lista-nutricionistas").innerHTML +
                    `<tr>
                        <td data-label="Nome">${nutricionista.nome}</td>
                        <td data-label="Email">${nutricionista.email}</td>
                        <td data-label="Status">${status}</td>
                        <td data-label="Cadastro">${cadastroConfirmado}</td>
                        <td data-label="Ver"><a href="../dadosDoNutricionista/dadosDoNutricionista.html?idNutri=${nutricionista.idNutri}" class="text-decoration-none link-dark"><i class="bi bi-eye fs-4 me-2"></i></a></td>
                    </tr>`;
            });
        }
        else {
            document.querySelector("#lista-nutricionistas").innerHTML = document.querySelector("#lista-nutricionistas").innerHTML +
                `<tr>
                    <td colspan="5">
                        Nenhum Nutricionista encontrado.
                    </td>
                </tr>`;
        }


    } catch (error) {
        erros.tratarErro(error);
    }
}



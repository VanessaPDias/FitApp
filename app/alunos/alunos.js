import * as servicos from "./servicosDeAlunos.js"
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";
import * as paginaMestra from "../paginaMestra/paginaMestra.js";

seguranca.deslogarSeTokenEstiverExpirado("/login/entrar.html");

window.onload = aoCarregarPagina();

async function aoCarregarPagina() {

    await paginaMestra.carregar("alunos/alunos-conteudo.html", "Alunos");

    await buscarAlunos();

    document.querySelector("#btn-pesquisar").onclick = buscarAlunos;

}

async function buscarAlunos() {
    try {
        const token = seguranca.pegarToken();
        const resposta = await servicos.buscarDados(token, document.querySelector("#input-pesquisar").value);

        document.querySelector("#lista-alunos").innerHTML = "";

        if (resposta.length > 0) {
            resposta.forEach(aluno => {
                
                let objetivo = !aluno.objetivo ? `- - -` : aluno.objetivo;
                 
                document.querySelector("#lista-alunos").innerHTML = document.querySelector("#lista-alunos").innerHTML +
                    `<tr>
                        <td data-label="Nome">${aluno.nome}</td>
                        <td data-label="Objetivo">${objetivo}</td>
                        <td data-label="Ver"><a href="../dadosDoAluno/dadosDoAluno.html?idAssinante=${aluno.idAssinante}#alunos" class="text-decoration-none link-dark"><i class="bi bi-eye fs-4 me-2"></i></a></td>
                    </tr>`;
            });
        }
        else {
            document.querySelector("#lista-alunos").innerHTML = document.querySelector("#lista-alunos").innerHTML +
                `<tr>
                    <td colspan="4">
                        Nenhum Aluno encontrado
                    </td>
                </tr>`;
        }


    } catch (error) {
        erros.tratarErro(error);
    }
}

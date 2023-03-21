import * as servicos from "./servicosDePacientes.js"
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";
import * as paginaMestra from "../paginaMestra/paginaMestra.js";

seguranca.deslogarSeTokenEstiverExpirado("/login/entrar.html");

window.onload = aoCarregarPagina();

async function aoCarregarPagina() {

    await paginaMestra.carregar("pacientes/pacientes-conteudo.html", "Pacientes");

    await buscarPacientes();

    document.querySelector("#btn-pesquisar").onclick = buscarPacientes;

}

async function buscarPacientes() {
    try {
        const token = seguranca.pegarToken();
        const resposta = await servicos.buscarDados(token, document.querySelector("#input-pesquisar").value);

        document.querySelector("#lista-pacientes").innerHTML = "";

        if (resposta.length > 0) {
            resposta.forEach(paciente => {
                
                let objetivo = !paciente.objetivo ? `- - -` : paciente.objetivo;
                 
                document.querySelector("#lista-pacientes").innerHTML = document.querySelector("#lista-pacientes").innerHTML +
                    `<tr>
                        <td>${paciente.nome}</td>
                        <td>${objetivo}</td>
                        <td><a href="../dadosDoPaciente/dadosDoPaciente.html?idAssinante=${paciente.idAssinante}" class="text-decoration-none link-dark"><i class="bi bi-eye fs-4 me-2"></i></a></td>
                    </tr>`;
            });
        }
        else {
            document.querySelector("#lista-pacientes").innerHTML = document.querySelector("#lista-pacientes").innerHTML +
                `<tr>
                    <td colspan="4">
                        Nenhum Paciente encontrado
                    </td>
                </tr>`;
        }


    } catch (error) {
        erros.tratarErro(error);
    }
}

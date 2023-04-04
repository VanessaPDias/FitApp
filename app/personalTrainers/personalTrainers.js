import * as servicos from "./servicosDePersonalTrainers.js"
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";
import * as paginaMestra from "../paginaMestra/paginaMestra.js";

seguranca.deslogarSeTokenEstiverExpirado("/login/entrar.html");

window.onload = aoCarregarPagina;

async function aoCarregarPagina() {

    await paginaMestra.carregar("personalTrainers/personalTrainers-conteudo.html", "Personal Trainers");

    await buscarPersonalTrainers();

    document.querySelector("#btn-pesquisar").onclick = buscarPersonalTrainers;

}

async function buscarPersonalTrainers() {
    try {
        const nome = document.querySelector("#input-pesquisar").value;
        const status = document.querySelector("#input-select-status").value;
        const cadastro = document.querySelector("#input-select-cadastro").value;

        const token = seguranca.pegarToken();
        
        const resposta = await servicos.buscarDados(token, nome, status, cadastro);

        document.querySelector("#lista-personal-trainers").innerHTML = "";

        if (resposta.length > 0) {
            resposta.forEach(personalTrainer => {

                let status;
                let cadastroConfirmado;

                if (personalTrainer.bloqueado == false) {
                    status = `Desbloqueado`

                } else {
                    status = `Bloqueado`
                }

                if (personalTrainer.cadastroConfirmado == 0) {
                    cadastroConfirmado = `<i class="bi bi-question-lg fs-4 me-2"></i>`

                } else if (personalTrainer.cadastroConfirmado == 1){
                    cadastroConfirmado = `<i class="bi bi-check-lg fs-4 me-2"></i>`

                } else {
                    cadastroConfirmado = `<i class="bi bi-x-lg fs-4 me-2"></i>`
                }


                document.querySelector("#lista-personal-trainers").innerHTML = document.querySelector("#lista-personal-trainers").innerHTML +
                    `<tr>
                        <td data-label="Nome">${personalTrainer.nome}</td>
                        <td data-label="Email">${personalTrainer.email}</td>
                        <td data-label="Status">${status}</td>
                        <td data-label="Cadstro">${cadastroConfirmado}</td>
                        <td data-label="Ver"><a href="../dadosDoPersonal/dadosDoPersonal.html?idPersonal=${personalTrainer.idPersonal}" class="text-decoration-none link-dark"><i class="bi bi-eye fs-4 me-2"></i></a></td>
                    </tr>`;
            });
        }
        else {
            document.querySelector("#lista-personal-trainers").innerHTML = document.querySelector("#lista-personal-trainers").innerHTML +
                `<tr>
                    <td colspan="5">
                        Nenhum Personal Trainer encontrado.
                    </td>
                </tr>`;
        }


    } catch (error) {
        erros.tratarErro(error);
    }
}



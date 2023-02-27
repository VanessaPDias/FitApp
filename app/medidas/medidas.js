import * as servicos from "./servicosDeMedidas.js";
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";
import * as paginaMestra from "../paginaMestra/paginaMestra.js";
import * as mensagens from "../util/mensagens.js";


seguranca.deslogarSeTokenEstiverExpirado("/login/entrar.html");

window.onload = aoCarregarPagina;

async function aoCarregarPagina() {
    await paginaMestra.carregar("medidas/medidas-conteudo.html", "Medidas");
    await buscarMedidas();
    document.querySelector("#btn-salvarMedidas").onclick = inserirMedidas;
    mensagens.exibirMensagemAoCarregarAPagina();

}

async function buscarMedidas() {
    try {
        const token = seguranca.pegarToken();
        const resposta = await servicos.buscarDados(token);

        document.querySelector("#peso").innerHTML = resposta.medidasAtuais.peso;
        document.querySelector("#pescoco").innerHTML = resposta.medidasAtuais.pescoco;
        document.querySelector("#cintura").innerHTML = resposta.medidasAtuais.cintura;
        document.querySelector("#quadril").innerHTML = resposta.medidasAtuais.quadril;

        if (resposta.historicoDeMedidas.length == 0) {
            document.querySelector("#historico-medidas").innerHTML =
                `<tr>
                <td><i class="bi bi-dash-lg"></i><i class="bi bi-dash-lg"></i></td>
                <td><i class="bi bi-dash-lg"></i><i class="bi bi-dash-lg"></i></td>
                <td><i class="bi bi-dash-lg"></i><i class="bi bi-dash-lg"></i></td>
                <td><i class="bi bi-dash-lg"></i><i class="bi bi-dash-lg"></i></td>
                <td><i class="bi bi-dash-lg"></i><i class="bi bi-dash-lg"></i></td>
                </tr>`;
        } else {
            resposta.historicoDeMedidas.forEach(medida => {
                document.querySelector("#historico-medidas").innerHTML = document.querySelector("#historico-medidas").innerHTML +
                    `<tr>
                <td>${new Date(medida.data).toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric', year: 'numeric' })}</td>
                <td>${medida.peso} kg</td>
                <td>${medida.pescoco} cm</td>
                <td>${medida.cintura} cm</td>
                <td>${medida.quadril} cm</td>
                <td><i class="bi bi-trash3 btn-excluirMedidas" data-idmedida=${medida.idMedidas}></i></td>
                </tr>`;
            });
        }

        adicionarEventoExcluir();

    } catch (error) {
        erros.tratarErro(error);
    }
}

function adicionarEventoExcluir() {
    const listaBtnExcluir = document.querySelectorAll(".btn-excluirMedidas");
    listaBtnExcluir.forEach(element => {
        element.onclick = excluirMedidas;
    });
}

async function inserirMedidas(evento) {
    const peso = document.querySelector("#form-peso").value;
    const pescoco = document.querySelector("#form-pescoco").value;
    const cintura = document.querySelector("#form-cintura").value;
    const quadril = document.querySelector("#form-quadril").value;
    const token = seguranca.pegarToken();

    const formulario = document.querySelector("#formulario");
    if (formulario.checkValidity() == false) {
        return false;
    }

    evento.preventDefault();

    try {
        await servicos.salvarMedidas(token, peso, pescoco, cintura, quadril);
        mensagens.mostrarMensagemDeSucesso("Medidas inseridas com sucesso!", true);
        window.location.reload();
    } catch (error) {
        erros.tratarErro(error);
    }
}

async function excluirMedidas(evento) {
    const idMedidas = evento.target.dataset.idmedida;
    const token = seguranca.pegarToken();
    try {
        await servicos.excluirMedidas(token, idMedidas);
        mensagens.mostrarMensagemDeSucesso("Medidas excluídas com sucesso!", true);
        window.location.reload();
    } catch (error) {
        erros.tratarErro(error);
    }
}
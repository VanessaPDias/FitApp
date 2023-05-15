import * as servicos from "./servicosDeDadosDaMensagem.js";
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";
import * as paginaMestra from "../paginaMestra/paginaMestra.js";
import * as mensagens from "../util/mensagens.js";

seguranca.deslogarSeTokenEstiverExpirado("/login/entrar.html");

window.onload = aoCarregarPagina;

let idMensagem;
let mensagem;
let modalExcluirMensagem;

async function aoCarregarPagina() {

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    idMensagem = params.idMensagem;

    await paginaMestra.carregar("dadosDaMensagem/dadosDaMensagem-conteudo.html", "Mensagem");

    document.querySelector("#modal-responder-mensagem").addEventListener("show.bs.modal", abrirModalResponderMensagem);
    document.querySelector("#btn-enviar-mensagem").onclick = enviarResposta;
    document.querySelector("#btn-confirmar-excluir-mensagem").onclick = excluirMensagem;

    const tipoDeMensagem = localStorage.getItem("fitapp_tipo_mensagem");

    if(tipoDeMensagem == "Recebidas") {
        document.querySelector("#tipo-de-mensagem").innerHTML = `Recebidas`
    }

    if(tipoDeMensagem == "Enviadas") {
        document.querySelector("#tipo-de-mensagem").innerHTML = `Enviadas`
    }

    if(tipoDeMensagem == "Excluídas") {
        document.querySelector("#tipo-de-mensagem").innerHTML = `Excluídas`
    }

    if(tipoDeMensagem !== "Recebidas") {
        document.querySelector("#btn-responder-mensagem").hidden = true;
        document.querySelector("#btn-excluir-mensagem").hidden = true;
    }

    buscarMensagemPorId();
    mensagens.exibirMensagemAoCarregarAPagina();
}


async function buscarMensagemPorId() {
    const remetente = document.querySelector("#remetente");
    const assunto = document.querySelector("#assunto");
    const textoMensagem = document.querySelector("#texto-mensagem");

    const token = seguranca.pegarToken();

    try {
        mensagem = await servicos.buscarDadosDaMensagem(token, idMensagem);

        remetente.innerHTML = `${mensagem.nomeRemetente} - ${mensagem.emailRemetente}`;
        assunto.innerHTML = mensagem.assunto;
        textoMensagem.value = mensagem.texto;

    } catch (error) {
        erros.tratarErro(error);
    }
}

function abrirModalResponderMensagem() {

    document.querySelector("#form-destinatario").value = `${mensagem.nomeRemetente} - ${mensagem.emailRemetente}`;
    document.querySelector("#form-assunto").value = mensagem.assunto;

}

async function enviarResposta() {
    const texto = document.querySelector("#form-texto").value;

    const token = seguranca.pegarToken();

    try {
        await servicos.salvarMensagem(token, idMensagem, texto);
        mensagens.mostrarMensagemDeSucesso("Mensagem enviada com sucesso!", true);
        window.location.reload();

    } catch (error) {
        erros.tratarErro(error);
    }
}

async function excluirMensagem() {
    const token = seguranca.pegarToken();
    if (!modalExcluirMensagem) {
        modalExcluirMensagem = new bootstrap.Modal("#modal-excluir-mensagem");
    }
    modalExcluirMensagem.hide();

    try {
        await servicos.excluirMensagem(token, idMensagem);
        mensagens.mostrarMensagemDeSucesso("Mensagem excluída com sucesso!", true);
        window.location.href = "../mensagens/mensagens.html#mensagens";
    } catch (error) {
        erros.tratarErro(error);
    }
}



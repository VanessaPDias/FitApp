import * as servicos from "./servicosDeMensagens.js"
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";
import * as paginaMestra from "../paginaMestra/paginaMestra.js";
import * as mensagens from "../util/mensagens.js";

seguranca.deslogarSeTokenEstiverExpirado("/login/entrar.html");

window.onload = aoCarregarPagina;

let modal;

async function aoCarregarPagina() {
    await paginaMestra.carregar("mensagens/mensagens-conteudo.html", "Mensagens");

    buscarMensagensRecebidas();

    document.querySelector("#btn-enviar-mensagem").onclick = enviarMensagem;
    document.querySelector("#btn-mensagem-recebidas").onclick = buscarMensagensRecebidas;
    document.querySelector("#btn-mensagem-enviadas").onclick = buscarMensagensEnviadas;
    document.querySelector("#btn-mensagem-excluidas").onclick = buscarMensagensExcluidas;

    mensagens.exibirMensagemAoCarregarAPagina();
}

async function enviarMensagem(evento) {
    const destinatario = document.querySelector("#form-destinatario").value;
    const assunto = document.querySelector("#form-assunto").value;
    const texto = document.querySelector("#form-texto").value;

    const formulario = document.querySelector("#formulario");
    if (formulario.checkValidity() == false) {
        return false;
    }

    evento.preventDefault();

    const token = seguranca.pegarToken();

    try {
        await servicos.salvarMensagem(token, destinatario, assunto, texto);
        mensagens.mostrarMensagemDeSucesso("Mensagem enviada com sucesso!", true);
        window.location.reload();

    } catch (error) {
        erros.tratarErro(error);
    }
}

async function buscarMensagensRecebidas() {

    const token = seguranca.pegarToken();

    try {
        mostarMensagens(await servicos.buscarRecebidas(token), "Recebidas");

    } catch (error) {
        erros.tratarErro(error);
    }
}

async function buscarMensagensEnviadas() {

    const token = seguranca.pegarToken();

    try {
        mostarMensagens(await servicos.buscarEnviadas(token), "Enviadas");

    } catch (error) {
        erros.tratarErro(error);
    }
}

async function buscarMensagensExcluidas() {

    const token = seguranca.pegarToken();

    try {
        mostarMensagens(await servicos.buscarExcluidas(token), "Excluídas");

    } catch (error) {
        erros.tratarErro(error);
    }
}

function mostarMensagens(listaDeMensagens, tipo) {

    document.querySelector("#lista-mensagens").innerHTML = "";
    document.querySelector("#tipo-de-mensagem").innerHTML = tipo;

    if (listaDeMensagens.length > 0) {
        listaDeMensagens.forEach(mensagem => {
            document.querySelector(`#lista-mensagens`).innerHTML = document.querySelector(`#lista-mensagens`).innerHTML +
                `<a href="#" class="list-group-item list-group-item-action">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1">${mensagem.nomeDestinatario}</h5>
                            <small class="text-body-secondary">${new Date(mensagem.data).toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric', year: 'numeric' })}</small>
                        </div>
                        <div class="d-flex w-100 justify-content-between">
                            <p class="mb-1">${mensagem.assunto}</p>
                            <i class="bi bi-trash3 btn-excluir-mensagem"  data-idmensagem="${mensagem.idMensagem}" style= "cursor: pointer"></i>
                        </div>
                    </a>`;
        });
    }
    else {
        document.querySelector("#lista-mensagens").innerHTML = document.querySelector("#lista-mensagens").innerHTML +
            `<span>
                    Nenhuma mensagem encontrada                            
                </span>`;
    }
}


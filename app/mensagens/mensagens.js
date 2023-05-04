import * as servicos from "./servicosDeMensagens.js";
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";
import * as paginaMestra from "../paginaMestra/paginaMestra.js";
import * as mensagens from "../util/mensagens.js";

seguranca.deslogarSeTokenEstiverExpirado("/login/entrar.html");

window.onload = aoCarregarPagina;

const chaveTipoDeMensagem = "fitapp_tipo_mensagem";
let tipoDeMensagem;



async function aoCarregarPagina() {
    await paginaMestra.carregar("mensagens/mensagens-conteudo.html", "Mensagens");

    const valorDaChave = localStorage.getItem(chaveTipoDeMensagem);

    if(!valorDaChave || valorDaChave == "Recebidas") {
        buscarMensagensRecebidas()
    }
    if(valorDaChave == "Enviadas") {
        buscarMensagensEnviadas()
    }
    if(valorDaChave == "Excluídas") {
        buscarMensagensExcluidas()
    }
    

    document.querySelector("#btn-enviar-mensagem").onclick = enviarMensagem;
    document.querySelector("#btn-mensagens-recebidas").onclick = buscarMensagensRecebidas;
    document.querySelector("#btn-mensagens-enviadas").onclick = buscarMensagensEnviadas;
    document.querySelector("#btn-mensagens-excluidas").onclick = buscarMensagensExcluidas;
    document.querySelector("#btn-confirmar-excluir-mensagem").onclick = excluirMensagem;

    mensagens.exibirMensagemAoCarregarAPagina();
}

function marcarLinkMenu(btn) {
    const linksDoMenu = document.querySelectorAll("#menu-mensagens .list-group-item");

    linksDoMenu.forEach(elemento => {
        elemento.classList.remove("active");
    })

    btn.classList.add("active");
    localStorage.removeItem(chaveTipoDeMensagem);
    localStorage.setItem(chaveTipoDeMensagem, tipoDeMensagem);
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

    tipoDeMensagem = "Recebidas"

    marcarLinkMenu(document.querySelector("#btn-mensagens-recebidas"));

    const token = seguranca.pegarToken();

    try {
        listarMensagens(await servicos.buscarRecebidas(token), tipoDeMensagem);

    } catch (error) {
        erros.tratarErro(error);
    }
}

async function buscarMensagensEnviadas() {

    tipoDeMensagem = "Enviadas";

    marcarLinkMenu(document.querySelector("#btn-mensagens-enviadas"));

    const token = seguranca.pegarToken();

    try {
        listarMensagens(await servicos.buscarEnviadas(token), tipoDeMensagem);

    } catch (error) {
        erros.tratarErro(error);
    }
}

async function buscarMensagensExcluidas() {

    tipoDeMensagem = "Excluídas";

    marcarLinkMenu(document.querySelector("#btn-mensagens-excluidas"));

    const token = seguranca.pegarToken();

    try {
        listarMensagens(await servicos.buscarExcluidas(token), tipoDeMensagem);

    } catch (error) {
        erros.tratarErro(error);
    }
}

function listarMensagens(listaDeMensagens, tipo) {

    document.querySelector("#lista-mensagens").innerHTML = "";
    document.querySelector("#tipo-de-mensagem").innerHTML = tipo;

    if (listaDeMensagens.length > 0) {

        listaDeMensagens.forEach(mensagem => {

            if (tipo == "Recebidas") {
                document.querySelector(`#lista-mensagens`).innerHTML = document.querySelector(`#lista-mensagens`).innerHTML +
                    `<div class="list-group-item list-group-item-action" ">
                        <div class="row">
                            <div class="col">
                                <h6 class="mb-1">${mensagem.nomeRemetente}</h6>
                                <p class="mb-1">${mensagem.assunto}</p>
                            </div>
                            <div class="col text-end">
                                <small class="text-body-secondary">${new Date(mensagem.data).toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric', year: 'numeric' })}</small>
                                <div class="row justify-content-between pt-2">
                                    <div class="col-8"></div>
                                    <div class="col-2 text-end">
                                        <a href="../dadosDaMensagem/dadosDaMensagem.html?idMensagem=${mensagem.idMensagem}#mensagens" class="col-2 text-end link-dark">
                                            <i class="col bi bi-eye btn-ver-mensagem fs-5"></i>
                                        </a>
                                    </div>
                                    <div class="col-2 text-end">
                                        <a href="#" class="col-2 text-end link-dark">
                                            <i class="col bi-trash3 btn-excluir-mensagem" data-bs-toggle="modal" data-bs-target="#modal-excluir-mensagem" data-idmensagem="${mensagem.idMensagem}"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
            }

            if (tipo == "Enviadas") {
                document.querySelector(`#lista-mensagens`).innerHTML = document.querySelector(`#lista-mensagens`).innerHTML +
                    `<div class="list-group-item list-group-item-action" ">
                        <div class="row">
                            <div class="col">
                                <h6 class="mb-1">${mensagem.nomeDestinatario}</h6>
                                <p class="mb-1">${mensagem.assunto}</p>
                            </div>
                            <div class="col text-end">
                                <small class="text-body-secondary">${new Date(mensagem.data).toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric', year: 'numeric' })}</small>
                                <div class="row justify-content-between pt-2">
                                    <div class="col-10"></div>
                                    <div class="col-2 text-end">
                                        <a href="../dadosDaMensagem/dadosDaMensagem.html?idMensagem=${mensagem.idMensagem}" class="col-2 text-end link-dark"  data-tipomensagem="${tipo}">
                                            <i class="col bi bi-eye btn-ver-mensagem fs-5"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
            }
            if (tipo == "Excluídas") {
                document.querySelector(`#lista-mensagens`).innerHTML = document.querySelector(`#lista-mensagens`).innerHTML +
                    `<div class="list-group-item list-group-item-action" ">
                    <div class="row">
                        <div class="col">
                            <h6 class="mb-1">${mensagem.nomeRemetente}</h6>
                            <p class="mb-1">${mensagem.assunto}</p>
                        </div>
                        <div class="col text-end">
                            <small class="text-body-secondary">${new Date(mensagem.data).toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric', year: 'numeric' })}</small>
                            <div class="row justify-content-between pt-2">
                                <div class="col-10"></div>
                                <div class="col-2 text-end"> 
                                    <a href="../dadosDaMensagem/dadosDaMensagem.html?idMensagem=${mensagem.idMensagem}" class="col-2 text-end link-dark"  data-tipomensagem="${tipo}">
                                        <i class="col bi bi-eye btn-ver-mensagem fs-5"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
            }
        });

        adicionarEventoExcluir();
    }
    else {
        document.querySelector("#lista-mensagens").innerHTML = document.querySelector("#lista-mensagens").innerHTML +
            `<span>
                    Nenhuma mensagem encontrada                            
                </span>`;
    }
}

function adicionarEventoExcluir() {
    const listaBtnExcluir = document.querySelectorAll(".btn-excluir-mensagem");
    listaBtnExcluir.forEach(element => {
        element.onclick = aoClicarEmExcluir;
    });
}

function aoClicarEmExcluir(evento) {
    document.querySelector("#btn-confirmar-excluir-mensagem").dataset.idmensagem = evento.target.dataset.idmensagem;
}

async function excluirMensagem(evento) {
    const token = seguranca.pegarToken();
    const idMensagem = evento.target.dataset.idmensagem;

    try {
        await servicos.excluirMensagem(token, idMensagem);
        mensagens.mostrarMensagemDeSucesso("Mensagem excluída com sucesso!", true);
        window.location.reload();
    } catch (error) {
        erros.tratarErro(error);
    }
}



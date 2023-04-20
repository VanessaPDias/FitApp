import * as servicos from "./servicosDeDadosDoAssinante.js"
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";
import * as paginaMestra from "../paginaMestra/paginaMestra.js";
import * as mensagens from "../util/mensagens.js";

seguranca.deslogarSeTokenEstiverExpirado("/login/entrar.html");

window.onload = aoCarregarPagina;

let idAssinante;
let novoStatus;

async function aoCarregarPagina() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    idAssinante = params.idAssinante;

    await paginaMestra.carregar("dadosDoAssinante/dadosDoAssinante-conteudo.html", "Dados do Assinante");

    await buscarDadosDoAssinante(idAssinante);

    document.querySelector("#btn-confirmar-alteracao-status").onclick = gravarNovoStatus;

    mensagens.exibirMensagemAoCarregarAPagina();
}

async function buscarDadosDoAssinante(idAssinante) {
    try {
        const token = seguranca.pegarToken();
        const resposta = await servicos.buscarDados(token, idAssinante);

        let status;
        const btn = document.querySelector("#btn-alterar-status");

        if (resposta.usuarioBloqueado == false) {
            status = "Desbloqueado";
            btn.innerHTML = "Bloquear";
            novoStatus = true;

        }else {
            status = "Bloqueado"
            btn.innerHTML = "Desbloquear";
            novoStatus = false;
        }

        document.querySelector("#nome-assinante").innerHTML = resposta.nome;
        document.querySelector("#email-assinante").innerHTML = resposta.email;
        document.querySelector("#status-assinante").innerHTML = status;
        document.querySelector("#nome-plano").innerHTML = resposta.nomePlano;
        document.querySelector("#valor-plano").innerHTML = resposta.valor;
        document.querySelector("#data-inicio").innerHTML = new Date(resposta.dataInicio).toLocaleString('pt-BR', { day: 'numeric', month: 'numeric', year: 'numeric' });
        document.querySelector("#data-fim").innerHTML = new Date(resposta.dataFim).toLocaleString('pt-BR', { day: 'numeric', month: 'numeric', year: 'numeric' });


    } catch (error) {
        erros.tratarErro(error);
    }
}

async function gravarNovoStatus() {
    const token = seguranca.pegarToken();

    try {
        await servicos.alterarStatusDoAssinante(token, idAssinante, novoStatus);
        mensagens.mostrarMensagemDeSucesso("Status alterado com sucesso!", true);
        window.location.reload();
    } catch (error) {
        erros.tratarErro(error);
    }
}
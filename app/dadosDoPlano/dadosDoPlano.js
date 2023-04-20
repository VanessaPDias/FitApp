import * as servicos from "./servicosDeDadosDoPlano.js"
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";
import * as paginaMestra from "../paginaMestra/paginaMestra.js";
import * as mensagens from "../util/mensagens.js";

seguranca.deslogarSeTokenEstiverExpirado("/login/entrar.html");

window.onload = aoCarregarPagina;

let modal;
let idPlano;
let novosDados;

async function aoCarregarPagina() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    idPlano = params.idPlano;

    await paginaMestra.carregar("dadosDoPlano/dadosDoPlano-conteudo.html", "Dados do Plano");

    await buscarDadosDoPlano(idPlano);

    document.querySelector("#btn-confirmar-alteracao-do-plano").onclick = gravarAlteracoesDoPlano;

    mensagens.exibirMensagemAoCarregarAPagina();
}

async function buscarDadosDoPlano(idPlano) {
    try {
        const token = seguranca.pegarToken();
        const resposta = await servicos.buscarDados(token, idPlano);

        document.querySelector("#btn-alterar-dados-do-plano").onclick = alterarDadosDoPlano;

        document.querySelector("#nome-plano").value = resposta.nome;
        document.querySelector("#valor-plano").value = resposta.valor;
        document.querySelector("#status-plano").value = resposta.bloqueado;
        document.querySelector("#duracao-plano").value = resposta.duracao;
        document.querySelector("#descricao-plano").value = resposta.descricao;


    } catch (error) {
        erros.tratarErro(error);
    }
}

async function alterarDadosDoPlano(evento) {
    const nome = document.querySelector("#nome-plano").value;
    const valor = document.querySelector("#valor-plano").value;
    const status = document.querySelector("#status-plano").value;
    const duracao = document.querySelector("#duracao-plano").value;
    const descricao = document.querySelector("#descricao-plano").value;

    const formulario = document.querySelector("#formulario-perfil");
    if (formulario.checkValidity() == false) {
        return false;
    }

    evento.preventDefault();
    
    novosDados = {
        nome: nome,
        valor: valor,
        bloqueado: status,
        duracao: duracao,
        descricao: descricao
    };

    if (!modal) {
        modal = new bootstrap.Modal('#modal-salvar-alteracao');
    }
    modal.show();


}

async function gravarAlteracoesDoPlano(evento) {
    const token = seguranca.pegarToken();

    modal.hide();

    try {
        await servicos.gravarAlteracoes(token, idPlano, novosDados);
        mensagens.mostrarMensagemDeSucesso("Alterado com sucesso!", true);
        window.location.reload();
    } catch (error) {
        erros.tratarErro(error);
    }
}
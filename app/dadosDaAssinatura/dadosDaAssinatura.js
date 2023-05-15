import * as servicos from "./servicosDeDadosDaAssinatura.js"
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";
import * as paginaMestra from "../paginaMestra/paginaMestra.js";
import * as mensagens from "../util/mensagens.js";

seguranca.deslogarSeTokenEstiverExpirado("/login/entrar.html");

window.onload = aoCarregarPagina;

let idAssinatura;
let planosAtivos;
let idDoPlanoDoAssinante;

async function aoCarregarPagina() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    idAssinatura = params.idAssinatura;

    await paginaMestra.carregar("dadosDaAssinatura/dadosDaAssinatura-conteudo.html", "Dados da Assinatura");

    await buscarDadosDaAssinatura(params.idAssinatura);

    document.querySelector("#modal-alterar-plano").addEventListener("show.bs.modal", aoAbrirModalAlterarPlano);
    document.querySelector("#btn-confirmar-alteracao").onclick = alterarPlano;
    document.querySelector("#btn-confirmar-cancelamento").onclick = aoConfirmarCancelarAssinatura;

    mensagens.exibirMensagemAoCarregarAPagina();
}

async function buscarDadosDaAssinatura(idAssinatura) {
    try {
        const token = seguranca.pegarToken();
        const resposta = await servicos.buscarDados(token, idAssinatura);

        let statusPlano;
        if (resposta.bloqueado == false) {
            statusPlano = "Ativo";
        } else {
            statusPlano = "Inativo"
        }

        document.querySelector("#nome-plano").innerHTML = resposta.nome;
        document.querySelector("#valor-plano").innerHTML = resposta.valor;
        document.querySelector("#descricao-plano").innerHTML = resposta.descricao;
        document.querySelector("#status-plano").innerHTML = statusPlano;
        document.querySelector("#data-inicio").innerHTML = new Date(resposta.dataInicio).toLocaleString('pt-BR', { day: 'numeric', month: 'numeric', year: 'numeric' });
        document.querySelector("#data-fim").innerHTML = new Date(resposta.dataFim).toLocaleString('pt-BR', { day: 'numeric', month: 'numeric', year: 'numeric' });

        idDoPlanoDoAssinante = resposta.idPlano;
    } catch (error) {
        erros.tratarErro(error);
    }
}

async function aoAbrirModalAlterarPlano() {

    planosAtivos = await servicos.buscarPlanosAtivos();

    const selectPlanos = document.querySelector("#select-planos");

    selectPlanos.innerHTML = "";

    planosAtivos.forEach(plano => {
        let option = '';

        if (plano.publicado == true) {
            if (plano.idPlano == idDoPlanoDoAssinante) {
                option = `<option value="${plano.idPlano}" selected>${plano.nome.toUpperCase()}</option>`;

                document.querySelector("#form-valor").value = plano.valor;
                document.querySelector("#form-descricao").value = plano.descricao;
            } else {
                option = `<option value="${plano.idPlano}">${plano.nome.toUpperCase()}</option>`;
            }

            selectPlanos.innerHTML = selectPlanos.innerHTML + option;
        }

    });

    selectPlanos.onchange = preencherDadosPlano;
}

function preencherDadosPlano(evento) {
    const valorSelecionado = evento.target.value;

    const plano = planosAtivos.find(plano => plano.idPlano == valorSelecionado);

    document.querySelector("#form-valor").value = plano.valor;
    document.querySelector("#form-descricao").value = plano.descricao;

}

async function alterarPlano() {

    try {

        const token = seguranca.pegarToken();
        const idNovoPlano = document.querySelector("#select-planos").value;

        const idNovaAssinatura = await servicos.alterarPlanoDaAssinatura(token, idAssinatura, idNovoPlano);
        mensagens.mostrarMensagemDeSucesso("Plano alterado com sucesso!", true);
        window.location.href = `/dadosDaAssinatura/dadosDaAssinatura.html?idAssinatura=${idNovaAssinatura.idAssinatura}`;

    } catch (error) {
        erros.tratarErro(error);
    }
}

async function aoConfirmarCancelarAssinatura() {

    try {

        const token = seguranca.pegarToken();

        await servicos.cancelarAssinatura(token, idAssinatura);
        mensagens.mostrarMensagemDeSucesso("Assinatura Cancelada!", true);
        window.location.href = "../index.html";
    } catch (error) {
        erros.tratarErro(error);
    }
}
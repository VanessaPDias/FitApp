import * as servicos from "./servicosDoPerfil.js"
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";
import * as paginaMestra from "../paginaMestra/paginaMestra.js";
import * as mensagens from "../util/mensagens.js";
import * as configuracoes from "../configuracoes.js";

seguranca.deslogarSeTokenEstiverExpirado("/login/entrar.html");

window.onload = aoCarregarPagina;

let idAssinatura;
let idNutri;
let idPersonal;
let modal;
async function aoCarregarPagina() {
    await paginaMestra.carregar("perfilAssinante/perfil-conteudo.html", "Perfil");

    document.querySelector("#imagem-perfil").onclick = alterarImagem;
    document.querySelector("#btn-salvar-dados-do-perfil").onclick = salvarDadosDoPerfil;
    document.querySelector("#btn-alterar-senha").onclick = alterarSenhaDeAcesso;
    document.querySelector("#btn-confirmar-alteracao-de-senha").onclick = gravarNovaSenha;
    document.querySelector("#btn-dados-assinatura").onclick = irParaPaginaDadosDaAssinatura;
    document.querySelector("#modal-dados-nutricionista").addEventListener("show.bs.modal", aoAbrirModalDadosDoNutricionista);
    document.querySelector("#modal-dados-personal").addEventListener("show.bs.modal", aoAbrirModalDadosDoPersonal);

    await buscarDadosDoPerfil();

    mensagens.exibirMensagemAoCarregarAPagina();
}

async function buscarDadosDoPerfil() {
    try {
        if (seguranca.pegarImagemDoUsuario()) {
            document.querySelector("#imagem-perfil").setAttribute("src", `${configuracoes.urlDaApi}/` + seguranca.pegarImagemDoUsuario());
        }

        const token = seguranca.pegarToken();
        const resposta = await servicos.buscarDados(token);

        idAssinatura = resposta.idAssinatura;
        idNutri = resposta.idNutri;
        idPersonal = resposta.idPersonal;

        document.querySelector("#email").innerHTML = resposta.email;
        document.querySelector("#nome").value = resposta.nome;

        let dataFormatada;
        if (!resposta.dataNascimento) {
            dataFormatada = "";
        } else {
            const data = new Date(resposta.dataNascimento);
            const zeroEsquerdaMes = (data.getMonth() + 1) < 10 ? '0' : '';
            const zeroEsquerdaDia = (data.getDate() + 1) < 10 ? '0' : '';
            dataFormatada = data.getFullYear() + '-' + zeroEsquerdaMes + (data.getMonth() + 1) + '-' + zeroEsquerdaDia + data.getDate();
        }
        document.querySelector("#data-nascimento").value = dataFormatada;
        document.querySelector("#sexo").value = resposta.sexo;
        document.querySelector("#altura").value = resposta.altura;
    } catch (error) {
        erros.tratarErro(error);
    }
}

async function salvarDadosDoPerfil(evento) {
    try {
        const token = seguranca.pegarToken();

        const nome = document.querySelector("#nome").value;
        const dataNascimento = new Date(document.querySelector("#data-nascimento").value);
        const sexo = document.querySelector("#sexo").value;
        const altura = document.querySelector("#altura").value;

        const formulario = document.querySelector("#formulario-perfil");
        if (formulario.checkValidity() == false) {
            return false;
        }

        evento.preventDefault();

        await servicos.salvarDados(token, nome, dataNascimento, sexo, altura);
        seguranca.atualizarNomeUsuarioLogado(nome);
        mensagens.mostrarMensagemDeSucesso("Alteração realizada com sucesso!", true);
        window.location.reload();

    } catch (error) {
        erros.tratarErro(error);
    }

}

async function alterarSenhaDeAcesso(evento) {
    const formulario = document.querySelector("#formulario-alterar-senha");
    if (formulario.checkValidity() == false) {
        return false;
    }
    evento.preventDefault();
    if (!modal) {
        modal = new bootstrap.Modal('#modal-alterar-senha');
    }
    modal.show();
}

async function gravarNovaSenha() {
    const token = seguranca.pegarToken();
    const senhaAtual = document.querySelector("#senha-atual");
    const novaSenha = document.querySelector("#nova-senha");

    modal.hide();

    try {
        await servicos.alterarSenha(token, senhaAtual.value, novaSenha.value);
        mensagens.mostrarMensagemDeSucesso("Senha alterada com sucesso!");
        senhaAtual.value = "";
        novaSenha.value = "";
    } catch (error) {
        erros.tratarErro(error);
    }
}

function alterarImagem() {
    document.querySelector("#input-imagem-perfil").click();
    document.querySelector("#input-imagem-perfil").onchange = gravarImagem;
}

async function gravarImagem() {
    try {
        const token = seguranca.pegarToken();
        const inputFile = document.querySelector("#input-imagem-perfil");
        const res = await servicos.salvarImagem(token, inputFile.files[0]);

        seguranca.atualizarImagemUsuarioLogado(res.imagem);
        mensagens.mostrarMensagemDeSucesso("Imagem alterada com sucesso!", true);
        window.location.reload();
    } catch (error) {
        erros.tratarErro(error);
    }
}

function irParaPaginaDadosDaAssinatura() {
    window.location.href = `../dadosDaAssinatura/dadosDaAssinatura.html?idAssinatura=${idAssinatura}`;
}

async function aoAbrirModalDadosDoNutricionista() {

    try {
        const token = seguranca.pegarToken();

        const dadosDoNutricionista = await servicos.buscarDadosNutri(token, idNutri);

        if (!dadosDoNutricionista.imagem.endsWith("null")) {
           document.querySelector("#imagem-nutricionista").src = `${configuracoes.urlDaApi}/${dadosDoNutricionista.imagem}`;
        }

        document.querySelector("#nome-nutricionista").innerHTML = dadosDoNutricionista.nome;
        document.querySelector("#registro-profissional-nutricionista").innerHTML = dadosDoNutricionista.registroProfissional;
        document.querySelector("#email-nutricionista").innerHTML = dadosDoNutricionista.email;
        document.querySelector("#descricao-nutricionista").innerHTML = dadosDoNutricionista.sobreMim;
    }
    catch (error) {
        erros.tratarErro(error);
    }
}

async function aoAbrirModalDadosDoPersonal() {

    try {
        const token = seguranca.pegarToken();

        const dadosDoPersonal = await servicos.buscarDadosPersonal(token, idPersonal);

        if (!dadosDoPersonal.imagem.endsWith("null")) {
           document.querySelector("#imagem-personal").src = `${configuracoes.urlDaApi}/${dadosDoPersonal.imagem}`;
        }

        document.querySelector("#nome-personal").innerHTML = dadosDoPersonal.nome;
        document.querySelector("#registro-profissional-personal").innerHTML = dadosDoPersonal.registroProfissional;
        document.querySelector("#email-personal").innerHTML = dadosDoPersonal.email;
        document.querySelector("#descricao-personal").innerHTML = dadosDoPersonal.sobreMim;
    }
    catch (error) {
        erros.tratarErro(error);
    }
}
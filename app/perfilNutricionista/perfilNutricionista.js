import * as servicos from "./servicosDePerfilNutricionista.js"
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";
import * as paginaMestra from "../paginaMestra/paginaMestra.js";
import * as mensagens from "../util/mensagens.js";
import * as configuracoes from "../configuracoes.js";

seguranca.deslogarSeTokenEstiverExpirado("/login/entrar.html");

window.onload = aoCarregarPagina;

let modal;

async function aoCarregarPagina() {
    await paginaMestra.carregar("perfilNutricionista/perfilNutricionista-conteudo.html", "Perfil");

    document.querySelector("#imagem-perfil").onclick = alterarImagem;
    document.querySelector("#btn-salvar-dados-do-perfil").onclick = salvarDadosDoPerfil;
    document.querySelector("#btn-alterar-senha").onclick = alterarSenhaDeAcesso;
    document.querySelector("#btn-confirmar-alteracao-de-senha").onclick = salvarNovaSenha;
    document.querySelector("#btn-salvar-sobre-mim").onclick = salvarInformacoesSobreMim;

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

        document.querySelector("#email").innerHTML = resposta.email;
        document.querySelector("#registro-profissional").value = resposta.registroProfissional;
        document.querySelector("#nome").value = resposta.nome;
        document.querySelector("#telefone").value = resposta.telefone;
        document.querySelector("#texto-sobre-mim").value = resposta.sobreMim;
        
    } catch (error) {
        erros.tratarErro(error);
    }
}

async function salvarDadosDoPerfil(evento) {
    try {
        const token = seguranca.pegarToken();

        const nome = document.querySelector("#nome").value;
        const telefone = document.querySelector("#telefone").value;

        const formulario = document.querySelector("#formulario-perfil");
        if (formulario.checkValidity() == false) {
            return false;
        }

        evento.preventDefault();

        await servicos.salvarDados(token, nome, telefone);
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

async function salvarNovaSenha() {
    const token = seguranca.pegarToken();
    const senhaAtual = document.querySelector("#senha-atual");
    const novaSenha = document.querySelector("#nova-senha");

    modal.hide();

    try {
        await servicos.alterarSenha(token, senhaAtual.value, novaSenha.value);
        mensagens.mostrarMensagemDeSucesso("Senha alterada com sucesso!", true);
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

async function salvarInformacoesSobreMim() {
    try {
        const token = seguranca.pegarToken();
        await servicos.salvarDadosSobreMim(token, document.querySelector("#texto-sobre-mim").value);
        mensagens.mostrarMensagemDeSucesso("Alterado com sucesso!", true);
        window.location.reload();
    } catch (error) {
        erros.tratarErro(error);
    }
    
}
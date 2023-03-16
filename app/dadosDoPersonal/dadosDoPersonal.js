// import * as servicos from "./servicosDeDadosDoPersonal.js"
// import * as erros from "../util/tratamentoDeErros.js";
// import * as seguranca from "../seguranca/seguranca.js";
// import * as paginaMestra from "../paginaMestra/paginaMestra.js";
// import * as mensagens from "../util/mensagens.js";

// seguranca.deslogarSeTokenEstiverExpirado("/login/entrar.html");

// window.onload = aoCarregarPagina;

// let modal;
// let idPersonal;
// let novosDados;

// async function aoCarregarPagina() {
//     const params = new Proxy(new URLSearchParams(window.location.search), {
//         get: (searchParams, prop) => searchParams.get(prop),
//     });

//     idPersonal = params.idPersonal;

//     await paginaMestra.carregar("dadosDoPersonal/dadosDoPersonal-conteudo.html", "Dados do Personal Trainer");

//     await buscarDadosDoPersonal(idPersonal);

//     document.querySelector("#btn-alterar-dados-do-personal").onclick = alterarDadosDoPersonal;

//     mensagens.exibirMensagemAoCarregarAPagina();
// }

// async function buscarDadosDoPersonal(idPersonal) {
//     try {
//         const token = seguranca.pegarToken();
//         const resposta = await servicos.buscarDados(token, idPersonal);

//         document.querySelector("#btn-confirmar-alteracao").onclick = confirmarAlteracao;

//         document.querySelector("#nome-personal").value = resposta.nome;
//         document.querySelector("#email-personal").value = resposta.email;
//         document.querySelector("#telefone-personal").value = resposta.telefone;
//         document.querySelector("#registro-profissional-personal").value = resposta.registroProfissional;
//         document.querySelector("#status-personal").value = resposta.bloqueado;
//         document.querySelector("#cadastro-confirmado-personal").value = resposta.cadastroConfirmado;

//         if(resposta.cadastroConfirmado == 1) {
//             document.querySelector("#cadastro-confirmado-personal").setAttribute("disabled","");
//         }


//     } catch (error) {
//         erros.tratarErro(error);
//     }
// }

// async function alterarDadosDoPersonal(evento) {
//     const registroProfissional = document.querySelector("#registro-profissional-personal").value;
//     const status = document.querySelector("#status-personal").value;
//     const cadastro = document.querySelector("#cadastro-confirmado-personal").value;

//     evento.preventDefault();

//     novosDados = {
//         registroProfissional: registroProfissional,
//         bloqueado: status,
//         cadastroConfirmado: cadastro,
//     };

//     if (!modal) {
//         modal = new bootstrap.Modal('#modal-alterar-dados');
//     }
//     modal.show();


// }

// async function confirmarAlteracao(evento) {
//     const token = seguranca.pegarToken();

//     modal.hide();

//     try {
//         await servicos.gravarAlteracoes(token, idPersonal, novosDados);
//         mensagens.mostrarMensagemDeSucesso("Alterado com sucesso!", true);
//         window.location.reload();
//     } catch (error) {
//         erros.tratarErro(error);
//     }
// }
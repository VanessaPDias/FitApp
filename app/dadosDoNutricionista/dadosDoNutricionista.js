// import * as servicos from "./servicosDeDadosDoNutricionista.js"
// import * as erros from "../util/tratamentoDeErros.js";
// import * as seguranca from "../seguranca/seguranca.js";
// import * as paginaMestra from "../paginaMestra/paginaMestra.js";
// import * as mensagens from "../util/mensagens.js";

// seguranca.deslogarSeTokenEstiverExpirado("/login/entrar.html");

// window.onload = aoCarregarPagina;

// let modal;
// let idNutri;
// let novosDados;

// async function aoCarregarPagina() {
//     const params = new Proxy(new URLSearchParams(window.location.search), {
//         get: (searchParams, prop) => searchParams.get(prop),
//     });

//     idNutri = params.idNutri;

//     await paginaMestra.carregar("dadosDoNutricionista/dadosDoNutricionista-conteudo.html", "Dados do Nutricionista");

//     await buscarDadosDoNutricionista(idNutri);

//     document.querySelector("#btn-alterar-dados-do-nutricionista").onclick = alterarDadosDoNutricionista;

//     mensagens.exibirMensagemAoCarregarAPagina();
// }

// async function buscarDadosDoNutricionista(idNutri) {
//     try {
//         const token = seguranca.pegarToken();
//         const resposta = await servicos.buscarDados(token, idNutri);

//         document.querySelector("#btn-confirmar-alteracao").onclick = confirmarAlteracao;

//         document.querySelector("#nome-nutri").value = resposta.nome;
//         document.querySelector("#email-nutri").value = resposta.email;
//         document.querySelector("#telefone-nutri").value = resposta.telefone;
//         document.querySelector("#registro-profissional-nutri").value = resposta.registroProfissional;
//         document.querySelector("#status-nutri").value = resposta.bloqueado;
//         document.querySelector("#cadastro-confirmado-nutri").value = resposta.cadastroConfirmado;

//         if(resposta.cadastroConfirmado == 1) {
//             document.querySelector("#cadastro-confirmado-nutri").setAttribute("disabled","");
//         }


//     } catch (error) {
//         erros.tratarErro(error);
//     }
// }

// async function alterarDadosDoNutricionista(evento) {
//     const registroProfissional = document.querySelector("#registro-profissional-nutri").value;
//     const status = document.querySelector("#status-nutri").value;
//     const cadastro = document.querySelector("#cadastro-confirmado-nutri").value;

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
//         await servicos.gravarAlteracoes(token, idNutri, novosDados);
//         mensagens.mostrarMensagemDeSucesso("Alterado com sucesso!", true);
//         window.location.reload();
//     } catch (error) {
//         erros.tratarErro(error);
//     }
// }
// import * as servicos from "./servicosDePlanos.js"
// import * as erros from "../util/tratamentoDeErros.js";
// import * as seguranca from "../seguranca/seguranca.js";
// import * as paginaMestra from "../paginaMestra/paginaMestra.js";
// import * as mensagens from "../util/mensagens.js";

// seguranca.deslogarSeTokenEstiverExpirado("/login/entrar.html");

// window.onload = aoCarregarPagina;

// async function aoCarregarPagina() {

//     await paginaMestra.carregar("planos/planos-conteudo.html", "Planos");

//     await buscarPlanos();

//     document.querySelector("#btn-pesquisar").onclick = buscarPlanos;

//     document.querySelector("#btn-salvar-plano").onclick = cadastrarPlano;

//     mensagens.exibirMensagemAoCarregarAPagina();
// }

// async function buscarPlanos() {
//     try {
//         const token = seguranca.pegarToken();
//         const resposta = await servicos.buscarDados(token, document.querySelector("#input-pesquisar").value);

//         document.querySelector("#lista-planos").innerHTML = "";

//         if (resposta.length > 0) {
//             resposta.forEach(plano => {

//                 let status;

//                 if (plano.bloqueado == false) {
//                     status = "Ativo"
                    
//                 } else {
//                     status = "Inativo"
//                 }

//                 document.querySelector("#lista-planos").innerHTML = document.querySelector("#lista-planos").innerHTML +
//                     `<tr>
//                         <td>${plano.nome}</td>
//                         <td>${plano.valor}</td>
//                         <td>${plano.duracao}</td>
//                         <td>${status}</td>
//                         <td><a href="../dadosDoPlano/dadosDoPlano.html?idPlano=${plano.idPlano}" class="text-decoration-none link-dark"><i class="bi bi-eye fs-4 me-2"></i></a></td>
//                     </tr>`;
//             });
//         }
//         else {
//             document.querySelector("#lista-planos").innerHTML = document.querySelector("#lista-planos").innerHTML +
//                 `<tr>
//                     <td colspan="4">
//                         Nenhum Plano encontrado
//                     </td>
//                 </tr>`;
//         }


//     } catch (error) {
//         erros.tratarErro(error);
//     }
// }

// async function cadastrarPlano(evento) {
//     const nome = document.querySelector("#form-nome").value;
//     const valor = document.querySelector("#form-valor").value;
//     const duracao = document.querySelector("#form-duracao").value;
//     const descricao = document.querySelector("#form-descricao").value;
//     const token = seguranca.pegarToken();

//     const formulario = document.querySelector("#formulario");
//     if (formulario.checkValidity() == false) {
//         return false;
//     }

//     evento.preventDefault();

//     try {
//         await servicos.salvarPlano(token, nome, valor, duracao, descricao);
//         mensagens.mostrarMensagemDeSucesso("Plano Cadastrado com sucesso!", true);
//         window.location.reload();
//     } catch (error) {
//         erros.tratarErro(error);
//     }
// }

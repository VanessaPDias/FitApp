// import * as util from "../util/tratamentoDeRespostaApi.js";
// import * as configuracoes from "../configuracoes.js";

// export async function buscarDados(token, idPersonal) {
//     const url = `${configuracoes.urlDaApi}/admin/personalTrainers/${idPersonal}`;

//     const resposta = await fetch(url, {
//         headers: {
//             authorization: "Bearer " + token
//         }
//     });

//     return util.tratarRespostaApi(resposta);
// }

// export async function gravarAlteracoes(token, idPersonal, novosDados) {
//     const url = `${configuracoes.urlDaApi}/admin/personalTrainers/${idPersonal}`;

//     const request = new Request(url, {
//         method: 'PATCH',        
//         body: JSON.stringify(
//             {
//                 registroProfissional: novosDados.registroProfissional,
//                 bloqueado: novosDados.bloqueado,
//                 cadastroConfirmado: novosDados.cadastroConfirmado

//             }),
//         headers: {
//             authorization: "Bearer " + token,
//             "Content-Type": "application/json"
//         }

//     });

//     const resposta = await fetch(request);
    
//     return util.tratarRespostaApi(resposta);
// }


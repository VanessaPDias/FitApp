import * as util from "../util/tratamentoDeRespostaApi.js";
import * as configuracoes from "../configuracoes.js";

export async function buscarDados(token, idPaciente) {
    const url = `${configuracoes.urlDaApi}/nutricionista/pacientes/${idPaciente}/medidas`;

    const resposta = await fetch(url, {
        headers: {
            authorization: "Bearer " + token
        }
    });

    return util.tratarRespostaApi(resposta);
}
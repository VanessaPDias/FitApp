import * as util from "../util/tratamentoDeRespostaApi.js";
import * as configuracoes from "../configuracoes.js";

export async function buscarDietaPorId(token, idDieta) {
    const url = `${configuracoes.urlDaApi}/assinante/dietas/${idDieta}`;

    const resposta = await fetch(url, {
        headers: {
            authorization: "Bearer " + token
        }
    });

    return util.tratarRespostaApi(resposta);
}


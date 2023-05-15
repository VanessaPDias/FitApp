import * as util from "../util/tratamentoDeRespostaApi.js";
import * as configuracoes from "../configuracoes.js";

export async function buscarDados(token, nome, bloqueado) {
    const url = `${configuracoes.urlDaApi}/admin/assinantes?nome=${nome}&bloqueado=${bloqueado}`;

    const resposta = await fetch(url, {
        headers: {
            authorization: "Bearer " + token
        }
    });

    return util.tratarRespostaApi(resposta);
}


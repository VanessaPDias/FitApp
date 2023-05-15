import * as util from "../util/tratamentoDeRespostaApi.js";
import * as configuracoes from "../configuracoes.js";

export async function buscarPlanosAtivos() {
    const url = `${configuracoes.urlDaApi}/planos`;

    const resposta = await fetch(url);

    return util.tratarRespostaApi(resposta);
}

export async function buscarNutricionistasAtivos() {
    const url = `${configuracoes.urlDaApi}/nutricionistas`;

    const resposta = await fetch(url);

    return util.tratarRespostaApi(resposta);
}

export async function buscarPersonalTrainersAtivos() {
    const url = `${configuracoes.urlDaApi}/personalTrainers`;

    const resposta = await fetch(url);

    return util.tratarRespostaApi(resposta);
}
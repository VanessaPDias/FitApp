import * as configuracoes from "../configuracoes.js";

async function buscarNutricionistasAtivos() {
    const url = `${configuracoes.urlDaApi}/nutricionistas`;

    const resposta = await fetch(url);
    
    if(resposta.ok) {
        const json = await resposta.json();
        return json;
    }    
}

async function buscarPersonalTrainersAtivos() {
    const url = `${configuracoes.urlDaApi}/personalTrainers`;

    const resposta = await fetch(url);
    
    if(resposta.ok) {
        const json = await resposta.json();
        return json;
    }    
}
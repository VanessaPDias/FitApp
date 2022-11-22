import * as servicos from "./servicosDeRelatorios.js"
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";
import * as paginaMestra from "../paginaMestra/paginaMestra.js";


if(!seguranca.tokenValido()) {
    window.location.href = "/app/login/entrar.html";
}

window.onload = aoCarregarPagina;

async function aoCarregarPagina() {    
    await paginaMestra.carregar("relatorios/relatorios-conteudo.html", "Relatórios");
    await buscarMedidas();
}

async function buscarMedidas() {
    try {
        const token = seguranca.pegarToken();
        const resposta = await servicos.buscarDados(token);

        resposta.forEach(medida => {
            
            document.querySelector("#grafico-medidas").innerHTML = document.querySelector("#grafico-medidas").innerHTML + 
            `</br>
            <span>${medida.data}</span></br>
            <span>${medida.peso}</span></br>
            <span>${medida.pescoco}</span></br>
            <span>${medida.cintura}</span></br>
            <span>${medida.quadril}</span></br>
            `;
        });

        
    } catch (error) {
        erros.tratarErro(error);
    }
}
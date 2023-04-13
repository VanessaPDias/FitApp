import * as servicos from "./servicosDaHome.js";
import * as paginaMestraSite from "../paginaMestraSite/paginaMestraSite.js";

window.onload = aoCarregarPagina;

async function aoCarregarPagina() {
    await paginaMestraSite.carregar("index-conteudo.html", "Home");
    
    const planosAtivos = await servicos.buscarPlanosAtivos();

    planosAtivos.forEach(plano => {
        preencherCaixaPlanoHtml(plano);
    });

    const carousel = new bootstrap.Carousel('#myCarousel')
}
function preencherCaixaPlanoHtml(plano) {
    
    const planosAtivos = document.querySelector("#planos-ativos");
    const planoModelo = document.querySelector("#plano-modelo");

    const clonePlanoModeloHtml = planoModelo.firstElementChild.cloneNode(true);

    clonePlanoModeloHtml.style.display = "block";

    clonePlanoModeloHtml.querySelector(".plano-modelo-nome").innerHTML = plano.nome;
    clonePlanoModeloHtml.querySelector(".plano-modelo-valor").innerHTML = plano.valor;
    clonePlanoModeloHtml.querySelector(".plano-modelo-descricao").innerHTML = plano.descricao;
    clonePlanoModeloHtml.querySelector("a").href = `${plano.idPlano}`;

    planosAtivos.appendChild(clonePlanoModeloHtml);
}

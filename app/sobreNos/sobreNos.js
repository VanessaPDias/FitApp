window.onload = aoCarregarPagina;

async function aoCarregarPagina() {
    const nutricionistasAtivos = await buscarNutricionistasAtivos();

    nutricionistasAtivos.forEach(nutricionista => {
        preencherCaixaNutricionistaHtml(nutricionista);
    });

    const personalTrainersAtivos = await buscarPersonalTrainersAtivos();

    personalTrainersAtivos.forEach(personalTrainer => {
        preencherCaixaPersonalTrainerHtml(personalTrainer);
    });
}

function preencherCaixaNutricionistaHtml(nutricionista) {
    const nutricionistasAtivos = document.querySelector("#nutricionistasAtivos");
    const nutricionistaModelo = document.querySelector("#nutricionistaModelo");

    const cloneNutricionistaModeloHtml = nutricionistaModelo.cloneNode(true);

    cloneNutricionistaModeloHtml.id = nutricionista.idNutri;
    cloneNutricionistaModeloHtml.style.display = "block";

    cloneNutricionistaModeloHtml.querySelector(".nutricionistaModelo-nome").innerHTML = nutricionista.nome;
    cloneNutricionistaModeloHtml.querySelector(".nutricionistaModelo-imagem").src = nutricionista.imagem;
    cloneNutricionistaModeloHtml.querySelector(".nutricionistaModelo-sobreMim").innerHTML = nutricionista.sobreMim;

    nutricionistasAtivos.appendChild(cloneNutricionistaModeloHtml);
}

function preencherCaixaPersonalTrainerHtml(personalTrainer) {
    const personalTrainersAtivos = document.querySelector("#personalTrainersAtivos");
    const personalTrainerModelo = document.querySelector("#personalTrainerModelo");

    const clonePersonalTrainerModeloHtml = personalTrainerModelo.cloneNode(true);

    clonePersonalTrainerModeloHtml.id = personalTrainer.idPersonal;
    clonePersonalTrainerModeloHtml.style.display = "block";

    clonePersonalTrainerModeloHtml.querySelector(".personalTrainerModelo-nome").innerHTML = personalTrainer.nome;
    clonePersonalTrainerModeloHtml.querySelector(".personalTrainerModelo-imagem").src = personalTrainer.imagem;
    clonePersonalTrainerModeloHtml.querySelector(".personalTrainerModelo-sobreMim").innerHTML = personalTrainer.sobreMim;

    personalTrainersAtivos.appendChild(clonePersonalTrainerModeloHtml);
}
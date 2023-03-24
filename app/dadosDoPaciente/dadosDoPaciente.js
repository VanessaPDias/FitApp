import * as servicos from "./servicosDeDadosDoPaciente.js"
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";
import * as paginaMestra from "../paginaMestra/paginaMestra.js";
import * as mensagens from "../util/mensagens.js";
import * as configuracoes from "../configuracoes.js";

seguranca.deslogarSeTokenEstiverExpirado("/login/entrar.html");

window.onload = aoCarregarPagina;

let idPaciente;
let nomePaciente;

async function aoCarregarPagina() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    idPaciente = params.idAssinante;

    await paginaMestra.carregar("dadosDoPaciente/dadosDoPaciente-conteudo.html", "Dados do Paciente");

    await buscarDadosDoPaciente(idPaciente);

   // document.querySelector("#btn-dieta-atual").onclick = buscarDietaAtual;
    document.querySelector("#btn-medidas").onclick = irParaPaginaDeMedidas;
    document.querySelector("#btn-nova-dieta").onclick = irParaPaginaDeCriarDieta;

    mensagens.exibirMensagemAoCarregarAPagina();
}

async function buscarDadosDoPaciente(idAssinante) {
    try {
        const token = seguranca.pegarToken();
        const resposta = await servicos.buscarDados(token, idAssinante);

        nomePaciente = resposta.nome;

        if (resposta.imagem) {
            document.querySelector("#imagem-paciente").setAttribute("src", `${configuracoes.urlDaApi}/${resposta.imagem}`);
        }

        document.querySelector("#nome-paciente").innerHTML = resposta.nome;
        document.querySelector("#objetivo-paciente").innerHTML = !resposta.objetivo ? "" : resposta.objetivo;
        document.querySelector("#idade-paciente").innerHTML = resposta.dataNascimento;
        document.querySelector("#altura-paciente").innerHTML = resposta.altura;
        document.querySelector("#peso-paciente").innerHTML = resposta.peso;
        document.querySelector("#pescoco-paciente").innerHTML = resposta.pescoco;
        document.querySelector("#cintura-paciente").innerHTML = resposta.cintura;
        document.querySelector("#quadril-paciente").innerHTML = resposta.quadril;
        document.querySelector("#imc-paciente").innerHTML = resposta.imc.toFixed(2);

        document.querySelector("#lista-dietas").innerHTML = "";

        if (resposta.dietas.length > 0) {
            resposta.forEach(dieta => {

                document.querySelector("#lista-dietas").innerHTML = document.querySelector("#lista-dietas").innerHTML +
                    `<tr>
                        <td>${dieta.nome}</td>
                        <td>${dieta.inicio}</td>
                        <td>${dieta.fim}</td>
                        <td><a href="../dadosDoAssinante/dadosDoAssinante.html?idAssinante=${dieta.idAssinante}" class="text-decoration-none link-dark"><i class="bi bi-eye fs-4 me-2"></i></a></td>
                    </tr>`;
            });
        }
        else {
            document.querySelector("#lista-dietas").innerHTML = document.querySelector("#lista-dietas").innerHTML +
                `<tr>
                    <td colspan="4">
                        Nenhuma Dieta encontrada
                    </td>
                </tr>`;
        }

    } catch (error) {
        erros.tratarErro(error);
    }
}

function irParaPaginaDeMedidas() {
    window.location.href = `../historicoDeMedidasDoPaciente/historicoDeMedidasDoPaciente.html?idAssinante=${idPaciente}`;
}

function irParaPaginaDeCriarDieta() {
    window.location.href = `../criarDieta/criarDieta.html?idAssinante=${idPaciente}&nomeAssinante=${nomePaciente}`;
}


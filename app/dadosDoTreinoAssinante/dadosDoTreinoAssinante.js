import * as servicos from "./servicosDeDadosDoTreinoAssinante.js"
import * as erros from "../util/tratamentoDeErros.js";
import * as seguranca from "../seguranca/seguranca.js";
import * as paginaMestra from "../paginaMestra/paginaMestra.js";
import * as mensagens from "../util/mensagens.js";

seguranca.deslogarSeTokenEstiverExpirado("/login/entrar.html");

window.onload = aoCarregarPagina;

let token;
let nomeAssinante;
let idTreino;
let dadosDoTreino;
let exerciciosDoTreino = [];

async function aoCarregarPagina() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    idTreino = params.idTreino;

    await paginaMestra.carregar("dadosDoTreinoAssinante/dadosDoTreinoAssinante-conteudo.html", "Dados do Treino");

    document.querySelector("#btn-imprimir-treino").onclick = imprimirTreino;
    token = seguranca.pegarToken();
    nomeAssinante = seguranca.pegarNomeDoUsuario();
    buscarDadosDoTreino();
    mensagens.exibirMensagemAoCarregarAPagina();
}

async function buscarDadosDoTreino() {

    try {
        dadosDoTreino = await servicos.buscarTreinoPorId(token, idTreino);
        exerciciosDoTreino = dadosDoTreino.exercicios;

        document.querySelector("#nome-treino").innerHTML = dadosDoTreino.nome;
        document.querySelector("#objetivo-treino").innerHTML = dadosDoTreino.objetivo;
        document.querySelector("#inicio-treino").innerHTML = new Date(dadosDoTreino.dataInicio).toLocaleString('pt-BR', { day: 'numeric', month: 'numeric', year: 'numeric' });
        document.querySelector("#fim-treino").innerHTML = new Date(dadosDoTreino.dataFim).toLocaleString('pt-BR', { day: 'numeric', month: 'numeric', year: 'numeric' });

        mostrarExerciciosDoTreino();
    } catch (error) {
        erros.tratarErro(error);
    }
}

function mostrarExerciciosDoTreino() {
    document.querySelector(`#lista-exercicios-segunda`).innerHTML = "";
    document.querySelector(`#lista-exercicios-terca`).innerHTML = "";
    document.querySelector(`#lista-exercicios-quarta`).innerHTML = "";
    document.querySelector(`#lista-exercicios-quinta`).innerHTML = "";
    document.querySelector(`#lista-exercicios-sexta`).innerHTML = "";
    document.querySelector(`#lista-exercicios-sabado`).innerHTML = "";
    document.querySelector(`#lista-exercicios-domingo`).innerHTML = "";

    exerciciosDoTreino.forEach(exercicio => {

        document.querySelector(`#lista-exercicios-${exercicio.diaDoTreino}`).innerHTML = document.querySelector(`#lista-exercicios-${exercicio.diaDoTreino}`).innerHTML +
            `<li class="list-group-item lista-exercicios-treino mb-2"><i class="bi bi-arrow-right-short me-2"></i>${exercicio.descricao}</li>`;
    });
}

function imprimirTreino() {

    pdfMake.fonts = {
        Roboto: {
            normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
            bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
            italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
            bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
        }
    };
    var docDefinition = {


        content: [
            //header
            {
                stack: [
                    {
                        columns: [

                            {
                                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAACAASURBVHic7N15vB1lfT/wz3dmznaX7PtGEgJZQSxYFbWiIIjV2toGkuC+t1i3qrhilE3EurTVuteKJMEgtOJPICEQd1FRWbJvN3fNTe6+nW1mnt8fN6Ehuck9Z5bzzJnzeb9efZXce+aZT2Jy5zvPChARERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERRZ3oDkDkl7rsMgvzO+bDsRZCYQHgzoTIdChMBTAVClMhmAogCSADIH380vrjX1MA+gAAgkEo2ACygOQA1atyheFi3/B8QI6KgVZlGC0Q2aNM/CH9QMuByv+OiUqn3rwwjXzduVCYBQOzoNR0QGZCYRZEpgNqOkb/HUw4fslEAAbG+vcBOAAGjn+tG4Juu38k4w7nJ4lIFyxpU0oOQckTdsF4rP4Xhzsq+7ulcrAAoKqh3rhsKormcyDuBXCNCyBYAqiFAOYCsMK8tzOcQ/FoP5TjPuvrYhhKLGMIlnnUMOSQMs0/JKdO3ITO6Ttk+3Y7zExEJ1NvWLoIjrEcrrEUwHkQdR6A8wDMx+gDPaQbA/nWLrj54mnfEtNwxTJHYJrHDMEBZZl/Mgz1oLWlbbsA7hitUQWxAKBIUqtXToHpvhCQS2GoS6DkAgCztWZyXNh9w3AGR6DsUwoB04DZmIE1uQFiGgAkC+DPEPV7uOoPUOYfsPzpPbKeP/TIP/X65bPhGJdAuc+DIZdA4XkApmnLU3SQb+mCckv8622IMhLWoCSsJjHUb8WwfpTY2rIl3JR0KhYAFAlqzar5MNTlUHgR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',
                                width: 42,
                                height: 42,
                            },

                            { text: 'FitApp', fontSize: 18, bold: true, margin: 10 },
                        ]
                    }
                ],
            },
            //titulo
            {
                stack: [
                    {
                        fontSize: 15,
                        bold: true,
                        margin: [0, 20, 0, 10],
                        text: [
                            { text: 'Plano de Treino', },

                        ],
                    }
                ]

            },
            //Nome Assinante
            {
                stack: [
                    {
                        margin: [0, 10, 0, 20],
                        text: [
                            { text: 'Aluno:  ', fontSize: 12, bold: true },
                            { text: `${nomeAssinante}` },

                        ],
                    }
                ]

            },
            //dados do treino
            {
                stack: [
                    {
                        columns: [

                            {
                                width: '*',
                                text: [
                                    { text: 'Nome:  ', fontSize: 12, bold: true },
                                    { text: `${dadosDoTreino.nome}` }
                                ],

                            },
                            {
                                width: '*',
                                margin: [0, 5],
                                text: [
                                    { text: 'Objetivo:  ', fontSize: 12, bold: true },
                                    { text: `${dadosDoTreino.objetivo}` }
                                ]
                            },

                        ],
                    },

                    {
                        columns: [

                            {
                                width: '*',
                                text: [
                                    { text: 'Ínicio:  ', fontSize: 12, bold: true },
                                    {
                                        text: `${new Date(dadosDoTreino.dataInicio).
                                            toLocaleString('pt-BR', { day: 'numeric', month: 'numeric', year: 'numeric' })}`
                                    },
                                ],

                            },
                            {
                                width: '*',
                                margin: [0, 5],
                                text: [
                                    { text: 'Fim:  ', fontSize: 12, bold: true },
                                    {
                                        text: `${new Date(dadosDoTreino.dataFim).toLocaleString('pt-BR',
                                            { day: 'numeric', month: 'numeric', year: 'numeric' })}`
                                    }
                                ]
                            },

                        ],
                    },

                ]
            },
            //exercicios do treino

            {
                stack: [
                    {
                        margin: [0, 30, 0, 10],
                        table: {
                            widths: ['*'],
                            body: [
                                [
                                    { text: 'Segunda', fontSize: 15, bold: true, color: 'white' }
                                ]
                            ]
                        },
                        layout: {
                            defaultBorder: false,
                            fillColor: '#548CA8',
                        }
                    },
                    {
                        ul: exerciciosDoTreino.filter(exercicio => exercicio.diaDoTreino == 'segunda').map(exercicio => exercicio.descricao)
                    },
                ]

            },
            {
                stack: [
                    {
                        margin: [0, 30, 0, 10],
                        table: {
                            widths: ['*'],
                            body: [
                                [
                                    { text: 'Terça', fontSize: 15, bold: true, color: 'white' }
                                ]
                            ]
                        },
                        layout: {
                            defaultBorder: false,
                            fillColor: '#548CA8',
                        }
                    },
                    {
                        ul: exerciciosDoTreino.filter(exercicio => exercicio.diaDoTreino == 'terca').map(exercicio => exercicio.descricao)
                    },
                ]

            },
            {
                stack: [
                    {
                        margin: [0, 30, 0, 10],
                        table: {
                            widths: ['*'],
                            body: [
                                [
                                    { text: 'Quarta', fontSize: 15, bold: true, color: 'white' }
                                ]
                            ]
                        },
                        layout: {
                            defaultBorder: false,
                            fillColor: '#548CA8',
                        }
                    },
                    {
                        ul: exerciciosDoTreino.filter(exercicio => exercicio.diaDoTreino == 'quarta').map(exercicio => exercicio.descricao)
                    },
                ]

            },
            {
                stack: [
                    {
                        margin: [0, 30, 0, 10],
                        table: {
                            widths: ['*'],
                            body: [
                                [
                                    { text: 'Quinta', fontSize: 15, bold: true, color: 'white' }
                                ]
                            ]
                        },
                        layout: {
                            defaultBorder: false,
                            fillColor: '#548CA8',
                        }
                    },
                    {
                        ul: exerciciosDoTreino.filter(exercicio => exercicio.diaDoTreino == 'quinta').map(exercicio => exercicio.descricao)
                    },
                ]

            },
            {
                stack: [
                    {
                        margin: [0, 30, 0, 10],
                        table: {
                            widths: ['*'],
                            body: [
                                [
                                    { text: 'Sexta', fontSize: 15, bold: true, color: 'white' }
                                ]
                            ]
                        },
                        layout: {
                            defaultBorder: false,
                            fillColor: '#548CA8',
                        }
                    },
                    {
                        ul: exerciciosDoTreino.filter(exercicio => exercicio.diaDoTreino == 'sexta').map(exercicio => exercicio.descricao)
                    },
                ]

            },
            {
                stack: [
                    {
                        margin: [0, 30, 0, 10],
                        table: {
                            widths: ['*'],
                            body: [
                                [
                                    { text: 'Sábado', fontSize: 15, bold: true, color: 'white' }
                                ]
                            ]
                        },
                        layout: {
                            defaultBorder: false,
                            fillColor: '#548CA8',
                        }
                    },
                    {
                        ul: exerciciosDoTreino.filter(exercicio => exercicio.diaDoTreino == 'sabado').map(exercicio => exercicio.descricao)
                    },
                ]

            },
            {
                stack: [
                    {
                        margin: [0, 30, 0, 10],
                        table: {
                            widths: ['*'],
                            body: [
                                [
                                    { text: 'Domingo', fontSize: 15, bold: true, color: 'white' }
                                ]
                            ]
                        },
                        layout: {
                            defaultBorder: false,
                            fillColor: '#548CA8',
                        }
                    },
                    {
                        ul: exerciciosDoTreino.filter(exercicio => exercicio.diaDoTreino == 'domingo').map(exercicio => exercicio.descricao)
                    },
                ]

            },

        ]

    }

    pdfMake.createPdf(docDefinition).open();
}


const pjr = require('pactum-json-reporter');
const { reporter } = require('pactum');

before(() => {
    reporter.add(pjr);
  });

//Geral
require('./casosDeTeste/geral/fazerLogin');
require('./casosDeTeste/geral/esqueciMinhaSenha');
require('./casosDeTeste/geral/alterarSenha');
require('./casosDeTeste/geral/alterarImagemDoPerfil');
require('./casosDeTeste/geral/cadastrarNutricionista');
require('./casosDeTeste/geral/cadastrarPersonal');
require('./casosDeTeste/geral/cadastrarAssinante');
require('./casosDeTeste/geral/buscarPlanosAtivos');
require('./casosDeTeste/geral/buscarNutricionistasAtivos');
require('./casosDeTeste/geral/buscarPersonalTrainersAtivos');
require('./casosDeTeste/geral/buscarPlanoPorId');
require('./casosDeTeste/geral/buscarNutricionistaPorId');
require('./casosDeTeste/geral/buscarPersonalTrainerPorId');
require('./casosDeTeste/geral/enviarMensagem');
require('./casosDeTeste/geral/buscarMensagemPorId');
require('./casosDeTeste/geral/responderMensagem');
require('./casosDeTeste/geral/excluirMensagem');
require('./casosDeTeste/geral/buscarMensagensRecebidas');
require('./casosDeTeste/geral/buscarMensagensEnviadas');
require('./casosDeTeste/geral/buscarMensagensExcluidas');




//Administrador
require('./casosDeTeste/administrador/cadastrarPlano');
require('./casosDeTeste/administrador/buscarPlanos');
require('./casosDeTeste/administrador/buscarNutricionistas');
require('./casosDeTeste/administrador/buscarPersonalTrainers');
require('./casosDeTeste/administrador/buscarAssinantes');
require('./casosDeTeste/administrador/buscarAssinantePorId');
require('./casosDeTeste/administrador/buscarPlanoPorId');
require('./casosDeTeste/administrador/buscarNutriPorId');
require('./casosDeTeste/administrador/buscarPersonalPorId');
require('./casosDeTeste/administrador/alterarDadosDoPlano');
require('./casosDeTeste/administrador/alterarDadosDoNutricionista');
require('./casosDeTeste/administrador/alterarDadosDoPersonal');
require('./casosDeTeste/administrador/alterarStatusDoAssinante');

//Assinante
require('./casosDeTeste/assinante/buscarDadosDoDashboard');
require('./casosDeTeste/assinante/buscarDadosDoPerfil');
require('./casosDeTeste/assinante/alterarDadosDoPerfil');
require('./casosDeTeste/assinante/buscarDadosDaAssinatura');
require('./casosDeTeste/assinante/cancelarAssinatura');
require('./casosDeTeste/assinante/alterarPlanoDaAssinatura');
require('./casosDeTeste/assinante/buscarDadosDoNutri');
require('./casosDeTeste/assinante/buscarDadosDoPersonal');
require('./casosDeTeste/assinante/inserirMedidas');
require('./casosDeTeste/assinante/buscarMedidas');
require('./casosDeTeste/assinante/excluirMedidas');
require('./casosDeTeste/assinante/buscarDietas');
require('./casosDeTeste/assinante/buscarDietaPorId');
require('./casosDeTeste/assinante/buscarTreinos');
require('./casosDeTeste/assinante/buscarTreinoPorId');

//Nutricionista
require('./casosDeTeste/nutricionista/buscarDadosDoPerfil');
require('./casosDeTeste/nutricionista/alterarDadosDoPerfil');
require('./casosDeTeste/nutricionista/alterarInformacoesSobreMim');
require('./casosDeTeste/nutricionista/buscarPacientes');
require('./casosDeTeste/nutricionista/buscarPacientePorId');
require('./casosDeTeste/nutricionista/buscarMedidasDoPaciente');
require('./casosDeTeste/nutricionista/criarDieta');
require('./casosDeTeste/nutricionista/buscarDietaPorId');
require('./casosDeTeste/nutricionista/alterarDadosDaDieta');


//Personal
require('./casosDeTeste/personalTrainer/buscarDadosDoPerfil');
require('./casosDeTeste/personalTrainer/alterarDadosDoPerfil');
require('./casosDeTeste/personalTrainer/alterarInformacoesSobreMim');
require('./casosDeTeste/personalTrainer/buscarAlunos');
require('./casosDeTeste/personalTrainer/buscarAlunoPorId');
require('./casosDeTeste/personalTrainer/buscarMedidasDoAluno');
require('./casosDeTeste/personalTrainer/criarTreino');
require('./casosDeTeste/personalTrainer/buscarTreinoPorId');
require('./casosDeTeste/personalTrainer/alterarDadosDoTreino');

after(async () => {
    await reporter.end();
  });
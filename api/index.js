const express = require('express');
const fileUpload = require('express-fileupload');
const servidor = require('./servidor');
const autenticacaoMiddleware = require('./middlewares/autenticacaoMiddleware');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');
const esqueciMinhaSenhaController = require('./controllers/esqueciMinhaSenhaController');
const loginController = require('./controllers/loginController');
const usuariosController = require('./controllers/usuariosController');
const administradoresController = require('./controllers/administradoresController');
const nutricionistasController = require('./controllers/nutricionistasController');
const personalTrainersController = require('./controllers/personalTrainersController');
const assinantesController = require('./controllers/assinantesController');
const mensagensController = require('./controllers/mensagensController');
const autorizacao = require('./seguranca/autorizacao');
const model = require('./model/perfis');
const geralController = require('./controllers/geralController');
const cors = require('cors');

//middlewares
servidor.app.use(cors());
servidor.app.use(express.urlencoded({ limit: "50mb", extended: true}));
servidor.app.use(express.json({ limit: "50mb", extended: true }));
servidor.app.use(fileUpload({ createParentPath: true }));
servidor.app.use(autenticacaoMiddleware.autenticar);
servidor.app.use("/imagens", express.static("imagens"));

servidor.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDoc));


//Geral
servidor.app.post('/esqueciMinhaSenha', async (req, res) => await tratarErros(req, res, esqueciMinhaSenhaController.gerarNovaSenha));
servidor.app.post('/login', async (req, res) => await tratarErros(req, res, loginController.login));
servidor.app.patch('/usuarios/senha', async (req, res) => await tratarErros(req, res, usuariosController.alterarSenha));
servidor.app.post('/usuarios/imagem', async (req, res) => await tratarErros(req, res, usuariosController.alterarImagem));
servidor.app.get('/planos', async (req, res) => await tratarErros(req, res, geralController.buscarPlanos));
servidor.app.get('/planos/:idPlano', async (req, res) => await tratarErros(req, res, geralController.buscarPlanoPorId));

servidor.app.get('/nutricionistas', async (req, res) => await tratarErros(req, res, geralController.buscarNutricionistas));
servidor.app.get('/nutricionistas/:idNutri', async (req, res) => await tratarErros(req, res, geralController.buscarNutriPorId));

servidor.app.get('/personalTrainers', async (req, res) => await tratarErros(req, res, geralController.buscarPersonalTrainers));
servidor.app.get('/personalTrainers/:idPersonal', async (req, res) => await tratarErros(req, res, geralController.buscarPersonalPorId));



servidor.app.post('/mensagem', async (req, res) => await tratarErros(req, res, mensagensController.enviarMensagem));
servidor.app.get('/mensagem/recebidas', async (req, res) => await tratarErros(req, res, mensagensController.buscarMensagensRecebidas));
servidor.app.get('/mensagem/enviadas', async (req, res) => await tratarErros(req, res, mensagensController.buscarMensagensEnviadas));
servidor.app.get('/mensagem/excluidas', async (req, res) => await tratarErros(req, res, mensagensController.buscarMensagensExcluidas));
servidor.app.get('/mensagens/:idMensagem', async (req, res) => await tratarErros(req, res, mensagensController.buscarMensagemPorId));
servidor.app.patch('/mensagens/:idMensagem', async (req, res) => await tratarErros(req, res, mensagensController.excluirMensagem));
servidor.app.post('/mensagens/:idMensagem', async (req, res) => await tratarErros(req, res, mensagensController.responderMensagem));


//Administrador
servidor.app.post('/admin/planos', autorizacao.autorizar(model.perfil.administrador), async (req, res) => await tratarErros(req, res, administradoresController.cadastrarPlano));
servidor.app.get('/admin/planos', autorizacao.autorizar(model.perfil.administrador), async (req, res) => await tratarErros(req, res, administradoresController.buscarPlanos));
servidor.app.get('/admin/planos/:idPlano', autorizacao.autorizar(model.perfil.administrador), async (req, res) => await tratarErros(req, res, administradoresController.buscarPlanoPorId));
servidor.app.patch('/admin/planos/:idPlano', autorizacao.autorizar(model.perfil.administrador), async (req, res) => await tratarErros(req, res, administradoresController.alterarDadosDoPlano));

servidor.app.post('/admin/nutricionistas', autorizacao.autorizar(model.perfil.administrador), async (req, res) => await tratarErros(req, res, administradoresController.cadastrarNutricionista));
servidor.app.get('/admin/nutricionistas', autorizacao.autorizar(model.perfil.administrador), async (req, res) => await tratarErros(req, res, administradoresController.buscarNutricionistas));
servidor.app.get('/admin/nutricionistas/:idNutri', autorizacao.autorizar(model.perfil.administrador), async (req, res) => await tratarErros(req, res, administradoresController.buscarNutriPorId));
servidor.app.patch('/admin/nutricionistas/:idNutri', autorizacao.autorizar(model.perfil.administrador), async (req, res) => await tratarErros(req, res, administradoresController.alterarDadosDoNutricionista));

servidor.app.post('/admin/personalTrainers', autorizacao.autorizar(model.perfil.administrador), async (req, res) => await tratarErros(req, res, administradoresController.cadastrarPersonal));
servidor.app.get('/admin/personalTrainers', autorizacao.autorizar(model.perfil.administrador), async (req, res) => await tratarErros(req, res, administradoresController.buscarPersonalTrainers));
servidor.app.get('/admin/personalTrainers/:idPersonal', autorizacao.autorizar(model.perfil.administrador), async (req, res) => await tratarErros(req, res, administradoresController.buscarPersonalPorId));
servidor.app.patch('/admin/personalTrainers/:idPersonal', autorizacao.autorizar(model.perfil.administrador), async (req, res) => await tratarErros(req, res, administradoresController.alterarDadosDoPersonal));


servidor.app.get('/admin/assinantes', autorizacao.autorizar(model.perfil.administrador), async (req, res) => await tratarErros(req, res, administradoresController.buscarAssinantes));
servidor.app.get('/admin/assinantes/:idAssinante', autorizacao.autorizar(model.perfil.administrador), async (req, res) => await tratarErros(req, res, administradoresController.buscarAssinantePorId));
servidor.app.patch('/admin/assinantes/:idAssinante', autorizacao.autorizar(model.perfil.administrador), async (req, res) => await tratarErros(req, res, administradoresController.alterarStatusDoAssinante));


//Nutricionista
servidor.app.get('/nutricionista/perfil', autorizacao.autorizar(model.perfil.nutricionista), async (req, res) => await tratarErros(req, res, nutricionistasController.buscarDadosDoPerfil));
servidor.app.patch('/nutricionista/perfil', autorizacao.autorizar(model.perfil.nutricionista), async (req, res) => await tratarErros(req, res, nutricionistasController.alterarDadosDoPerfil));
servidor.app.patch('/nutricionista/sobreMim', autorizacao.autorizar(model.perfil.nutricionista), async (req, res) => await tratarErros(req, res, nutricionistasController.alterarInformacoesSobreMim));
servidor.app.get('/nutricionista/pacientes', autorizacao.autorizar(model.perfil.nutricionista), async (req, res) => await tratarErros(req, res, nutricionistasController.buscarPacientes));
servidor.app.get('/nutricionista/pacientes/:idAssinante', autorizacao.autorizar(model.perfil.nutricionista), async (req, res) => await tratarErros(req, res, nutricionistasController.buscarPacientePorId));
servidor.app.get('/nutricionista/pacientes/:idAssinante/medidas', autorizacao.autorizar(model.perfil.nutricionista), async (req, res) => await tratarErros(req, res, nutricionistasController.buscarMedidasDoPaciente));
servidor.app.post('/nutricionista/pacientes/:idAssinante/dietas', autorizacao.autorizar(model.perfil.nutricionista), async (req, res) => await tratarErros(req, res, nutricionistasController.criarDieta));
servidor.app.get('/nutricionista/pacientes/:idAssinante/dietas/:idDieta', autorizacao.autorizar(model.perfil.nutricionista), async (req, res) => await tratarErros(req, res, nutricionistasController.buscarDietaPorId));
servidor.app.patch('/nutricionista/pacientes/:idAssinante/dietas/:idDieta', autorizacao.autorizar(model.perfil.nutricionista), async (req, res) => await tratarErros(req, res, nutricionistasController.alterarDieta));

//Personal Trainer
servidor.app.get('/personalTrainer/perfil', autorizacao.autorizar(model.perfil.personalTrainer), async (req, res) => await tratarErros(req, res, personalTrainersController.buscarDadosDoPerfil));
servidor.app.patch('/personalTrainer/perfil', autorizacao.autorizar(model.perfil.personalTrainer), async (req, res) => await tratarErros(req, res, personalTrainersController.alterarDadosDoPerfil));
servidor.app.patch('/personalTrainer/sobreMim', autorizacao.autorizar(model.perfil.personalTrainer), async (req, res) => await tratarErros(req, res, personalTrainersController.alterarInformacoesSobreMim));
servidor.app.get('/personalTrainer/alunos', autorizacao.autorizar(model.perfil.personalTrainer), async (req, res) => await tratarErros(req, res, personalTrainersController.buscarAlunos));
servidor.app.get('/personalTrainer/alunos/:idAssinante', autorizacao.autorizar(model.perfil.personalTrainer), async (req, res) => await tratarErros(req, res, personalTrainersController.buscarAlunoPorId));
servidor.app.get('/personalTrainer/alunos/:idAssinante/medidas', autorizacao.autorizar(model.perfil.personalTrainer), async (req, res) => await tratarErros(req, res, personalTrainersController.buscarMedidasDoAluno));
servidor.app.post('/personalTrainer/alunos/:idAssinante/treinos', autorizacao.autorizar(model.perfil.personalTrainer), async (req, res) => await tratarErros(req, res, personalTrainersController.criarTreino));
servidor.app.get('/personalTrainer/alunos/:idAssinante/treinos/:idTreino', autorizacao.autorizar(model.perfil.personalTrainer), async (req, res) => await tratarErros(req, res, personalTrainersController.buscarTreinoPorId));
servidor.app.patch('/personalTrainer/alunos/:idAssinante/treinos/:idTreino', autorizacao.autorizar(model.perfil.personalTrainer), async (req, res) => await tratarErros(req, res, personalTrainersController.alterarTreino));

//Assinante
servidor.app.post('/assinantes', async (req, res) => await tratarErros(req, res, assinantesController.cadastrarAssinante));
servidor.app.get('/assinante/dashboard', autorizacao.autorizar(model.perfil.assinante), async (req, res) => await tratarErros(req, res, assinantesController.buscarDadosDoDashboard)); 
servidor.app.get('/assinante/perfil', autorizacao.autorizar(model.perfil.assinante), async (req, res) => await tratarErros(req, res, assinantesController.buscarDadosDoPerfil)); 
servidor.app.patch('/assinante/perfil', autorizacao.autorizar(model.perfil.assinante), async (req, res) => await tratarErros(req, res, assinantesController.alterarDadosDoPerfil));
servidor.app.get('/assinante/perfil/nutricionistas/:idNutri', autorizacao.autorizar(model.perfil.assinante), async (req, res) => await tratarErros(req, res, assinantesController.buscarDadosDoNutri)); 
servidor.app.get('/assinante/perfil/personalTrainers/:idPersonal', autorizacao.autorizar(model.perfil.assinante), async (req, res) => await tratarErros(req, res, assinantesController.buscarDadosDoPersonal)); 
servidor.app.get('/assinante/assinaturas/:idAssinatura', autorizacao.autorizar(model.perfil.assinante), async (req, res) => await tratarErros(req, res, assinantesController.buscarDadosDaAssinatura));
servidor.app.delete('/assinante/assinaturas/:idAssinatura', autorizacao.autorizar(model.perfil.assinante), async (req, res) => await tratarErros(req, res, assinantesController.cancelarAssinatura));
servidor.app.patch('/assinante/assinaturas/:idAssinatura', autorizacao.autorizar(model.perfil.assinante), async (req, res) => await tratarErros(req, res, assinantesController.alterarPlanoDaAssinatura));
servidor.app.patch('/assinante/assinaturas/:idAssinatura', autorizacao.autorizar(model.perfil.assinante), async (req, res) => await tratarErros(req, res, assinantesController.alterarPlanoDaAssinatura));
servidor.app.post('/assinante/medidas', autorizacao.autorizar(model.perfil.assinante), async (req, res) => await tratarErros(req, res, assinantesController.inserirMedidas));
servidor.app.get('/assinante/medidas', autorizacao.autorizar(model.perfil.assinante), async (req, res) => await tratarErros(req, res, assinantesController.buscarMedidas));
servidor.app.delete('/assinante/medidas/:idMedidas', autorizacao.autorizar(model.perfil.assinante), async (req, res) => await tratarErros(req, res, assinantesController.excluirMedidas));
servidor.app.get('/assinante/dietas', autorizacao.autorizar(model.perfil.assinante), async (req, res) => await tratarErros(req, res, assinantesController.buscarDietas));
servidor.app.get('/assinante/dietas/:idDieta', autorizacao.autorizar(model.perfil.assinante), async (req, res) => await tratarErros(req, res, assinantesController.buscarDietaPorId));
servidor.app.get('/assinante/treinos', autorizacao.autorizar(model.perfil.assinante), async (req, res) => await tratarErros(req, res, assinantesController.buscarTreinos));
servidor.app.get('/assinante/treino/:idTreino', autorizacao.autorizar(model.perfil.assinante), async (req, res) => await tratarErros(req, res, assinantesController.buscarTreinoPorId));

async function tratarErros(req, res, action) {
    try {
        await action(req, res);
    } catch (error) {
        if (error.interna) {
            res.status(400).send({ erro: error.mensagem });
        }
        else {
            res.status(500).send({ erro: "Houve um erro interno, tente novamente mais tarde" });
            console.log(error);
        }
    }
}

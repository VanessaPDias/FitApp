const repositorioDePlanos = require('../repositorios/repositorioDePlanos');
const Nutricionista = require('../model/nutricionista');
const Personal = require('../model/personalTrainer');
const repositorioDeNutricionistas = require('../repositorios/repositorioDeNutricionistas');
const repositorioDePersonalTrainers = require('../repositorios/repositorioDePersonalTrainers');
const servicoDeArquivosEstaticos = require('../servicos/servicoDeArquivosEstaticos');

async function buscarPlanos(req, res) {
    // #swagger.tags = ['Geral']
    // #swagger.description = 'endpoint para buscar planos ativos ao carregar a pagina do site.'
    // #swagger.security = [] 

    const planos = await repositorioDePlanos.buscarPlanosAtivos();

    if (!planos || planos <= 0) {
        res.status(400).send({ erro: "Planos não encontrado" });
        return;
    }

    res.send(planos.map(function (plano) {
        return {
            idPlano: plano.idPlano,
            nome: plano.nome,
            valor: plano.valor,
            duracao: plano.duracao,
            descricao: plano.descricao
        }
    }));
}

async function buscarNutricionistas(req, res) {
    // #swagger.tags = ['Geral']
    // #swagger.description = 'endpoint para buscar Nutricionistas ativos ao carregar a pagina do site.'
    // #swagger.security = [] 

    const nutricionistas = await repositorioDeNutricionistas.buscarNutricionistasAtivos();

    if (!nutricionistas || nutricionistas <= 0) {
        res.status(400).send({ erro: "Nutricionistas não encontrado" });
        return;
    }

    res.send(nutricionistas.map(function (nutri) {
        return {
            idNutri: nutri.idNutri,
            nome: nutri.nome,
            imagem: servicoDeArquivosEstaticos.construirCaminhoParaImagem(nutri.imagem),
            sobreMim: nutri.sobreMim
        }
    }));
}

async function buscarPersonalTrainers(req, res) {
    // #swagger.tags = ['Geral']
    // #swagger.description = 'endpoint para buscar buscar Personal Trainers ativos ao carregar a pagina do site.'
    // #swagger.security = [] 

    const personalTrainers = await repositorioDePersonalTrainers.buscarPersonalTrainersAtivos();

    if (!personalTrainers || personalTrainers <= 0) {
        res.status(400).send({ erro: "Personal Trainers não encontrado" });
        return;
    }

    res.send(personalTrainers.map(function (personal) {
        return {
            idPersonal: personal.idPersonal,
            nome: personal.nome,
            imagem: servicoDeArquivosEstaticos.construirCaminhoParaImagem(personal.imagem),
            sobreMim: personal.sobreMim
        }
    }));
}

async function buscarNutriPorId(req, res) {
    // #swagger.tags = ['Geral']
    // #swagger.description = 'endpoint para buscar Nutricionista por Id na pagina do site.'
    // #swagger.security = [] 

    const dadosDoNutri = await repositorioDeNutricionistas.buscarNutriPorId(req.params.idNutri);

    if (!dadosDoNutri) {
        res.status(404).send({ erro: "Nutricionista não encontrado" });
        return;
    }

    res.send({
        idNutri: dadosDoNutri.idNutri,
        nome: dadosDoNutri.nome,
        imagem: servicoDeArquivosEstaticos.construirCaminhoParaImagem(dadosDoNutri.imagem),
        sobreMim: dadosDoNutri.sobreMim
    });
}

async function buscarPersonalPorId(req, res) {
    // #swagger.tags = ['Geral']
    // #swagger.description = 'endpoint para buscar Personal trainer por Id na pagina do site.'
    // #swagger.security = [] 

    const dadosDoPersonal = await repositorioDePersonalTrainers.buscarPersonalPorId(req.params.idPersonal);

    if (!dadosDoPersonal) {
        res.status(404).send({ erro: "Personal Trainer não encontrado" });
        return;
    }

    res.send({
        idPersonal: dadosDoPersonal.idPersonal,
        nome: dadosDoPersonal.nome,
        imagem: servicoDeArquivosEstaticos.construirCaminhoParaImagem(dadosDoPersonal.imagem),
        sobreMim: dadosDoPersonal.sobreMim
    });
}

async function buscarPlanoPorId(req, res) {
    // #swagger.tags = ['Geral']
    // #swagger.description = 'endpoint para buscar Plano por Id na pagina do site.'
    // #swagger.security = [] 

    const dadosDoPlano = await repositorioDePlanos.buscarPlanoPorId(req.params.idPlano);

    if (!dadosDoPlano) {
        res.status(404).send({ erro: "Plano não encontrado" });
        return;
    }

    res.send({
        idPlano: dadosDoPlano.idPlano,
        nome: dadosDoPlano.nome,
        valor: dadosDoPlano.valor,
        duracao: dadosDoPlano.duracao,
        descricao: dadosDoPlano.descricao
    });
}

    
async function cadastrarNutricionista(req, res) {
    // #swagger.tags = ['geral']
    // #swagger.description = 'endpoint para cadastrar Nutricionista.'

    const novoNutricionista = new Nutricionista.Nutricionista(req.body.nome, req.body.email, req.body.telefone, req.body.registroProfissional);
    
    const nutriEncontrado = await repositorioDeNutricionistas.verificarSeNutriJaTemCadastro(novoNutricionista.idNutri, novoNutricionista.email);

    if (!nutriEncontrado) {

        await repositorioDeNutricionistas.criarNutricionista(novoNutricionista);

        res.send({
            idNutri: novoNutricionista.idNutri
        });
    } else {
        res.status(400).send({ erro: "Esse e-mail já foi cadastrado" });
    }
}

async function cadastrarPersonal(req, res) {
    // #swagger.tags = ['Geral']
    // #swagger.description = 'endpoint para cadastrar Personal Trainer.'

    const novoPersonal = new Personal.PersonalTrainer(req.body.nome, req.body.email, req.body.telefone, req.body.registroProfissional);

    const personalEncontrado = await repositorioDePersonalTrainers.verificarSePersonalJaTemCadastro(novoPersonal.idPersonal, novoPersonal.email);

    if (!personalEncontrado) {

        await repositorioDePersonalTrainers.criarPersonal(novoPersonal);

        res.send({
            idPersonal: novoPersonal.idPersonal
        });
    } else {
        res.status(400).send({ erro: "Esse e-mail já foi cadastrado" });
    }
}

module.exports = {
    buscarPlanos: buscarPlanos,
    buscarNutricionistas: buscarNutricionistas,
    buscarPersonalTrainers: buscarPersonalTrainers,
    buscarNutriPorId: buscarNutriPorId,
    buscarPersonalPorId: buscarPersonalPorId,
    buscarPlanoPorId: buscarPlanoPorId,
    cadastrarNutricionista: cadastrarNutricionista,
    cadastrarPersonal: cadastrarPersonal,
}
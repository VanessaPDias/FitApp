const Nutricionista = require('../model/nutricionista');
const Personal = require('../model/personalTrainer');
const Plano = require('../model/plano');
const repositorioDePlanos = require('../repositorios/repositorioDePlanos');
const repositorioDeNutricionistas = require('../repositorios/repositorioDeNutricionistas');
const repositorioDePersonalTrainers = require('../repositorios/repositorioDePersonalTrainers');
const servicoDeEmail = require('../servicos/servicoDeEmail');
const servicoDeMensagens = require('../servicos/servicoDeMensagens');
const repositorioDeAssinantes = require('../repositorios/repositorioDeAssinantes');
const Assinante = require('../model/assinante');

// O administrador cadastra plano
async function cadastrarPlano(req, res) {
    // #swagger.tags = ['Administrador']
    // #swagger.description = 'endpoint para cadastrar um Plano.'

    const novoPlano = new Plano.Plano(req.body.nome, req.body.valor, req.body.duracao, req.body.descricao);
    
    const planoEncontrado = await repositorioDePlanos.verificarSeJaExistePlanoCadastradoPeloNome(novoPlano.idPlano, novoPlano.nome);

    if (!planoEncontrado) {
        await repositorioDePlanos.criarPlano(novoPlano);

        res.send({
            idPlano: novoPlano.idPlano
        });

    } else {
        res.status(400).send({ erro: "Esse plano já foi cadastrado" });
        return;
    }
}

// O administrador busca todos os planos ou filtra por nome
async function buscarPlanos(req, res) {
    // #swagger.tags = ['Administrador']
    // #swagger.description = 'endpoint para buscar planos - todos ou por nome.'

    const planos = await repositorioDePlanos.buscarPlanosPorFiltro(req.query.nome);

    if (!planos || planos <= 0) {
        res.status(400).send({ erro: "Plano não encontrado" });
        return;
    }

    res.send(planos.map(function (plano) {
        return {
            idPlano: plano.idPlano,
            nome: plano.nome,
            valor: plano.valor,
            duracao: plano.duracao,
            bloqueado: Boolean(plano.bloqueado),
            descricao: plano.descricao
        }

    }))
}

// O administrador busca plano por Id
async function buscarPlanoPorId(req, res) {
    // #swagger.tags = ['Administrador']
    // #swagger.description = 'endpoint para buscar plano por Id.'

    let planoEncontrado = await repositorioDePlanos.buscarPlanoPorId(req.params.idPlano);

    if (!planoEncontrado) {
        res.status(404).send({ erro: "Plano não encontrado" });
        return;
    }

    res.send({
        idPlano: planoEncontrado.idPlano,
        nome: planoEncontrado.nome,
        valor: planoEncontrado.valor,
        duracao: planoEncontrado.duracao,
        descricao: planoEncontrado.descricao,
        bloqueado: Boolean(planoEncontrado.bloqueado),
    })
}

// O administrador altera dados do plano
async function alterarDadosDoPlano(req, res) {
    // #swagger.tags = ['Administrador']
    // #swagger.description = 'endpoint para alterar dados do plano.'

    const planoEncontrado = await repositorioDePlanos.buscarPlanoPorId(req.params.idPlano);

    if (!planoEncontrado) {
        res.status(404).send({ erro: "Plano não encontrado" });
        return;
    }

    const planoComMesmoNome = await repositorioDePlanos.verificarSeJaExistePlanoCadastradoPeloNome(req.params.idPlano, req.body.nome);

    if (planoComMesmoNome) {
        res.status(400).send({ erro: "Já existe Plano com esse nome" });
        return;
    }

    const bloqueado = req.body.bloqueado == 'true' ? true : false;
    await repositorioDePlanos.salvarAlteracaoDeDados(req.params.idPlano, req.body.nome, req.body.valor, req.body.duracao, req.body.descricao, bloqueado);

    res.send();

}

// O administrador cadastra Nutricionista
async function cadastrarNutricionista(req, res) {
    // #swagger.tags = ['Administrador']
    // #swagger.description = 'endpoint para cadastrar Nutricionista.'

    const novoNutricionista = new Nutricionista.Nutricionista(req.body.nome, req.body.email, req.body.telefone, req.body.registroProfissional);
    
    const nutriEncontrado = await repositorioDeNutricionistas.verificarSeNutriJaTemCadastro(novoNutricionista.idNutri, novoNutricionista.email);

    if (!nutriEncontrado) {

        await repositorioDeNutricionistas.criarNutricionista(novoNutricionista);

        servicoDeEmail.enviar(novoNutricionista.email, 'Bem vindo ao FitApp', servicoDeMensagens.gerarMensagemDeBoasVindas(novoNutricionista.nome, novoNutricionista.usuario.senha));

        res.send({
            idNutri: novoNutricionista.idNutri
        });
    } else {
        res.status(400).send({ erro: "Esse e-mail já foi cadastrado" });
    }
}

// O administrador buscar todos os nutricionistas ou filtra pelo nome
async function buscarNutricionistas(req, res) {
    // #swagger.tags = ['Administrador']
    // #swagger.description = 'endpoint para buscar Nutricionistas cadastrados - todos ou por nome.'

    const nutricionistas = await repositorioDeNutricionistas.buscarNutricionistasPorFiltro(req.query.nome);

    if (!nutricionistas || nutricionistas.length <= 0) {
        res.status(400).send({ erro: "Nutricionista não encontrado" });
        return;
    }

    res.send(nutricionistas.map(function (nutri) {
        return {
            idNutri: nutri.idNutri,
            nome: nutri.nome,
            email: nutri.email,
            telefone: nutri.telefone,
            registro: nutri.registro,
            bloqueado: Boolean(nutri.bloqueado)
        }
    }));
}

// O administrador busca nutricionista por Id
async function buscarNutriPorId(req, res) {
    // #swagger.tags = ['Administrador']
    // #swagger.description = 'endpoint para buscar Nutricionistas por Id.'

    const nutriEncontrado = await repositorioDeNutricionistas.buscarNutriPorId(req.params.idNutri);

    if (!nutriEncontrado) {
        res.status(404).send({ erro: "Nutricionista não encontrado" });
        return;
    }

    res.send({
        idNutri: nutriEncontrado.idNutri,
        nome: nutriEncontrado.nome,
        email: nutriEncontrado.email,
        telefone: nutriEncontrado.telefone,
        registro: nutriEncontrado.registroProfissional,
        sobreMim: nutriEncontrado.sobreMim,
        imagem: nutriEncontrado.imagem,
        bloqueado: Boolean(nutriEncontrado.bloqueado)
    });
}

// O administrador altera dados do nutricionista
async function alterarDadosDoNutricionista(req, res) {
    // #swagger.tags = ['Administrador']
    // #swagger.description = 'endpoint para alterar dados cadastrais do Nutricionista.'

    const nutriEncontrado = await repositorioDeNutricionistas.buscarNutriPorId(req.params.idNutri);

    if (!nutriEncontrado) {
        res.status(404).send({ erro: "Nutricionista não encontrado" });
        return;
    }

    const nutriComMesmoEmail = await repositorioDeNutricionistas.verificarSeNutriJaTemCadastro(req.params.idNutri, req.body.email);

    if (nutriComMesmoEmail) {
        res.status(400).send({ erro: "Já existe Nutricionista cadastrado com esse email" });
        return;
    }

    await repositorioDeNutricionistas.salvarAlteracaoDeDados(
        req.params.idNutri,
        req.body.nome,
        req.body.email,
        req.body.telefone,
        req.body.registroProfissional,
        req.body.bloqueado
    );

    res.send();
}

// O administrador cadastra personal trainer
async function cadastrarPersonal(req, res) {
    // #swagger.tags = ['Administrador']
    // #swagger.description = 'endpoint para cadastrar Personal Trainer.'

    const novoPersonal = new Personal.PersonalTrainer(req.body.nome, req.body.email, req.body.telefone, req.body.registroProfissional);

    const personalEncontrado = await repositorioDePersonalTrainers.verificarSePersonalJaTemCadastro(novoPersonal.idPersonal, novoPersonal.email);

    if (!personalEncontrado) {

        await repositorioDePersonalTrainers.criarPersonal(novoPersonal);

        servicoDeEmail.enviar(novoPersonal.email, 'Bem vindo ao FitApp', servicoDeMensagens.gerarMensagemDeBoasVindas(novoPersonal.nome, novoPersonal.usuario.senha));

        res.send({
            idPersonal: novoPersonal.idPersonal
        });
    } else {
        res.status(400).send({ erro: "Esse e-mail já foi cadastrado" });
    }
}

// O administrador busca todos os personal trainers ou filtra por nome
async function buscarPersonalTrainers(req, res) {
    // #swagger.tags = ['Administrador']
    // #swagger.description = 'endpoint para buscar Personal Trainer - todos ou por nome.'

    const personalTrainers = await repositorioDePersonalTrainers.buscarPersonalTrainersPorFiltro(req.query.nome);

    if (!personalTrainers || personalTrainers.length <= 0) {
        res.status(400).send({ erro: "Personal Trainer não encontrado" });
        return;
    }

    res.send(personalTrainers.map(function (personal) {
        return {
            idPersonal: personal.idPersonal,
            nome: personal.nome,
            email: personal.email,
            telefone: personal.telefone,
            registro: personal.registro,
            bloqueado: Boolean(personal.bloqueado)
        }
    }));
}

// O administrador busca personal trainer por Id
async function buscarPersonalPorId(req, res) {
    // #swagger.tags = ['Administrador']
    // #swagger.description = 'endpoint para buscar Personal Trainer por Id.'

    const personalEncontrado = await repositorioDePersonalTrainers.buscarPersonalPorId(req.params.idPersonal);

    if (!personalEncontrado) {
        res.status(404).send({ erro: "Personal Trainer não encontrado" });
        return;
    }

    res.send({
        idPersonal: personalEncontrado.idPersonal,
        nome: personalEncontrado.nome,
        email: personalEncontrado.email,
        telefone: personalEncontrado.telefone,
        registro: personalEncontrado.registroProfissional,
        sobreMim: personalEncontrado.sobreMim,
        imagem: personalEncontrado.imagem,
        bloqueado: Boolean(personalEncontrado.bloqueado) 
    })
}

// O administrador altera dados do personal trainer
async function alterarDadosDoPersonal(req, res) {
    // #swagger.tags = ['Administrador']
    // #swagger.description = 'endpoint para alterar os dados cadastrais do Personal Trainer.'

    const personalEncontrado = await repositorioDePersonalTrainers.buscarPersonalPorId(req.params.idPersonal);

    if (!personalEncontrado) {
        res.status(404).send({ erro: "Personal Trainer não encontrado" });
        return;
    }

    const personalComMesmoEmail = await repositorioDePersonalTrainers.verificarSePersonalJaTemCadastro(req.params.idPersonal, req.body.email);

    if (personalComMesmoEmail) {
        res.status(400).send({ erro: "Já existe Personal Trainer cadastrado com esse email" });
        return;
    }

    await repositorioDePersonalTrainers.salvarAlteracaoDeDados(
        req.params.idPersonal,
        req.body.nome,
        req.body.email,
        req.body.telefone,
        req.body.registroProfissional,
        req.body.bloqueado
    );

    res.send();
}

// O administrador busca todos os Assinantes ou filtra por nome
async function buscarAssinantes(req, res) {
    // #swagger.tags = ['Administrador']
    // #swagger.description = 'endpoint para buscar assinantes cadastrados - todos ou por nome.'

    const assinantes = await repositorioDeAssinantes.buscarAssinantePorFiltro(req.query.nome);

    if (!assinantes || assinantes.length <= 0) {
        res.send([]);
        return;
    }

    res.send(assinantes.map(function (assinante) {
        return {
            idAssinante: assinante.idAssinante,
            nome: assinante.nome,
            email: assinante.email,
            bloqueado: Boolean(assinante.bloqueado)
        }
    }));

}

// O administrador busca assinantes por Id
async function buscarAssinantePorId(req, res) {
    // #swagger.tags = ['Administrador']
    // #swagger.description = 'endpoint para buscar assinantes por Id.'

    const assinanteEncontrado = await repositorioDeAssinantes.buscarAssinantePorId(req.params.idAssinante);

    if (!assinanteEncontrado) {
        res.status(404).send({ erro: "Assinante não encontrado" });
        return;
    }

    res.send({
        idAssinante: assinanteEncontrado.idAssinante,
        nome: assinanteEncontrado.nome,
        email: assinanteEncontrado.email,
        usuarioBloqueado: Boolean(assinanteEncontrado.usuarioBloqueado), 
        idAssinatura: assinanteEncontrado.idAssinatura,
        assinaturaBloqueada: Boolean(assinanteEncontrado.assinaturaBloqueada),
        dataInicio: assinanteEncontrado.dataInicio,
        dataFim: assinanteEncontrado.dataFim,
        idPlano: assinanteEncontrado.idPlano,
        nomePlano: assinanteEncontrado.nomePlano,
        valor: assinanteEncontrado.valor
    });

}

// O administrador altera o status do Assinante
async function alterarStatusDoAssinante(req, res) {
    // #swagger.tags = ['Administrador']
    // #swagger.description = 'endpoint para alterar o status do Assinante.'

    const assinanteEncontrado = await repositorioDeAssinantes.buscarAssinantePorId(req.params.idAssinante);
    if (!assinanteEncontrado) {
        res.status(404).send({ erro: "Assinante não encontrado" });
        return;
    }

    Assinante.validarAlteracaoDeStatus(req.body.bloqueado);

    await repositorioDeAssinantes.salvarAlteracaoDeStatus(req.params.idAssinante, req.body.bloqueado);

    res.send();
}

module.exports = {
    buscarPlanos: buscarPlanos,
    buscarPlanoPorId: buscarPlanoPorId,
    alterarDadosDoPlano: alterarDadosDoPlano,
    cadastrarPlano: cadastrarPlano,
    cadastrarNutricionista: cadastrarNutricionista,
    buscarNutricionistas: buscarNutricionistas,
    buscarNutriPorId: buscarNutriPorId,
    alterarDadosDoNutricionista: alterarDadosDoNutricionista,
    cadastrarPersonal: cadastrarPersonal,
    buscarPersonalTrainers: buscarPersonalTrainers,
    buscarPersonalPorId: buscarPersonalPorId,
    alterarDadosDoPersonal: alterarDadosDoPersonal,
    buscarAssinantes: buscarAssinantes,
    buscarAssinantePorId: buscarAssinantePorId,
    alterarStatusDoAssinante: alterarStatusDoAssinante,

}
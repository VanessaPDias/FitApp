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

    if (!planos || planos.length <= 0) {
        res.send([]);
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

// O administrador buscar todos nutricionistas cadastrados ou por filtro
async function buscarNutricionistas(req, res) {
    // #swagger.tags = ['Administrador']
    // #swagger.description = 'endpoint para buscar Nutricionistas cadastrados ou por filtro.'

    let bloqueado;

    if (req.query.bloqueado == 'true') {
        bloqueado = true;
    } else if (req.query.bloqueado == 'false') {
        bloqueado = false;
    }


    const nutricionistas = await repositorioDeNutricionistas.buscarNutricionistasPorFiltro(req.query.nome, bloqueado, req.query.cadastroConfirmado);

    if (!nutricionistas || nutricionistas.length <= 0) {
        res.send([]);
        return;
    }

    res.send(nutricionistas.map(function (nutri) {
        return {
            idNutri: nutri.idNutri,
            nome: nutri.nome,
            email: nutri.email,
            cadastroConfirmado: nutri.cadastroConfirmado,
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
        registroProfissional: nutriEncontrado.registroProfissional,
        sobreMim: nutriEncontrado.sobreMim,
        imagem: nutriEncontrado.imagem,
        bloqueado: Boolean(nutriEncontrado.bloqueado),
        cadastroConfirmado: nutriEncontrado.cadastroConfirmado
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

    const bloqueado = req.body.bloqueado == 'true' ? true : false;

    await repositorioDeNutricionistas.salvarAlteracaoDeCadastro(
        req.params.idNutri,
        req.body.registroProfissional,
        bloqueado,
        req.body.cadastroConfirmado
    );

    res.send();
}

// O administrador busca todos os personal trainers ou filtra por nome
async function buscarPersonalTrainers(req, res) {
    // #swagger.tags = ['Administrador']
    // #swagger.description = 'endpoint para buscar Personal Trainer - todos ou por nome.'

    let bloqueado;

    if (req.query.bloqueado == 'true') {
        bloqueado = true;
    } else if (req.query.bloqueado == 'false') {
        bloqueado = false;
    }

    const personalTrainers = await repositorioDePersonalTrainers.buscarPersonalTrainersPorFiltro(req.query.nome, bloqueado, req.query.cadastroConfirmado);

    if (!personalTrainers || personalTrainers.length <= 0) {
        res.send([]);
        return;
    }

    res.send(personalTrainers.map(function (personal) {
        return {
            idPersonal: personal.idPersonal,
            nome: personal.nome,
            email: personal.email,
            cadastroConfirmado: personal.cadastroConfirmado,
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
        registroProfissional: personalEncontrado.registroProfissional,
        sobreMim: personalEncontrado.sobreMim,
        imagem: personalEncontrado.imagem,
        bloqueado: Boolean(personalEncontrado.bloqueado),
        cadastroConfirmado: personalEncontrado.cadastroConfirmado
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

    const bloqueado = req.body.bloqueado == 'true' ? true : false;

    await repositorioDePersonalTrainers.salvarAlteracaoDeCadastro(
        req.params.idPersonal,
        req.body.registroProfissional,
        bloqueado,
        req.body.cadastroConfirmado
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
    buscarNutricionistas: buscarNutricionistas,
    buscarNutriPorId: buscarNutriPorId,
    alterarDadosDoNutricionista: alterarDadosDoNutricionista,
    buscarPersonalTrainers: buscarPersonalTrainers,
    buscarPersonalPorId: buscarPersonalPorId,
    alterarDadosDoPersonal: alterarDadosDoPersonal,
    buscarAssinantes: buscarAssinantes,
    buscarAssinantePorId: buscarAssinantePorId,
    alterarStatusDoAssinante: alterarStatusDoAssinante,

}
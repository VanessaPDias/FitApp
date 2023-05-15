const repositorioDeAssinantes = require('../repositorios/repositorioDeAssinantes');
const servicoDeEmail = require('../servicos/servicoDeEmail');
const servicoDeArquivosEstaticos = require('../servicos/servicoDeArquivosEstaticos');
const servicoDeMensagens = require('../servicos/servicoDeMensagens');
const repositorioDeNutricionistas = require('../repositorios/repositorioDeNutricionistas');
const repositorioDePersonal = require('../repositorios/repositorioDePersonalTrainers');
const repositorioDePlanos = require('../repositorios/repositorioDePlanos');
const repositorioDeAssinaturas = require('../repositorios/repositorioDeAssinaturas');
const repositorioDePersonalTrainers = require('../repositorios/repositorioDePersonalTrainers');
const repositorioDeMensagens = require('../repositorios/repositorioDeMensagens');
const repositorioDeUsuarios = require('../repositorios/repositorioDeUsuarios');
const repositorioDeMedidas = require('../repositorios/repositorioDeMedidas');
const repositorioDeDietas = require('../repositorios/repositorioDeDietas');
const repositorioDeTreinos = require('../repositorios/repositorioDeTreinos');
const Assinante = require('../model/assinante');
const Assinatura = require('../model/assinatura');
const Medidas = require('../model/medidas');
const Mensagem = require('../model/mensagem');
const Idade = require('../model/idade');
const Imc = require('../model/imc');

//O Assinante faz cadastro
async function cadastrarAssinante(req, res) {
    // #swagger.tags = ['Assinante']
    // #swagger.description = 'endpoint para cadastrar Assinante.'

    const planoEncontrado = await repositorioDePlanos.buscarPlanoPorId(req.body.idPlano);
    if (!planoEncontrado) {
        res.status(404).send({ erro: "Plano não encontrado" });
        return;
    }

    const nutriEncontrado = await repositorioDeNutricionistas.buscarNutriPorId(req.body.idNutri);
    if (!nutriEncontrado) {
        res.status(404).send({ erro: "Nutricionista não encontrado" });
        return;
    }

    const personalEncontrado = await repositorioDePersonal.buscarPersonalPorId(req.body.idPersonal);
    if (!personalEncontrado) {
        res.status(404).send({ erro: "Personal não encontrado" });
        return;
    }

    const assinanteEncontrado = await repositorioDeAssinantes.verificarSeAssinanteJaTemCadastro(req.body.email);
    if (!assinanteEncontrado) {
        const novoAssinante = new Assinante.Assinante(req.body.nome, req.body.email, planoEncontrado, req.body.idNutri, req.body.idPersonal);

        await repositorioDeAssinantes.criarAssinante(novoAssinante);

        servicoDeEmail.enviar(novoAssinante.email, 'Bem vindo ao FitApp', servicoDeMensagens.gerarMensagemDeBoasVindas(novoAssinante.nome, novoAssinante.usuario.senha));

        const admin = await repositorioDeUsuarios.buscarAdmin();

        repositorioDeMensagens.salvarMensagem(new Mensagem.Mensagem(admin.idUsuario, admin.login, nutriEncontrado.idNutri, nutriEncontrado.email, 'Novo Assinante', servicoDeMensagens.gerarNotificacaoNovoAssinante(nutriEncontrado.nome, novoAssinante.nome)));
        repositorioDeMensagens.salvarMensagem(new Mensagem.Mensagem(admin.idUsuario, admin.login, personalEncontrado.idPersonal, personalEncontrado.email, 'Novo Assinante', servicoDeMensagens.gerarNotificacaoNovoAssinante(personalEncontrado.nome, novoAssinante.nome)));


        res.send({
            idAssinante: novoAssinante.idAssinante
        });
    } else {
        res.status(400).send({ erro: "Esse e-mail já foi cadastrado" });
    }
}

//O sistema busca os dados da Dashboard do Assinante
async function buscarDadosDoDashboard(req, res) {
    // #swagger.tags = ['Assinante']
    // #swagger.description = 'endpoint para buscar dados do daskboard do assinante.'

    const dadosDoAssinante = await repositorioDeAssinantes.buscarDadosDoDashboardDoAssinantePorId(req.usuario.idUsuario);

    const altura = !dadosDoAssinante.dados.altura ? 0 : dadosDoAssinante.dados.altura;
    const peso = !dadosDoAssinante.pesoAtual ? 0 : dadosDoAssinante.pesoAtual.peso;

    res.send({
        idAssinante: dadosDoAssinante.dados.idAssinante,
        imagem: dadosDoAssinante.dados.imagem,
        nome: dadosDoAssinante.dados.nome,
        altura: altura,
        idade: new Idade.Idade(dadosDoAssinante.dados.dataNascimento).valor,
        peso: peso,
        imc: new Imc.Imc(peso, altura).valor,
        medidas: dadosDoAssinante.historicoDePeso,
        dietaAtual: dadosDoAssinante.dietas && dadosDoAssinante.dietas.length > 0 ? dadosDoAssinante.dietas[0] : null,
        treinoAtual: dadosDoAssinante.treinos && dadosDoAssinante.treinos.length > 0 ? dadosDoAssinante.treinos[0] : null
    })
}

//O sistema busca os dados do perfil do Assinante
async function buscarDadosDoPerfil(req, res) {
    // #swagger.tags = ['Assinante']
    // #swagger.description = 'endpoint para buscar dados do perfil do assinante.'

    const dadosDoAssinante = await repositorioDeAssinantes.buscarDadosDoPerfilDoAssinantePorId(req.usuario.idUsuario);


    res.send({
        idAssinante: dadosDoAssinante.idAssinante,
        imagem: servicoDeArquivosEstaticos.construirCaminhoParaImagem(dadosDoAssinante.imagem),
        email: dadosDoAssinante.login,
        nome: dadosDoAssinante.nome,
        dataNascimento: dadosDoAssinante.dataNascimento,
        sexo: dadosDoAssinante.idSexo,
        altura: dadosDoAssinante.altura,
        idNutri: dadosDoAssinante.idNutri,
        idPersonal: dadosDoAssinante.idPersonal,
        idAssinatura: dadosDoAssinante.idAssinatura,
        idPlano: dadosDoAssinante.idPlano
    })

}

//O Assinante altera dados do perfil
async function alterarDadosDoPerfil(req, res) {
    // #swagger.tags = ['Assinante']
    // #swagger.description = 'endpoint para alterar os dados do perfil.'

    Assinante.validarAlteracaoDoPerfil(req.body.nome);
    await repositorioDeAssinantes.salvarAlteracaoDeDadosDoPerfil(req.usuario.idUsuario, req.body.nome, req.body.dataNascimento, req.body.idSexo, req.body.altura);

    res.send();
}

//O Assinante insere medidas
async function inserirMedidas(req, res) {
    // #swagger.tags = ['Assinante']
    // #swagger.description = 'endpoint para inserir medidas.'

    Medidas.validarInsercaoDeMedidas(req.body.peso, req.body.pescoco, req.body.cintura, req.body.quadril);
    const medidas = new Medidas.Medidas(req.body.peso, req.body.pescoco, req.body.cintura, req.body.quadril);

    await repositorioDeMedidas.salvarMedidas(req.usuario.idUsuario, medidas);

    res.send({ idMedidas: medidas.idMedidas });
}

//O Assinante busca historico de medidas
async function buscarMedidas(req, res) {
    // #swagger.tags = ['Assinante']
    // #swagger.description = 'endpoint para buscar medidas.'

    let medidasOrdenadasPorData = await repositorioDeMedidas.buscarMedidas(req.usuario.idUsuario);

    if (medidasOrdenadasPorData <= 0) {
        res.status(404).send({ erro: "Medidas não encontrada" });
        return;
    }

    let medidasAtuais;

    if (!medidasOrdenadasPorData) {
        medidasAtuais = {
            peso: 0,
            pescoco: 0,
            cintura: 0,
            quadril: 0
        };
        medidasOrdenadasPorData = new Array();
    } else {
        medidasAtuais = medidasOrdenadasPorData[0]
    }

    res.send({
        historicoDeMedidas: medidasOrdenadasPorData,
        medidasAtuais: medidasAtuais
    });
}

//O Assinante exclui medidas
async function excluirMedidas(req, res) {
    // #swagger.tags = ['Assinante']
    // #swagger.description = 'endpoint para excluir medidas.'

    const medidaEncontrada = await repositorioDeMedidas.buscarMedidaPorId(req.usuario.idUsuario, req.params.idMedidas);

    if (!medidaEncontrada) {
        res.status(404).send({ erro: "Medidas não encontrada" });
        return;
    }

    await repositorioDeMedidas.excluirMedidas(req.usuario.idUsuario, req.params.idMedidas);

    res.send();
}

//O Assinante busca dados da assinatura
async function buscarDadosDaAssinatura(req, res) {
    // #swagger.tags = ['Assinante']
    // #swagger.description = 'endpoint para buscar dados da Assinatura.'

    const dadosDaAssinatura = await repositorioDeAssinaturas.buscarAssinaturaPorId(req.usuario.idUsuario, req.params.idAssinatura);

    if (!dadosDaAssinatura) {
        res.status(404).send({ erro: "Assinatura não encontrada" });
        return;
    }

    res.send({
        dataInicio: dadosDaAssinatura.dataInicio,
        dataFim: dadosDaAssinatura.dataFim,
        idPlano: dadosDaAssinatura.idPlano,
        nome: dadosDaAssinatura.nome,
        valor: dadosDaAssinatura.valor,
        descricao: dadosDaAssinatura.descricao,
        bloqueado: Boolean(dadosDaAssinatura.bloqueado)
    });
}

//O Assinante cancela assinatura
async function cancelarAssinatura(req, res) {
    // #swagger.tags = ['Assinante']
    // #swagger.description = 'endpoint para cancelar Assinatura.'

    const dadosDaAssinatura = await repositorioDeAssinaturas.buscarAssinaturaPorId(req.usuario.idUsuario, req.params.idAssinatura);

    if (!dadosDaAssinatura) {
        res.status(404).send({ erro: "Assinatura não encontrada" });
        return;
    }

    if (dadosDaAssinatura.bloqueado == true) {
        res.status(400).send({ erro: "Assinatura já está cancelada" });
        return;
    }

    await repositorioDeAssinaturas.cancelarAssinatura(req.usuario.idUsuario, req.params.idAssinatura);
    res.send();
}

//O Assinante altera dados da assinatura
async function alterarPlanoDaAssinatura(req, res) {
    // #swagger.tags = ['Assinante']
    // #swagger.description = 'endpoint para alterar o Plano da Assinatura.'

    const assinaturaEncontrada = await repositorioDeAssinaturas.buscarAssinaturaPorId(req.usuario.idUsuario, req.params.idAssinatura);
    if (!assinaturaEncontrada) {
        res.status(404).send({ erro: "Assinatura não encontrada" });
        return;
    }

    const dadosDoNovoPlano = await repositorioDePlanos.buscarPlanoPorId(req.body.idPlano);
    if (!dadosDoNovoPlano) {
        res.status(404).send({ erro: "Plano não encontrado" });
        return;
    }

    const novaAssinatura = new Assinatura.Assinatura(req.usuario.idUsuario, dadosDoNovoPlano);

    await repositorioDeAssinaturas.alterarPlanoDaAssinatura(req.usuario.idUsuario, novaAssinatura);

    res.send({
        idAssinatura: novaAssinatura.idAssinatura
    });
}

//O Assinante busca dados do nutricionista
async function buscarDadosDoNutri(req, res) {
    // #swagger.tags = ['Assinante']
    // #swagger.description = 'endpoint para buscar informações do Nutricionista.'

    const dadosDoNutricionista = await repositorioDeNutricionistas.buscarNutriPorId(req.params.idNutri);

    if (!dadosDoNutricionista) {
        res.status(404).send({ erro: "Nutricionista não encontrado" });
        return;
    }

    res.send({
        imagem: servicoDeArquivosEstaticos.construirCaminhoParaImagem(dadosDoNutricionista.imagem),
        nome: dadosDoNutricionista.nome,
        registroProfissional: dadosDoNutricionista.registroProfissional,
        email: dadosDoNutricionista.email,
        sobreMim: dadosDoNutricionista.sobreMim
    })
}

//O Assinante busca dados do personal trainer
async function buscarDadosDoPersonal(req, res) {
    // #swagger.tags = ['Assinante']
    // #swagger.description = 'endpoint para buscar informações do Personal Trainer.'

    const dadosDoPersonal = await repositorioDePersonalTrainers.buscarPersonalPorId(req.params.idPersonal);

    if (!dadosDoPersonal) {
        res.status(404).send({ erro: "Personal Trainer não encontrado" });
        return;
    }

    res.send({
        imagem: servicoDeArquivosEstaticos.construirCaminhoParaImagem(dadosDoPersonal.imagem),
        nome: dadosDoPersonal.nome,
        registroProfissional: dadosDoPersonal.registroProfissional,
        email: dadosDoPersonal.email,
        sobreMim: dadosDoPersonal.sobreMim
    })
}

// O Assinante busca todas as dietas ou por nome
async function buscarDietas(req, res) {
    // #swagger.tags = ['Assinante']
    // #swagger.description = 'endpoint para buscar todas as dietas ou filtra por nome.'

    const dietas = await repositorioDeDietas.buscarDietasPorFiltro(req.query.nome, req.usuario.idUsuario);

    if (dietas <= 0) {
        res.send([]);
        return;
    }

    res.send(dietas.map(function (dieta) {
        return {
            idDieta: dieta.idDieta,
            nome: dieta.nome,
            objetivo: dieta.objetivo,
            dataInicio: dieta.dataInicio,
            dataFim: dieta.dataFim
        }
    }));
}

// O assinante busca dieta por id
async function buscarDietaPorId(req, res) {
    // #swagger.tags = ['Assinante']
    // #swagger.description = 'endpoint para buscar dieta por Id.'

    const dadosDaDieta = await repositorioDeDietas.buscarDietaPorId(req.usuario.idUsuario, req.params.idDieta);

    if (!dadosDaDieta) {
        res.status(404).send({ erro: "Dieta não encontrada" });
        return;
    }

    res.send({
        idDieta: req.params.idDieta,
        nome: dadosDaDieta.dieta.nome,
        objetivo: dadosDaDieta.dieta.objetivo,
        dataInicio: dadosDaDieta.dieta.dataInicio,
        dataFim: dadosDaDieta.dieta.dataFim,
        itens: dadosDaDieta.itensDaDieta
    });
}

// O assinante buscar todos os treinos ou filtra por nome
async function buscarTreinos(req, res) {
    // #swagger.tags = ['Assinante']
    // #swagger.description = 'endpoint para buscar todos os Treinos ou filtra por nome.'

    const treinos = await repositorioDeTreinos.buscarTreinosPorFiltro(req.query.nome, req.usuario.idUsuario);

    if (treinos <= 0) {
        res.send([]);
        return;
    }

    res.send(treinos.map(function (treino) {
        return {
            idTreino: treino.idTreino,
            nome: treino.nome,
            objetivo: treino.objetivo,
            dataInicio: treino.dataInicio,
            dataFim: treino.dataFim
        }
    }));
}

// O assinante busca treino por id
async function buscarTreinoPorId(req, res) {
    // #swagger.tags = ['Assinante']
    // #swagger.description = 'endpoint para buscar treino por Id.'

    const dadosDoTreino = await repositorioDeTreinos.buscarTreinoPorId(req.usuario.idUsuario, req.params.idTreino);

    if (!dadosDoTreino) {
        res.status(404).send({ erro: "Treino não encontrado" });
        return;
    }

    res.send({
        idTreino: req.params.idTreino,
        nome: dadosDoTreino.treino.nome,
        objetivo: dadosDoTreino.treino.objetivo,
        dataInicio: dadosDoTreino.treino.dataInicio,
        dataFim: dadosDoTreino.treino.dataFim,
        exercicios: dadosDoTreino.exercicios
    });
    
}




module.exports = {
    buscarDadosDoDashboard: buscarDadosDoDashboard,
    cadastrarAssinante: cadastrarAssinante,
    buscarDadosDoPerfil: buscarDadosDoPerfil,
    alterarDadosDoPerfil: alterarDadosDoPerfil,
    buscarDadosDaAssinatura: buscarDadosDaAssinatura,
    cancelarAssinatura: cancelarAssinatura,
    alterarPlanoDaAssinatura: alterarPlanoDaAssinatura,
    buscarDadosDoNutri: buscarDadosDoNutri,
    buscarDadosDoPersonal: buscarDadosDoPersonal,
    buscarDietas: buscarDietas,
    buscarDietaPorId: buscarDietaPorId,
    buscarTreinos: buscarTreinos,
    buscarTreinoPorId: buscarTreinoPorId,
    inserirMedidas: inserirMedidas,
    buscarMedidas: buscarMedidas,
    excluirMedidas: excluirMedidas

}
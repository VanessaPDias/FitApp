const Treino = require('../model/treino');
const Imc = require('../model/imc');
const Idade = require('../model/idade');
const Exercicio = require('../model/exercicioDoTreino');
const PersonalTrainer = require('../model/personalTrainer');
const repositorioDeMedidas = require('../repositorios/repositorioDeMedidas');
const repositorioDeTreinos = require('../repositorios/repositorioDeTreinos');
const repositorioDePersonalTrainers = require('../repositorios/repositorioDePersonalTrainers');
const servicoDeArquivosEstaticos = require('../servicos/servicoDeArquivosEstaticos');


async function buscarDadosDoPerfil(req, res) {
    // #swagger.tags = ['Personal Trainer']
    // #swagger.description = 'endpoint para buscar dados do perfil.'

    const dadosDoPersonal = await repositorioDePersonalTrainers.buscarPersonalPorId(req.usuario.idUsuario);

    if (!dadosDoPersonal) {
        res.status(404).send({ erro: 'Personal Trainer não encontrado' });
        return;
    }

    res.send({
        idPersonal: dadosDoPersonal.idPersonal,
        imagem: dadosDoPersonal.imagem,
        email: dadosDoPersonal.email,
        nome: dadosDoPersonal.nome,
        registroProfissional: dadosDoPersonal.registroProfissional,
        telefone: dadosDoPersonal.telefone,
        sobreMim: dadosDoPersonal.sobreMim
    })

}

async function alterarDadosDoPerfil(req, res) {
    // #swagger.tags = ['Personal Trainer']
    // #swagger.description = 'endpoint para alterar dados do perfil.'

    PersonalTrainer.validarAlteracaoDoPerfil(req.body.nome);

    await repositorioDePersonalTrainers.salvarAlteracaoDeDadosDoPerfil(req.usuario.idUsuario, req.body.nome, req.body.telefone);

    res.send();
}

async function alterarInformacoesSobreMim(req, res) {
    // #swagger.tags = ['Personal Trainer']
    // #swagger.description = 'endpoint para alterar informações "Sobre Mim".'

    await repositorioDePersonalTrainers.salvarAlteracaoSobreMim(req.usuario.idUsuario, req.body.texto);

    res.send();
}

async function buscarAlunos(req, res) {
    // #swagger.tags = ['Personal Trainer']
    // #swagger.description = 'endpoint para buscar alunos.'

    const alunos = await repositorioDePersonalTrainers.buscarAlunosPorFiltro(req.usuario.idUsuario, req.query.nome);

    if (!alunos || alunos.length <= 0) {
       res.send([]);
        return; 
    }

    res.send(alunos.map(function (aluno) {
        return {
            idAssinante: aluno.idAssinante,
            nome: aluno.nome,
            objetivo: aluno.objetivo,

        }
    }));

}

async function buscarAlunoPorId(req, res) {
    // #swagger.tags = ['Personal Trainer']
    // #swagger.description = 'endpoint para buscar aluno por Id.'

    const alunoEncontrado = await repositorioDePersonalTrainers.buscarAlunoPorId(req.params.idAssinante);

    if (!alunoEncontrado) {
        res.status(404).send({ erro: "Aluno não encontrado" });
        return;
    }

    if (req.usuario.idUsuario != alunoEncontrado.dados.idPersonal) {
        res.status(401).send({ erro: 'Não autorizado' });
        return;
    }

    res.send({
        imagem: !alunoEncontrado.dados.imagem ? "" : servicoDeArquivosEstaticos.construirCaminhoParaImagem(alunoEncontrado.dados.imagem),
        nome: alunoEncontrado.dados.nome,
        objetivo: alunoEncontrado.treinos && alunoEncontrado.treinos.length > 0 ? alunoEncontrado.treinos[0].objetivo : null,
        dataNascimento: new Idade.Idade(alunoEncontrado.dados.dataNascimento).valor,
        sexo: alunoEncontrado.dados.idSexo,
        altura: !alunoEncontrado.dados.altura ? 0 : alunoEncontrado.dados.altura,
        treinos: !alunoEncontrado.treinos ? [] : alunoEncontrado.treinos,
        treinoAtual: alunoEncontrado.treinos && alunoEncontrado.treinos.length > 0 ? alunoEncontrado.treinos[0]: null,
        peso: !alunoEncontrado.medidasAtuais ? 0 : alunoEncontrado.medidasAtuais.peso,
        pescoco: !alunoEncontrado.medidasAtuais ? 0 : alunoEncontrado.medidasAtuais.pescoco,
        cintura: !alunoEncontrado.medidasAtuais ? 0 : alunoEncontrado.medidasAtuais.cintura,
        quadril: !alunoEncontrado.medidasAtuais ? 0 : alunoEncontrado.medidasAtuais.quadril,
        imc: new Imc.Imc(!alunoEncontrado.medidasAtuais ? 0 : alunoEncontrado.medidasAtuais.peso, alunoEncontrado.dados.altura).valor,
    });
    
}

async function buscarMedidasDoAluno(req, res) {
    // #swagger.tags = ['Personal Trainer']
    // #swagger.description = 'endpoint para buscar medidas do aluno.'

    const alunoEncontrado = await repositorioDePersonalTrainers.buscarAlunoPorId(req.params.idAssinante);

    if (!alunoEncontrado) {
        res.status(404).send({ erro: "Aluno não encontrado" });
        return;
    }

    if (req.usuario.idUsuario != alunoEncontrado.dados.idPersonal) {
        res.status(401).send({ erro: 'Não autorizado' });
        return;
    }

    let medidasOrdenadasPorData = await repositorioDeMedidas.buscarMedidas(req.params.idAssinante);

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
        nomeAluno: alunoEncontrado.dados.nome,
        historicoDeMedidas: medidasOrdenadasPorData,
        medidasAtuais: medidasAtuais
    });

}

async function criarTreino(req, res) {
    // #swagger.tags = ['Personal Trainer']
    // #swagger.description = 'endpoint para criar treino.'

    const alunoEncontrado = await repositorioDePersonalTrainers.buscarAlunoPorId(req.params.idAssinante);

    if (!alunoEncontrado) {
        res.status(404).send({ erro: 'Aluno não encontrado' });
        return;
    }

    if (req.usuario.idUsuario == alunoEncontrado.dados.idPersonal) {

        const novoTreino = new Treino.Treino(
            req.params.idAssinante,
            req.usuario.idUsuario,
            req.body.nomeTreino,
            req.body.dataInicio,
            req.body.dataFim,
            req.body.objetivo,
            req.body.exercicios
        );

        await repositorioDeTreinos.salvarTreino(req.params.idAssinante, novoTreino);

        res.send({ idTreino: novoTreino.idTreino });

    } else {
        res.status(400).send({ erro: "Não é possivel criar treino" })
    }
}

async function buscarTreinoPorId(req, res) {
    // #swagger.tags = ['Personal Trainer']
    // #swagger.description = 'endpoint para buscar treino por Id.'

    const alunoEncontrado = await repositorioDePersonalTrainers.buscarAlunoPorId(req.params.idAssinante);

    if (!alunoEncontrado) {
        res.status(404).send({ erro: "Aluno não encontrado" });
        return;
    }

    if (req.usuario.idUsuario != alunoEncontrado.dados.idPersonal) {
        res.status(401).send({ erro: 'Não autorizado' });
        return;
    }

    const treinoEncontrado = await repositorioDeTreinos.buscarTreinoPorId(req.params.idAssinante, req.params.idTreino);

    if (!treinoEncontrado) {
        res.status(404).send({ erro: "Treino não encontrado" });
        return;
    }

    res.send(treinoEncontrado);

}

async function alterarTreino(req, res) {
    // #swagger.tags = ['Personal Trainer']
    // #swagger.description = 'endpoint para alterar treino.'

    const alunoEncontrado = await repositorioDePersonalTrainers.buscarAlunoPorId(req.params.idAssinante);

    if (!alunoEncontrado) {
        res.status(404).send({ erro: "Aluno não encontrado" });
        return;
    }

    const treinoEncontrado = await repositorioDeTreinos.buscarTreinoPorId(req.params.idAssinante, req.params.idTreino);

    if (!treinoEncontrado) {
        res.status(404).send({ erro: "Treino não encontrado" });
        return;
    }

    await repositorioDeTreinos.excluirExerciciosDoTreino(req.params.idTreino);
    let exercicios = [];

    if (req.usuario.idUsuario == alunoEncontrado.dados.idPersonal) {

        Treino.validarAlteracaoDoTreino(
            req.params.idTreino,
            req.body.nomeTreino,
            req.body.dataInicio,
            req.body.dataFim,
            req.body.objetivo,
            req.body.exercicios
        );

        req.body.exercicios.forEach(exercicio => {
            exercicios.push(new Exercicio.ExercicioDoTreino(req.params.idTreino, exercicio.descricao, exercicio.diaDoTreino));
        });

        await repositorioDeTreinos.salvarAlteracaoDoTreino(
            req.params.idTreino,
            req.body.nomeTreino,
            req.body.dataInicio,
            req.body.dataFim,
            req.body.objetivo,
            exercicios
        );

        res.send();

    } else {
        res.status(400).send({ erro: "Não é possivel alterar treino" })
    }


}

module.exports = {
    buscarDadosDoPerfil: buscarDadosDoPerfil,
    alterarDadosDoPerfil: alterarDadosDoPerfil,
    alterarInformacoesSobreMim: alterarInformacoesSobreMim,
    buscarAlunos: buscarAlunos,
    buscarAlunoPorId: buscarAlunoPorId,
    buscarMedidasDoAluno: buscarMedidasDoAluno,
    criarTreino: criarTreino,
    buscarTreinoPorId: buscarTreinoPorId,
    alterarTreino: alterarTreino,
}

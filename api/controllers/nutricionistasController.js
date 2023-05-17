const Dieta = require('../model/dieta');
const Idade = require('../model/idade');
const Imc = require('../model/imc');
const ItemDaDieta = require('../model/itemDaDieta');
const Nutricionista = require('../model/nutricionista');
const repositorioDeNutricionistas = require('../repositorios/repositorioDeNutricionistas');
const repositorioDeMedidas = require('../repositorios/repositorioDeMedidas');
const repositorioDeDietas = require('../repositorios/repositorioDeDietas');
const servicoDeArquivosEstaticos = require('../servicos/servicoDeArquivosEstaticos');



async function buscarDadosDoPerfil(req, res) {
    // #swagger.tags = ['Nutricionista']
    // #swagger.description = 'endpoint para buscar dados do perfil.'

    const dadosDoNutri = await repositorioDeNutricionistas.buscarNutriPorId(req.usuario.idUsuario);


    res.send({
        idNutri: dadosDoNutri.idNutri,
        imagem: dadosDoNutri.imagem,
        email: dadosDoNutri.email,
        nome: dadosDoNutri.nome,
        registroProfissional: dadosDoNutri.registroProfissional,
        telefone: dadosDoNutri.telefone,
        sobreMim: dadosDoNutri.sobreMim
    })

}

async function alterarDadosDoPerfil(req, res) {
    // #swagger.tags = ['Nutricionista']
    // #swagger.description = 'endpoint para alterar dados do perfil.'

    Nutricionista.validarAlteracaoDoPerfil(req.body.nome);
    await repositorioDeNutricionistas.salvarAlteracaoDeDadosDoPerfil(req.usuario.idUsuario, req.body.nome, req.body.telefone);

    res.send();
}


async function alterarInformacoesSobreMim(req, res) {
    // #swagger.tags = ['Nutricionista']
    // #swagger.description = 'endpoint para alterar informações "Sobre Mim".'

    await repositorioDeNutricionistas.salvarAlteracaoSobreMim(req.usuario.idUsuario, req.body.texto);

    res.send();
}

async function buscarPacientes(req, res) {
    // #swagger.tags = ['Nutricionista']
    // #swagger.description = 'endpoint para buscar pacientes - todos ou por nome.'

    const pacientes = await repositorioDeNutricionistas.buscarPacientesPorFiltro(req.usuario.idUsuario, req.query.nome);

    if (!pacientes || pacientes.length <= 0) {
        res.send([]);
        return;
    }

    res.send(pacientes.map(function (paciente) {
        return {
            idAssinante: paciente.idAssinante,
            nome: paciente.nome,
            objetivo: paciente.objetivo,
        }
    }));
}

async function buscarPacientePorId(req, res) {
    // #swagger.tags = ['Nutricionista']
    // #swagger.description = 'endpoint para buscar paciente por Id.'

    const pacienteEncontrado = await repositorioDeNutricionistas.buscarPacientePorId(req.params.idAssinante);

    if (!pacienteEncontrado) {
        res.status(404).send({ erro: "Paciente não encontrado" });
        return;
    }

    if (req.usuario.idUsuario != pacienteEncontrado.dados.idNutri) {
        res.status(401).send({ erro: 'Não autorizado' });
        return;
    }

    res.send({
        imagem: !pacienteEncontrado.dados.imagem ? "" : servicoDeArquivosEstaticos.construirCaminhoParaImagem(pacienteEncontrado.dados.imagem),
        nome: pacienteEncontrado.dados.nome,
        objetivo: pacienteEncontrado.dietas && pacienteEncontrado.dietas.length > 0 ? pacienteEncontrado.dietas[0].objetivo : null,
        dataNascimento: new Idade.Idade(pacienteEncontrado.dados.dataNascimento).valor,
        sexo: pacienteEncontrado.dados.idSexo,
        altura: !pacienteEncontrado.dados.altura ? 0 : pacienteEncontrado.dados.altura,
        dietas: !pacienteEncontrado.dietas ? [] : pacienteEncontrado.dietas,
        dietaAtual: pacienteEncontrado.dietas && pacienteEncontrado.dietas.length > 0 ? pacienteEncontrado.dietas[0] : null,
        peso: !pacienteEncontrado.medidasAtuais ? 0 : pacienteEncontrado.medidasAtuais.peso,
        pescoco: !pacienteEncontrado.medidasAtuais ? 0 : pacienteEncontrado.medidasAtuais.pescoco,
        cintura: !pacienteEncontrado.medidasAtuais ? 0 : pacienteEncontrado.medidasAtuais.cintura,
        quadril: !pacienteEncontrado.medidasAtuais ? 0 : pacienteEncontrado.medidasAtuais.quadril,
        imc: new Imc.Imc(!pacienteEncontrado.medidasAtuais ? 0 : pacienteEncontrado.medidasAtuais.peso, pacienteEncontrado.dados.altura).valor,
    });
}

async function buscarMedidasDoPaciente(req, res) {
    // #swagger.tags = ['Nutricionista']
    // #swagger.description = 'endpoint para buscar medidas do paciente.'

    const pacienteEncontrado = await repositorioDeNutricionistas.buscarPacientePorId(req.params.idAssinante);

    if (!pacienteEncontrado) {
        res.status(404).send({ erro: "Paciente não encontrado" });
        return;
    }

    if (req.usuario.idUsuario != pacienteEncontrado.dados.idNutri) {
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
        nomePaciente: pacienteEncontrado.dados.nome,
        historicoDeMedidas: medidasOrdenadasPorData,
        medidasAtuais: medidasAtuais
    });
}

async function criarDieta(req, res) {
    // #swagger.tags = ['Nutricionista']
    // #swagger.description = 'endpoint para criar dieta.'

    const pacienteEncontrado = await repositorioDeNutricionistas.buscarPacientePorId(req.params.idAssinante);

    if (!pacienteEncontrado) {
        res.status(404).send({ erro: 'Paciente não encontrado' });
        return;
    }

    if (req.usuario.idUsuario == pacienteEncontrado.dados.idNutri) {

        const novaDieta = new Dieta.Dieta(req.params.idAssinante, req.usuario.idUsuario, req.body.nomeDieta, req.body.dataInicio, req.body.dataFim, req.body.objetivo, req.body.itens);

        await repositorioDeDietas.salvarDieta(req.params.idAssinante, novaDieta);

        res.send({ idDieta: novaDieta.idDieta });

    } else {
        res.status(400).send({ erro: "Não é possivel criar dieta " })
    }
}

async function buscarDietaPorId(req, res) {
    // #swagger.tags = ['Nutricionista']
    // #swagger.description = 'endpoint para buscar dieta por Id.'

    const pacienteEncontrado = await repositorioDeNutricionistas.buscarPacientePorId(req.params.idAssinante);

    if (!pacienteEncontrado) {
        res.status(404).send({ erro: "Paciente não encontrado" });
        return;
    }

    if (req.usuario.idUsuario != pacienteEncontrado.dados.idNutri) {
        res.status(401).send({ erro: 'Não autorizado' });
        return;
    }

    const dietaEncontrada = await repositorioDeDietas.buscarDietaPorId(req.params.idAssinante, req.params.idDieta);

    if (!dietaEncontrada) {
        res.status(404).send({ erro: "Dieta não encontrada" });
        return;
    }

    res.send(dietaEncontrada);

}

async function alterarDieta(req, res) {
    // #swagger.tags = ['Nutricionista']
    // #swagger.description = 'endpoint para alterar dieta.'

    const pacienteEncontrado = await repositorioDeNutricionistas.buscarPacientePorId(req.params.idAssinante);

    if (!pacienteEncontrado) {
        res.status(404).send({ erro: "Paciente não encontrado" });
        return;
    }

    const dietaEncontrada = await repositorioDeDietas.buscarDietaPorId(req.params.idAssinante, req.params.idDieta);

    if (!dietaEncontrada) {
        res.status(404).send({ erro: "Dieta não encontrada" });
        return;
    }

    await repositorioDeDietas.excluirItensDaDieta(req.params.idDieta);
    let itens = [];

    if (req.usuario.idUsuario == pacienteEncontrado.dados.idNutri) {

        Dieta.validarAlteracaoDaDieta(
            req.params.idDieta,
            req.body.nomeDieta,
            req.body.dataInicio,
            req.body.dataFim,
            req.body.objetivo,
            req.body.itens
        );

        req.body.itens.forEach(item => {
            itens.push(new ItemDaDieta.ItemDaDieta(req.params.idDieta, item.descricao, item.refeicao));
        });

        await repositorioDeDietas.salvarAlteracoesDaDieta(
            req.params.idDieta,
            req.body.nomeDieta,
            req.body.dataInicio,
            req.body.dataFim,
            req.body.objetivo,
            itens
        );

        res.send();

    } else {
        res.status(400).send({ erro: "Não é possivel alterar dieta" })
    }

}

module.exports = {
    buscarDadosDoPerfil: buscarDadosDoPerfil,
    alterarDadosDoPerfil: alterarDadosDoPerfil,
    alterarInformacoesSobreMim: alterarInformacoesSobreMim,
    buscarPacientes: buscarPacientes,
    buscarPacientePorId: buscarPacientePorId,
    buscarMedidasDoPaciente: buscarMedidasDoPaciente,
    criarDieta: criarDieta,
    buscarDietaPorId: buscarDietaPorId,
    alterarDieta: alterarDieta,
}



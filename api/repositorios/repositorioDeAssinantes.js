const baseDeDados = require('../conexao');

async function verificarSeAssinanteJaTemCadastro(email) {
    const conexao = await baseDeDados.abrirConexao();

    try {
        const [rows, fields] = await conexao.execute(
            `select login 
            from usuarios 
            where login = ?`, [email.toLowerCase()]);

        if (rows.length <= 0)
            return;

        return rows[0];

    } finally {
        await conexao.end();
    }
}

async function criarAssinante(novoAssinante) {
    const conexao = await baseDeDados.abrirConexao();

    try {
        const parametrosDoUsuario = [
            novoAssinante.usuario.idUsuario,
            novoAssinante.usuario.perfil,
            novoAssinante.usuario.nome,
            novoAssinante.usuario.login,
            novoAssinante.usuario.senha,
            novoAssinante.usuario.bloqueado
        ]

        const parametrosDoAssinante = [
            novoAssinante.idAssinante,
            novoAssinante.nutricionista,
            novoAssinante.personalTrainer,
            novoAssinante.nome,
            novoAssinante.email,
            novoAssinante.altura
        ]

        const parametrosDaAssinatura = [
            novoAssinante.assinatura.idAssinatura,
            novoAssinante.assinatura.idAssinante,
            novoAssinante.assinatura.idPlano,
            novoAssinante.assinatura.dataInicio,
            novoAssinante.assinatura.dataFim,
            novoAssinante.assinatura.bloqueado
        ]

        await conexao.beginTransaction();

        await conexao.execute(
            `insert into usuarios (idUsuario, perfil, nome, login, senha, bloqueado) 
            values (?, ?, ?, ?, ?, ?);`, parametrosDoUsuario);
        await conexao.execute(
            `insert into assinantes (idAssinante, idNutri, idPersonal, nome, email, altura) 
            values (?, ?, ?, ?, ?, ?);`, parametrosDoAssinante);
        await conexao.execute(
            `insert into assinaturas (idAssinatura, idAssinante, idPlano, dataInicio, dataFim, bloqueado) 
            values (?, ?, ?, ?, ?, ?);`, parametrosDaAssinatura);

        await conexao.commit();

    } finally {
        await conexao.end();
    }
}

async function buscarDadosDoDashboardDoAssinantePorId(idUsuario) {
    const conexao = await baseDeDados.abrirConexao();

    try {
        const [rows, fields] = await conexao.execute(
            `select usuario.imagem,
                assinante.idAssinante, assinante.nome, assinante.altura, assinante.dataNascimento
            from usuarios as usuario
            inner join assinantes as assinante on usuario.idUsuario = assinante.idAssinante
            where usuario.idUsuario = ?`, [idUsuario]);

        if (rows.length <= 0)
            return;

        const [pesos, fieldsPesos] = await conexao.execute(
            `select peso, data
            from medidas
            where idAssinante = ?
            order by data desc`, [idUsuario]);

        return {
            dados: rows[0],
            historicoDePeso: pesos,
            pesoAtual: pesos[0]
        }

    } finally {
        await conexao.end();
    }
}

async function buscarDadosDoPerfilDoAssinantePorId(idUsuario) {
    const conexao = await baseDeDados.abrirConexao();

    try {
        const [rows, fields] = await conexao.execute(
            `select usuario.imagem, usuario.login,usuario.nome, 
		        assinante.idAssinante, assinante.altura, assinante.dataNascimento, assinante.idSexo, assinante.idNutri, assinante.idPersonal, 
                assinatura.idAssinatura, assinatura.idPlano
            from usuarios as usuario
                inner join assinantes as assinante on usuario.idUsuario = assinante.idAssinante
                inner join assinaturas as assinatura on usuario.idUsuario = assinatura.idAssinante
            where assinatura.bloqueado = 0 and usuario.idUsuario = ?`, [idUsuario]);

        if (rows.length <= 0)
            return;

        return rows[0];

    } finally {
        await conexao.end();
    }
}

async function buscarAssinantePorId(idAssinante) {
    const conexao = await baseDeDados.abrirConexao();

    try {
        const [rows, fields] = await conexao.execute(
            `select assinante.idAssinante, 
                assinante.idNutri, 
                assinante.idPersonal, 
                assinante.nome, 
                assinante.email, 
                assinante.dataNascimento, 
                assinante.idSexo, 
                assinante.altura, 
                assinatura.idAssinatura, 
                assinatura.idPlano, 
                assinatura.dataInicio, 
                assinatura.dataFim, 
                assinatura.bloqueado as assinaturaBloqueada,
                usuario.imagem, 
                usuario.bloqueado as usuarioBloqueado,
                plano.nome as nomePlano, plano.valor 
            from assinantes as assinante
                inner join assinaturas as assinatura on assinante.idAssinante = assinatura.idAssinante
                inner join usuarios as usuario on assinante.idAssinante = usuario.idUsuario
                inner join planos as plano on assinatura.idPlano = plano.idPlano
            where assinante.idAssinante = ?`, [idAssinante]);

        if (rows.length <= 0)
            return;

        return rows[0];

    } finally {
        await conexao.end();
    }
}

async function salvarAlteracaoDeDadosDoPerfil(idUsuario, nome, dataNascimento, idSexo, altura) {
    const conexao = await baseDeDados.abrirConexao();

    try {
        await conexao.beginTransaction();
        await conexao.execute(
            `update usuarios
            set nome = ?
            where idUsuario = ?`, [nome, idUsuario]);

        await conexao.execute(
            `update assinantes
            set nome = ?, dataNascimento = ?, idSexo = ?, altura = ?
            where idAssinante = ?`, [nome, !dataNascimento ? null : new Date(dataNascimento), !idSexo ? null : idSexo, !altura ? null : altura, idUsuario]);

        await conexao.commit();

    }
    finally {
        await conexao.end();
    }
}

async function buscarAssinantePorFiltro(nome) {
    const conexao = await baseDeDados.abrirConexao();

    try {
        if (!nome) {
            const [rows, fields] = await conexao.execute(
                `select assinante.idAssinante, assinante.nome, assinante.email,
                        usuario.bloqueado 
                from assinantes as assinante
                inner join usuarios as usuario on assinante.idAssinante = usuario.idUsuario`);

            return rows;
        }

        const [rowsComFiltro, fieldsComFiltro] = await conexao.execute(
            `select assinante.idAssinante, assinante.nome, assinante.email,
                    usuario.bloqueado 
                from assinantes as assinante
                    inner join usuarios as usuario on assinante.idAssinante = usuario.idUsuario
                where assinante.nome like ?`, [`%${nome}%`]);

        return rowsComFiltro;

    } finally {
        await conexao.end();
    }
}

async function salvarAlteracaoDeStatus(idAssinante, novoStatus) {
    const conexao = await baseDeDados.abrirConexao();

    try {
        await conexao.execute(
            `update usuarios
            set bloqueado = ?
            where idUsuario = ?`, [novoStatus, idAssinante]);

    } finally {
        await conexao.end();
    }
}



module.exports = {
    verificarSeAssinanteJaTemCadastro: verificarSeAssinanteJaTemCadastro,
    criarAssinante: criarAssinante,
    buscarDadosDoDashboardDoAssinantePorId: buscarDadosDoDashboardDoAssinantePorId,
    buscarDadosDoPerfilDoAssinantePorId: buscarDadosDoPerfilDoAssinantePorId,
    salvarAlteracaoDeDadosDoPerfil: salvarAlteracaoDeDadosDoPerfil,
    buscarAssinantePorFiltro: buscarAssinantePorFiltro,
    buscarAssinantePorId: buscarAssinantePorId,
    salvarAlteracaoDeStatus: salvarAlteracaoDeStatus,
}
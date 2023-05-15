const baseDeDados = require('../conexao');


async function buscarAssinaturaAtiva(idAssinante) {
    const conexao = await baseDeDados.abrirConexao();

    try {

        const [rows, fields] = await conexao.execute(
            `select idAssinatura 
            from assinaturas 
            where idAssinante = ? and bloqueado = 0`, [idAssinante]);

        if (rows.length <= 0)
            return;

        return rows[0];

    } finally {
        await conexao.end();
    }
}

async function buscarAssinaturaPorId(idUsuario, idAssinatura) {
    const conexao = await baseDeDados.abrirConexao();

    try {

        const [rows, fields] = await conexao.execute(
            `select assinatura.idPlano, assinatura.dataInicio, assinatura.dataFim, assinatura.bloqueado,
                    plano.nome, plano.valor, plano.duracao, plano.descricao
            from assinaturas as assinatura
                inner join planos as plano on assinatura.idPlano = plano.idPlano 
            where assinatura.idAssinante = ? and assinatura.idAssinatura = ?`, [idUsuario, idAssinatura]);

        if (rows.length <= 0)
            return;

        return rows[0];

    } finally {
        await conexao.end();
    }
}

async function cancelarAssinatura(idUsuario, idAssinatura) {
    const conexao = await baseDeDados.abrirConexao();

    try {
        await conexao.beginTransaction();
        await conexao.execute(
            `update assinaturas
            set bloqueado = true
            where idAssinante = ? and idAssinatura = ?`, [idUsuario, idAssinatura]);

        await conexao.execute(
            `update usuarios
            set bloqueado = true
            where idUsuario = ?`, [idUsuario]);

        await conexao.commit();

    } finally {
        await conexao.end();
    }
}


async function alterarPlanoDaAssinatura(idUsuario, novaAssinatura) {
    const conexao = await baseDeDados.abrirConexao();

    const parametrosDaAssinatura = [
        novaAssinatura.idAssinatura,
        novaAssinatura.idAssinante,
        novaAssinatura.idPlano,
        novaAssinatura.dataInicio,
        novaAssinatura.dataFim,
        novaAssinatura.bloqueado
    ];

    try {
        await conexao.beginTransaction();
        await conexao.execute(
            `update assinaturas
            set bloqueado = true
            where idAssinante = ?`, [idUsuario]);

        await conexao.execute(
            `insert into assinaturas (idAssinatura, idAssinante, idPlano, dataInicio, dataFim, bloqueado) 
            values (?, ?, ?, ?, ?, ?);`, parametrosDaAssinatura)
        await conexao.commit();

    } finally {
        await conexao.end();
    }
}

module.exports = {
    buscarAssinaturaAtiva: buscarAssinaturaAtiva,
    buscarAssinaturaPorId: buscarAssinaturaPorId,
    cancelarAssinatura: cancelarAssinatura,
    alterarPlanoDaAssinatura: alterarPlanoDaAssinatura,
    cancelarAssinatura: cancelarAssinatura,
}
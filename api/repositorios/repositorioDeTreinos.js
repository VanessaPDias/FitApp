const baseDeDados = require('../conexao');

async function buscarTreinosPorFiltro(nome, idAssinante) {
    const conexao = await baseDeDados.abrirConexao();

    try {
        if (!nome) {
            const [rows, fields] = await conexao.execute(
                `select idTreino, nome, objetivo, dataInicio, dataFim, data 
            from treinos
            where idAssinante = ?
            order by data desc`, [idAssinante]);

            return rows;
        }

        const [rowsComFiltro, fieldsComFiltro] = await conexao.execute(
            `select idTreino, nome, objetivo, dataInicio, dataFim, data  
            from treinos 
            where nome = ? and idAssinante = ?
            order by data desc`, [nome.toLowerCase(), idAssinante]);

        return rowsComFiltro;
    }
    finally {
        await conexao.end();
    }
}

async function buscarTreinoPorId(idAssinante, idTreino) {

    const conexao = await baseDeDados.abrirConexao();

    try {
        const [rows, fields] = await conexao.execute(
            `select nome, objetivo, dataInicio, dataFim, data
            from treinos
            where idTreino = ? and idAssinante = ?`, [idTreino, idAssinante]);

        const [exercicios, fieldsItens] = await conexao.execute(
            `select idExercicio, descricao, diaDoTreino
            from exercicios
            where idTreino = ?`, [idTreino]);

        if (rows.length <= 0)
            return;

        return {
            treino: rows[0],
            exercicios: exercicios
        }

    } finally {
        await conexao.end();
    }
}

async function salvarTreino(idAssinante, novoTreino) {
    const conexao = await baseDeDados.abrirConexao();

    try {
        const parametrosDoTreino = [
            idAssinante,
            novoTreino.idTreino,
            novoTreino.idPersonal,
            novoTreino.objetivo,
            novoTreino.nomeTreino,
            novoTreino.dataInicio,
            novoTreino.dataFim,
            novoTreino.data
        ]

        await conexao.beginTransaction();
        await conexao.execute(
            `insert into treinos (idAssinante, idTreino, idPersonal, objetivo, nome, dataInicio, dataFim, data)
            values (?, ?, ?, ?, ?, ?, ?, ?)`, parametrosDoTreino);


        novoTreino.exercicios.forEach(async exercicio => {
            const parametrosDoExercicio = [
                exercicio.idExercicio,
                exercicio.idTreino,
                exercicio.descricao,
                exercicio.diaDoTreino
            ]

            await conexao.execute(
                `insert into exercicios (idExercicio, idTreino, descricao, diaDoTreino) 
                values (?, ?, ?, ?)`, parametrosDoExercicio);

        });
        await conexao.commit();

    } finally {
        await conexao.end();
    }
}

async function salvarAlteracaoDoTreino(idTreino, nomeTreino, dataInicio, dataFim, objetivo, exercicios) {
    const conexao = await baseDeDados.abrirConexao();

    try {
        await conexao.beginTransaction();

        await conexao.execute(
            `update treinos
            set nome = ?, objetivo = ?, dataInicio = ?, dataFim = ?
            where idTreino = ?`, [nomeTreino, objetivo, new Date(dataInicio), new Date(dataFim), idTreino]);

        exercicios.forEach(async exercicio => {
            const parametrosDoExercicio = [
                exercicio.idExercicio,
                exercicio.idTreino,
                exercicio.descricao,
                exercicio.diaDoTreino
            ]

            await conexao.execute(
                `replace into exercicios (idExercicio, idTreino, descricao, diaDoTreino)
                values (?, ?, ?, ?)`, parametrosDoExercicio);
        });

        await conexao.commit();

    }
    finally {
        await conexao.end();
    }

}


module.exports = {
    buscarTreinosPorFiltro: buscarTreinosPorFiltro,
    buscarTreinoPorId: buscarTreinoPorId,
    salvarTreino: salvarTreino,
    salvarAlteracaoDoTreino: salvarAlteracaoDoTreino
}
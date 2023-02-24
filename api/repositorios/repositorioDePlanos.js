const base = require('../dados');
const baseDeDados = require('../conexao');


async function verificarSeJaExistePlanoCadastradoPeloNome(idPlano, nome) {
    const conexao = await baseDeDados.abrirConexao();
    try {
        const [rows, fields] = await conexao.execute(
            `select idPlano, nome 
            from planos 
            where nome = ? and idPlano != idPlano`, [nome, idPlano]);

        if (rows.length <= 0)
            return;

        return rows[0];

    } finally {
        await conexao.end();
    }
}

async function criarPlano(novoPlano) {
    const conexao = await baseDeDados.abrirConexao();

    try {
        const parametrosDoPlano = [
            novoPlano.idPlano,
            novoPlano.nome.toLowerCase(),
            novoPlano.valor,
            novoPlano.duracao,
            novoPlano.descricao,
            novoPlano.bloqueado
        ]

        await conexao.execute(
            `insert into planos (idPlano, nome, valor, duracao, descricao, bloqueado) 
            values (?, ?, ?, ?, ?, ?);`, parametrosDoPlano);

    } finally {
        await conexao.end();
    }
}

async function buscarPlanosPorFiltro(nome) {
    const conexao = await baseDeDados.abrirConexao();

    try {
        if (!nome) {
            const [rows, fields] = await conexao.execute(
                `select idPlano, nome, valor, duracao, descricao, bloqueado 
                from planos`);

            return rows;
        }

        const [rowsComFiltro, fieldsComFiltro] = await conexao.execute(
            `select idPlano, nome, valor, duracao, descricao, bloqueado 
            from planos 
            where nome like ?`, [`%${nome}%`]);

        return rowsComFiltro;

    } finally {
        await conexao.end();
    }

}

async function buscarPlanoPorId(idPlano) {
    const conexao = await baseDeDados.abrirConexao();

    try {
        const [rows, fields] = await conexao.execute(
            `select idPlano, nome, valor, duracao, descricao, bloqueado 
            from planos 
            where idPlano = ?`, [idPlano]);

        if (rows.length <= 0)
            return;

        return rows[0];

    } finally {
        await conexao.end();
    }
}

async function salvarAlteracaoDeDados(idPlano, nome, valor, duracao, descricao, bloqueado) {
    const conexao = await baseDeDados.abrirConexao();

    try {
        const [rows, fields] = await conexao.execute(
            `update planos
            set nome = ?, valor = ?, duracao = ?,  descricao = ?,  bloqueado = ? 
            where idPlano = ?`, [nome, valor, duracao, descricao, bloqueado, idPlano]);

        
    } finally {
        await conexao.end();
    }
}


async function buscarPlanosAtivos() {
    const conexao = await baseDeDados.abrirConexao();

    try {

        const [rows, fields] = await conexao.execute(
            `select idPlano, nome, valor, duracao, descricao, bloqueado 
            from planos 
            where bloqueado = false`);

        if (rows.length <= 0)
            return;

        return rows;

    } finally {
        await conexao.end();
    }
}


module.exports = {
    verificarSeJaExistePlanoCadastradoPeloNome: verificarSeJaExistePlanoCadastradoPeloNome,
    buscarPlanosAtivos: buscarPlanosAtivos,
    criarPlano: criarPlano,
    buscarPlanosPorFiltro: buscarPlanosPorFiltro,
    buscarPlanoPorId: buscarPlanoPorId,
    salvarAlteracaoDeDados: salvarAlteracaoDeDados
}
const baseDeDados = require('../conexao');


async function verificarSeJaExistePlanoCadastradoPeloNome(idPlano, nome) {
    const conexao = await baseDeDados.abrirConexao();
    try {
        const [rows, fields] = await conexao.execute(
            `select idPlano, nome 
            from planos 
            where nome = ? and idPlano != ?`, [nome, idPlano]);

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
            novoPlano.bloqueado,
            novoPlano.dataLancamento
        ]

        await conexao.execute(
            `insert into planos (idPlano, nome, valor, duracao, descricao, bloqueado, dataLancamento) 
            values (?, ?, ?, ?, ?, ?, ?);`, parametrosDoPlano);

    } finally {
        await conexao.end();
    }
}

async function buscarPlanosPorFiltro(nome, bloqueado) {
    const conexao = await baseDeDados.abrirConexao();

    try {
        let filtro = "";
        let parametros = [];

        if (nome) {
            filtro += " and nome like ? ";
            parametros.push(`%${nome}%`);
        }

        if (bloqueado != undefined && bloqueado != null) {
            filtro += " and bloqueado = ? "
            parametros.push(bloqueado);
        }

        const [rows, fields] = await conexao.execute(
            `select idPlano, nome, valor, duracao, descricao, bloqueado, dataLancamento 
            from planos
            where 1=1 ${filtro}`, parametros);

        return rows;

    } finally {
        await conexao.end();
    }

}

async function buscarPlanoPorId(idPlano) {
    const conexao = await baseDeDados.abrirConexao();

    try {
        const [rows, fields] = await conexao.execute(
            `select idPlano, nome, valor, duracao, descricao, bloqueado, dataLancamento 
            from planos 
            where idPlano = ?`, [idPlano]);

        if (rows.length <= 0)
            return;

        return rows[0];

    } finally {
        await conexao.end();
    }
}

async function salvarAlteracaoDeDados(idPlano, nome, valor, duracao, descricao, bloqueado, dataLancamento) {
    const conexao = await baseDeDados.abrirConexao();

    try {
        const [rows, fields] = await conexao.execute(
            `update planos
            set nome = ?, valor = ?, duracao = ?,  descricao = ?,  bloqueado = ?, dataLancamento = ? 
            where idPlano = ?`, [nome, valor, duracao, descricao, bloqueado, dataLancamento, idPlano, ]);


    } finally {
        await conexao.end();
    }
}


async function buscarPlanosAtivos() {
    const conexao = await baseDeDados.abrirConexao();

    try {

        const [rows, fields] = await conexao.execute(
            `select idPlano, nome, valor, duracao, descricao, bloqueado, dataLancamento 
            from planos 
            where bloqueado = false order by valor`);

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
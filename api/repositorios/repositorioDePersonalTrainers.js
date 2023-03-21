const baseDeDados = require('../conexao');

async function buscarPersonalTrainersAtivos() {
    const conexao = await baseDeDados.abrirConexao();

    try {
        const [rows, fields] = await conexao.execute(
            `select personal.idPersonal, personal.nome, personal.sobreMim,
                    usuario.imagem 
            from personal_trainers as personal
                inner join usuarios as usuario on personal.idPersonal = usuario.idUsuario
            where usuario.bloqueado = false and personal.cadastroConfirmado = true`);

        if (rows.length <= 0)
            return;

        return rows;

    } finally {
        await conexao.end();
    }
}

async function verificarSePersonalJaTemCadastro(idPersonal, email) {
    const conexao = await baseDeDados.abrirConexao();

    try {
        const [rows, fields] = await conexao.execute(
            `select idUsuario, login 
            from usuarios 
            where login = ? and idUsuario != ?`, [email.toLowerCase(), idPersonal]);

        if (rows.length <= 0)
            return;

        return rows[0];

    } finally {
        await conexao.end();
    }

}

async function criarPersonal(novoPersonal) {
    const conexao = await baseDeDados.abrirConexao();

    try {
        const parametrosDoUsuario = [
            novoPersonal.usuario.idUsuario,
            novoPersonal.usuario.perfil,
            novoPersonal.usuario.nome,
            novoPersonal.usuario.login,
            novoPersonal.usuario.senha,
            novoPersonal.usuario.bloqueado
        ]

        const parametrosDoPersonal = [
            novoPersonal.idPersonal,
            novoPersonal.nome,
            novoPersonal.email,
            novoPersonal.telefone,
            novoPersonal.registroProfissional,
            novoPersonal.cadastroConfirmado
        ]

        await conexao.beginTransaction();

        await conexao.execute(
            `insert into usuarios (idUsuario, perfil, nome, login, senha, bloqueado) 
            values (?, ?, ?, ?, ?, ?);`, parametrosDoUsuario);
        await conexao.execute(
            `insert into personal_trainers (idPersonal, nome, email, telefone, registroProfissional, cadastroConfirmado) 
            values (?, ?, ?, ?, ?, ?);`, parametrosDoPersonal);

        await conexao.commit();

    } finally {
        await conexao.end();
    }
}

async function buscarPersonalTrainersPorFiltro(nome, bloqueado, cadastroConfirmado) {
    const conexao = await baseDeDados.abrirConexao();

    try {

        let filtro = "";
        let parametros = [];

        if(nome)
        {
            filtro += " and personal.nome like ? ";
            parametros.push(`%${nome}%`);
        }

        if(bloqueado != undefined && bloqueado != null)
        {
            filtro += " and usuario.bloqueado = ? "
            parametros.push(bloqueado);
        }

        if(cadastroConfirmado)
        {
            filtro += " and personal.cadastroConfirmado = ? ";
            parametros.push(cadastroConfirmado);
        }

        const [rows, fields] = await conexao.execute(
            `select personal.idPersonal, personal.nome, personal.email, personal.cadastroConfirmado,
                    usuario.bloqueado 
            from personal_trainers as personal
                inner join usuarios as usuario on personal.idPersonal = usuario.idUsuario
            where 1=1 ${filtro}`, parametros);

        return rows;
    }

    finally {
        await conexao.end();
    }
}

async function buscarPersonalPorId(idPersonal) {
    const conexao = await baseDeDados.abrirConexao();
    try {

        const [rows, fields] = await conexao.execute(
            `select personal.idPersonal, personal.nome, personal.email, personal.telefone, personal.registroProfissional, personal.sobreMim, personal.cadastroConfirmado,
                    usuario.imagem, usuario.bloqueado 
            from personal_trainers as personal
                inner join usuarios as usuario on personal.idPersonal = usuario.idUsuario
            where personal.idPersonal = ?`, [idPersonal]);

        if (rows.length <= 0)
            return;

        return rows[0];

    } finally {
        await conexao.end();
    }
}

async function salvarAlteracaoDeCadastro(idPersonal, registroProfissional, bloqueado, cadastroConfirmado) {
    const conexao = await baseDeDados.abrirConexao();

    try {
        await conexao.beginTransaction();

        await conexao.execute(
            `update usuarios
            set bloqueado = ?
            where idUsuario = ?`, [bloqueado, idPersonal]);

        await conexao.execute(
            `update personal_trainers
            set registroProfissional = ?, cadastroConfirmado = ?
            where idPersonal = ?`, [registroProfissional, cadastroConfirmado, idPersonal]);

        await conexao.commit();

    } finally {
        await conexao.end();
    }
}

async function buscarSenha(idPersonal) {
    const conexao = await baseDeDados.abrirConexao();

    try {
        const [rows, fields] = await conexao.execute(
            `select senha
            from usuarios 
            where idusuario = ?`, [idPersonal]);

        if (rows.length <= 0)
            return;

        return rows[0];

    } finally {
        await conexao.end();
    }
}

async function salvarAlteracaoDeDadosDoPerfil(idUsuario, nome, telefone) {
    const conexao = await baseDeDados.abrirConexao();

    try {
        await conexao.beginTransaction();

        await conexao.execute(
            `update usuarios
            set nome = ?
            where idUsuario = ?`, [nome, idUsuario]);

        await conexao.execute(
            `update personal_trainers
            set nome = ?, telefone = ?
            where idPersonal = ?`, [nome, telefone, idUsuario]);

        await conexao.commit();

    }
    finally {
        await conexao.end();
    }
}

async function salvarAlteracaoSobreMim(idUsuario, texto) {
    const conexao = await baseDeDados.abrirConexao();

    try {

        await conexao.execute(
            `update personal_trainers
            set sobreMim = ?
            where idPersonal = ?`, [texto, idUsuario]);

    }
    finally {
        await conexao.end();
    }
}

async function buscarAlunosPorFiltro(idUsuario, nome) {
    const conexao = await baseDeDados.abrirConexao();

    try {
        if (!nome) {
            const [rows, fields] = await conexao.execute(
                `select	assinante.idAssinante, assinante.nome, 
                        treino.objetivo	
                from assinantes as assinante
                    left join treinos as treino on treino.idPersonal = assinante.idPersonal 
                            and treino.data = (select max(treino.data) data 
                        from treinos as treino 
                        where treino.idPersonal = ? and treino.idAssinante = assinante.IdAssinante)
                where assinante.idPersonal = ?`, [idUsuario, idUsuario]);

            return rows;
        }

        const [rowsComFiltro, fieldsComFiltro] = await conexao.execute(
            `select	assinante.idAssinante, assinante.nome, 
                    treino.objetivo	
            from assinantes as assinante
                left join treinos as treino on treino.idPersonal = assinante.idPersonal 
                        and treino.data = (select max(treino.data) data 
                    from treinos as treino 
                    where treino.idPersonal = ? and treino.idAssinante = assinante.IdAssinante)
            where assinante.idPersonal = ? and assinante.nome like ?`, [idUsuario, idUsuario, `%${nome}%`]);

        return rowsComFiltro;

    } finally {
        await conexao.end();
    }
}

async function buscarAlunoPorId(idAssinante) {
    const conexao = await baseDeDados.abrirConexao();

    try {
        const [rows, fields] = await conexao.execute(
            `select usuario.imagem,
                    assinante.nome, assinante.idSexo, assinante.dataNascimento, assinante.altura, assinante.idPersonal 
            from usuarios as usuario
                inner join assinantes as assinante on usuario.idUsuario = assinante.idAssinante
            where usuario.idUsuario = ?`, [idAssinante]);

        if (rows.length <= 0)
            return;

        const [medidasAtuais, fieldsMedidasAtuais] = await conexao.execute(
            `select peso, pescoco, cintura, quadril
            from medidas
            where idAssinante = ?
            order by data desc limit 1`, [idAssinante]);

        const [treinos, fieldsTreinos] = await conexao.execute(
            `select idTreino, dataInicio, dataFim, objetivo
            from treinos
            where idAssinante = ?
            order by data desc`, [idAssinante]);

        return {
            dados: rows[0],
            medidasAtuais: medidasAtuais[0],
            treinos: treinos
        }

    } finally {
        await conexao.end();
    }
}

module.exports = {
    buscarPersonalTrainersAtivos: buscarPersonalTrainersAtivos,
    verificarSePersonalJaTemCadastro: verificarSePersonalJaTemCadastro,
    criarPersonal: criarPersonal,
    buscarPersonalTrainersPorFiltro: buscarPersonalTrainersPorFiltro,
    buscarPersonalPorId: buscarPersonalPorId,
    salvarAlteracaoDeCadastro: salvarAlteracaoDeCadastro,
    buscarSenha: buscarSenha,
    salvarAlteracaoDeDadosDoPerfil: salvarAlteracaoDeDadosDoPerfil,
    salvarAlteracaoSobreMim: salvarAlteracaoSobreMim,
    buscarAlunosPorFiltro: buscarAlunosPorFiltro,
    buscarAlunoPorId: buscarAlunoPorId
};
const base = require('../dados');
const baseDeDados = require('../conexao');

async function salvarMensagem(mensagem) {
    const conexao = await baseDeDados.abrirConexao();

    try {
        const parametrosDaMensagem = [
            mensagem.data,
            mensagem.idMensagem,
            mensagem.idMensagemResposta,
            mensagem.idUsuarioRemetente,
            mensagem.idUsuarioDestinatario,
            mensagem.assunto,
            mensagem.texto,
            mensagem.excluidaRemetente,
            mensagem.excluidaDestinatario
        ]

        await conexao.execute(
            `insert into mensagens (
                data, 
                idMensagem, 
                idMensagemResposta, 
                idUsuarioRemetente, 
                idUsuarioDestinatario, 
                assunto, 
                texto, 
                excluidaRemetente,
                excluidaDestinatario
            ) values (?, ?, ?, ?, ?, ?, ?, ?, ?)`, parametrosDaMensagem);

    } finally {
        await conexao.end();
    }
}

async function buscarMensagensRecebidas(idUsuario) {
    const conexao = await baseDeDados.abrirConexao();

    try {
        const [rows, fields] = await conexao.execute(
            `select mensagem.idMensagem, 
                    mensagem.data, 
                    mensagem.idUsuarioRemetente,
                    mensagem.assunto, 
                    mensagem.texto, 
                    mensagem.idMensagemResposta,
                    rem.login as emailRemetente,
                    rem.nome as nomeRemetente
            from mensagens as mensagem
                inner join usuarios as rem on mensagem.idUsuarioRemetente = rem.idUsuario
            where mensagem.idUsuarioDestinatario = ? and mensagem.excluidaDestinatario = false 
            order by mensagem.data desc`, [idUsuario]);

        if (rows.length <= 0)
            return;

        return rows;

    } finally {
        await conexao.end();
    }
}

async function buscarMensagensEnviadas(idUsuario) {
    const conexao = await baseDeDados.abrirConexao();

    try {
        const [rows, fields] = await conexao.execute(
            `select mensagem.idMensagem, 
                    mensagem.data, 
                    mensagem.idUsuarioDestinatario, 
                    mensagem.assunto, 
                    mensagem.texto, 
                    mensagem.idMensagemResposta,
                    dest.login as emailDestinatario, 
                    dest.nome as nomeDestinatario,
                    rem.login as emailRemetente
            from mensagens as mensagem
                inner join usuarios as dest on mensagem.idUsuarioDestinatario = dest.idUsuario
                inner join usuarios as rem on mensagem.idUsuarioRemetente = rem.idUsuario
            where mensagem.idUsuarioRemetente = ? and mensagem.excluidaRemetente = false 
            order by mensagem.data desc`, [idUsuario]);

        if (rows.length <= 0)
            return;

        return rows;

    } finally {
        await conexao.end();
    }
}

async function buscarMensagensExcluidas(idUsuario) {

    const conexao = await baseDeDados.abrirConexao();

    try {
        const [rows, fields] = await conexao.execute(
            `select mensagem.idMensagem, 
                mensagem.data, 
                mensagem.idUsuarioRemetente,
                mensagem.assunto, 
                mensagem.texto, 
                mensagem.idMensagemResposta,
                rem.login as emailRemetente,
                rem.nome as nomeRemetente
            from mensagens as mensagem
                inner join usuarios as rem on mensagem.idUsuarioRemetente = rem.idUsuario
            where mensagem.idUsuarioDestinatario = ? and mensagem.excluidaDestinatario = true 
            order by mensagem.data desc`, [idUsuario]);

        if (rows.length <= 0)
            return;

        return rows;

    } finally {
        await conexao.end();
    }
}

async function buscarMensagemPorId(idMensagem) {
    const conexao = await baseDeDados.abrirConexao();

    try {
        const [rows, fields] = await conexao.execute(
            `select 
                mensagem.idMensagem, 
                mensagem.data, 
                mensagem.idUsuarioRemetente, 
                mensagem.idUsuarioDestinatario, 
                mensagem.assunto, 
                mensagem.texto, 
                mensagem.idMensagemResposta,
                mensagem.excluidaRemetente,
                mensagem.excluidaDestinatario,
                dest.login as emailDestinatario, 
                rem.login as emailRemetente,
                rem.nome as nomeRemetente
            from mensagens as mensagem
                inner join usuarios as dest on mensagem.idUsuarioDestinatario = dest.idUsuario
                inner join usuarios as rem on mensagem.idUsuarioRemetente = rem.idUsuario
             where mensagem.idMensagem = ?`, [idMensagem]);

        if (rows.length <= 0)
            return;

        return rows[0];

    } finally {
        await conexao.end();
    }
}

async function excluirMensagem(idUsuario, idMensagem) {
    const conexao = await baseDeDados.abrirConexao();

    try {
        await conexao.execute(
            `UPDATE mensagens
            SET excluidaDestinatario = true
            WHERE idUsuarioDestinatario = ? and idMensagem = ?`, [idUsuario, idMensagem]);

    } finally {
        await conexao.end();
    }
}

async function salvarRespostaDaMensagem(mensagem, mensagemResposta) {
    const conexao = await baseDeDados.abrirConexao();

    try {
        const parametrosDaMensagem = [
            mensagem.idMensagemResposta,
            mensagem.idMensagem
        ]

        const parametrosDaMensagemResposta = [
            mensagemResposta.data,
            mensagemResposta.idMensagem,
            mensagemResposta.idMensagemResposta,
            mensagemResposta.idUsuarioRemetente,
            mensagemResposta.idUsuarioDestinatario,
            mensagemResposta.assunto,
            mensagemResposta.texto,
            mensagemResposta.excluidaRemetente,
            mensagemResposta.excluidaDestinatario
        ]


        await conexao.beginTransaction();

        await conexao.execute(
            `insert into mensagens (
                data,
                idMensagem,
                idMensagemResposta,
                idUsuarioRemetente,
                idUsuarioDestinatario,
                assunto,
                texto,
                excluidaRemetente,
                excluidaDestinatario
            ) 
                values (?, ?, ?, ?, ?, ?, ?, ?, ?);`, parametrosDaMensagemResposta);

        await conexao.execute(
            `update mensagens
            set idMensagemResposta = ?
            where idMensagem = ?`, parametrosDaMensagem);


        await conexao.commit();

    } finally {
        await conexao.end();
    }
}

module.exports = {
    buscarMensagensRecebidas: buscarMensagensRecebidas,
    buscarMensagensEnviadas: buscarMensagensEnviadas,
    buscarMensagensExcluidas: buscarMensagensExcluidas,
    buscarMensagemPorId: buscarMensagemPorId,
    salvarMensagem: salvarMensagem,
    excluirMensagem: excluirMensagem,
    salvarRespostaDaMensagem: salvarRespostaDaMensagem

}
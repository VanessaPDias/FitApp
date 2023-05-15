const Mensagem = require('../model/mensagem');
const repositorioDeUsuarios = require('../repositorios/repositorioDeUsuarios');
const repositorioDeMensagem = require('../repositorios/repositorioDeMensagens');


async function enviarMensagem(req, res) {
    // #swagger.tags = ['Mensagem']
    // #swagger.description = 'endpoint para enviar mensagem.'

    const remetenteEncontrado = await repositorioDeUsuarios.buscarDadosDoUsuarioPorId(req.usuario.idUsuario);

    if (!remetenteEncontrado) {
        res.status(404).send({ erro: "Remetente não encontrado" });
        return;
    }

    const destinatarioEncontrado = await repositorioDeUsuarios.buscarUsuarioPorLogin(req.body.destinatario);
    if (!destinatarioEncontrado) {
        res.status(404).send({ erro: "Destinatario não encontrado" });
        return;
    }

    const mensagem = new Mensagem.Mensagem(
        req.usuario.idUsuario,
        remetenteEncontrado.login,
        destinatarioEncontrado.idUsuario,
        destinatarioEncontrado.login,
        req.body.assunto,
        req.body.texto
    );

    await repositorioDeMensagem.salvarMensagem(mensagem);

    res.send({ idMensagem: mensagem.idMensagem })

}

async function buscarMensagensRecebidas(req, res) {
    // #swagger.tags = ['Mensagem']
    // #swagger.description = 'endpoint para buscar mensagens recebidas.'

    const mensagens = await repositorioDeMensagem.buscarMensagensRecebidas(req.usuario.idUsuario);

    if (!mensagens || mensagens.length <= 0) {
        res.send([]);
        return;
    }

    res.send(mensagens.map(function (mensagem) {
        return {
            idMensagem: mensagem.idMensagem,
            emailRemetente: mensagem.emailRemetente,
            nomeRemetente: mensagem.nomeRemetente,
            data: mensagem.data,
            assunto: mensagem.assunto,
            texto: mensagem.texto
        }
    }))
}

async function buscarMensagensEnviadas(req, res) {
    // #swagger.tags = ['Mensagem']
    // #swagger.description = 'endpoint para buscar mensagens enviadas.'

    const mensagens = await repositorioDeMensagem.buscarMensagensEnviadas(req.usuario.idUsuario);

    if (!mensagens || mensagens.length <= 0) {
        res.send([]);
        return;
    }

    res.send(mensagens.map(function (mensagem) {
        return {
            idMensagem: mensagem.idMensagem,
            remetente: mensagem.emailRemetente,
            destinatario: mensagem.emailDestinatario,
            nomeDestinatario: mensagem.nomeDestinatario,
            data: mensagem.data,
            assunto: mensagem.assunto,
            texto: mensagem.texto
        }
    }))
}

async function buscarMensagensExcluidas(req, res) {
    // #swagger.tags = ['Mensagem']
    // #swagger.description = 'endpoint para buscar mensagens excluídas.'

    const mensagens = await repositorioDeMensagem.buscarMensagensExcluidas(req.usuario.idUsuario);

    if (!mensagens || mensagens.length <= 0) {
        res.send([]);
        return;
    }

    res.send(mensagens.map(function (mensagem) {
        return {
            idMensagem: mensagem.idMensagem,
            emailRemetente: mensagem.emailRemetente,
            nomeRemetente: mensagem.nomeRemetente,
            data: mensagem.data,
            assunto: mensagem.assunto,
            texto: mensagem.texto
        }
    }))
}

async function buscarMensagemPorId(req, res) {
    // #swagger.tags = ['Mensagem']
    // #swagger.description = 'endpoint para buscar mensagem por Id.'

    if (!req.params.idMensagem) {
        res.status(400).send({ erro: "Não é possível buscar mensagem sem Id" });
        return;
    }

    const mensagem = await repositorioDeMensagem.buscarMensagemPorId(req.params.idMensagem);

    if (!mensagem) {
        res.status(404).send({ erro: "Mensagem não encontrada" });
        return;
    }

    res.send({
        idMensagem: mensagem.idMensagem,
        emailRemetente: mensagem.emailRemetente,
        nomeRemetente: mensagem.nomeRemetente,
        emailDestinatario: mensagem.emailDestinatario,
        data: mensagem.data,
        assunto: mensagem.assunto,
        texto: mensagem.texto
    })
}

async function excluirMensagem(req, res) {
    // #swagger.tags = ['Mensagem']
    // #swagger.description = 'endpoint para excluir mensagem.'

    if (!req.params.idMensagem) {
        res.status(400).send({ erro: "Não é possível excluir mensagem sem o id da mensagem" });
        return;
    }

    const mensagem = await repositorioDeMensagem.buscarMensagemPorId(req.params.idMensagem);

    if (!mensagem) {
        res.status(404).send({ erro: "Mensagem não encontrada" });
        return;
    }

    await repositorioDeMensagem.excluirMensagem(req.usuario.idUsuario, req.params.idMensagem);

    res.send();

}

async function responderMensagem(req, res) {
    // #swagger.tags = ['Mensagem']
    // #swagger.description = 'endpoint para responder mensagem.'

    if (!req.params.idMensagem) {
        res.status(400).send({ erro: "Não é possível responder mensagem sem o id da mensagem" });
        return;
    }

    const mensagem = await repositorioDeMensagem.buscarMensagemPorId(req.params.idMensagem);

    if (!mensagem) {
        res.status(404).send({ erro: "Mensagem não encontrada" });
        return;
    }

    let assunto = mensagem.assunto;

    if(!assunto.startsWith("RES:")){
        assunto = `RES: ${assunto}`;
    }    

    const mensagemResposta = new Mensagem.Mensagem(req.usuario.idUsuario, req.usuario.email, mensagem.idUsuarioRemetente, mensagem.emailRemetente, assunto, req.body.texto);

    mensagem.idMensagemResposta = mensagemResposta.idMensagem;

    await repositorioDeMensagem.salvarRespostaDaMensagem(mensagem, mensagemResposta);
   

    res.send({ idMensagemResposta: mensagemResposta.idMensagem });
}





module.exports = {
    enviarMensagem: enviarMensagem,
    buscarMensagensRecebidas: buscarMensagensRecebidas,
    buscarMensagensEnviadas: buscarMensagensEnviadas,
    buscarMensagensExcluidas: buscarMensagensExcluidas,
    buscarMensagemPorId: buscarMensagemPorId,
    excluirMensagem: excluirMensagem,
    responderMensagem: responderMensagem
}
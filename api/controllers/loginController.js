const repositorioDeUsuarios = require('../repositorios/repositorioDeUsuarios');
const servicoDeArquivosEstaticos = require('../servicos/servicoDeArquivosEstaticos');
const jwt = require('jsonwebtoken');
const {GoogleAuth, OAuth2Client} = require('google-auth-library');


async function login(req, res) {
    // #swagger.tags = ['Usuário']
    // #swagger.description = 'endpoint para fazer login.'
    // #swagger.security = [] 

    const login = req.body.email;
    const senha = req.body.senha;

    const usuarioEncontrado = await repositorioDeUsuarios.buscarUsuarioPorLogin(login);

    if (!usuarioEncontrado) {
        res.status(400).send({ erro: "login ou senha incorreto" });
        return;
    }

    if (usuarioEncontrado.bloqueado == 1) {
        res.status(400).send({ erro: "Usuario bloqueado" });
        return;
    }

    if (usuarioEncontrado.senha !== senha) {
        res.status(400).send({ erro: "login ou senha incorreto" });
        return;
    }
    const segredo = "shhhhh";
    const tempoDeExpiracaoEmMinutos = 60 * 60;
    const token = jwt.sign(
        {
            idUsuario: usuarioEncontrado.idUsuario,
            nome: usuarioEncontrado.nome,
            email: usuarioEncontrado.login,
            perfil: usuarioEncontrado.perfil,
            imagem: !usuarioEncontrado.imagem ? null : servicoDeArquivosEstaticos.construirCaminhoParaImagem(usuarioEncontrado.imagem)
        }, segredo, { expiresIn: tempoDeExpiracaoEmMinutos });

    res.send({ token });

}

async function loginGoogle(req, res) {
    // #swagger.tags = ['Usuário']
    // #swagger.description = 'endpoint para fazer login.'
    // #swagger.security = [] 

    const tokenGoogle = req.body.tokenGoogle;

    const clienteGoogle = new OAuth2Client({
        clientId: "228294881734-t18ukuse4ea3k9tm88ck7sb286kbs0h8.apps.googleusercontent.com"        
    });

    const tokenInfo = await clienteGoogle.getTokenInfo(tokenGoogle);

    const usuarioEncontrado = await repositorioDeUsuarios.buscarUsuarioPorLogin(tokenInfo.email);

    if (!usuarioEncontrado) {
        res.status(400).send({ erro: "login ou senha incorreto" });
        return;
    }

    if (usuarioEncontrado.bloqueado == 1) {
        res.status(400).send({ erro: "Usuario bloqueado" });
        return;
    }

    const segredo = "shhhhh";
    const tempoDeExpiracaoEmMinutos = 60 * 60;
    const token = jwt.sign(
        {
            idUsuario: usuarioEncontrado.idUsuario,
            nome: usuarioEncontrado.nome,
            email: usuarioEncontrado.login,
            perfil: usuarioEncontrado.perfil,
            imagem: !usuarioEncontrado.imagem ? null : servicoDeArquivosEstaticos.construirCaminhoParaImagem(usuarioEncontrado.imagem)
        }, segredo, { expiresIn: tempoDeExpiracaoEmMinutos });

    res.send({ token });

}

module.exports = {
    login: login,
    loginGoogle: loginGoogle
}


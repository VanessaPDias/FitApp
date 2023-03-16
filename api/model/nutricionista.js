const Usuario = require('../model/usuario');

function Nutricionista(nome, email, telefone, registroProfissional) {
    if (!nome) {
        throw { mensagem: "Não é possível cadastrar Nutricionista sem o nome", interna: true };
    }

    if (!email) {
        throw { mensagem: "Não é possível cadastrar Nutricionista sem e-mail", interna: true };
    }

    if (!telefone) {
        throw { mensagem: "Não é possível cadastrar Nutricionista sem telefone", interna: true };
    }

    if (!registroProfissional) {
        throw { mensagem: "Não é possível cadastrar Nutricionista sem o Registro Profissional", interna: true };
    }

    this.usuario = new Usuario.Usuario(nome, email, 'nutricionista');
    this.usuario.bloqueado = true;
    this.idNutri = this.usuario.idUsuario;
    this.imagem = this.usuario.imagem;
    this.nome = nome;
    this.email = email;
    this.telefone = telefone;
    this.registroProfissional = registroProfissional;
    this.sobreMim = "";
    this.cadastroConfirmado = 0;
    
}

function validarAlteracaoDoPerfil(nome) {
    if (!nome) {
        throw { mensagem: "O nome do nutricionista precisa ser definido", interna: true };
    }
}



module.exports = {
    Nutricionista: Nutricionista,
    validarAlteracaoDoPerfil: validarAlteracaoDoPerfil
}
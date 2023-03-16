const Usuario = require('../model/usuario');

function PersonalTrainer(nome, email, telefone, registroProfissional) {
    if (!nome) {
        throw { mensagem: "Não é possível cadastrar Personal Trainer sem o nome", interna: true };
    }

    if (!email) {
        throw { mensagem: "Não é possível cadastrar Personal Trainer sem e-mail", interna: true };
    }

    if (!telefone) {
        throw { mensagem: "Não é possível cadastrar Personal Trainer sem telefone", interna: true };
    }

    if (!registroProfissional) {
        throw { mensagem: "Não é possível cadastrar Personal Trainer sem o Registro Profissional", interna: true };
    }

    this.usuario = new Usuario.Usuario(nome, email, 'personalTrainer');
    this.usuario.bloqueado = true;
    this.idPersonal = this.usuario.idUsuario;
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
        throw { mensagem: "O nome do personal trainer precisa ser definido", interna: true };
    }
}


module.exports = {
    PersonalTrainer: PersonalTrainer,
    validarAlteracaoDoPerfil: validarAlteracaoDoPerfil
}
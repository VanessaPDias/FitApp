function gerarMensagemDeBoasVindas(nome, senha) {
    return `
    <p>Olá <b>${nome}</b>,</p> 
    <p>Estamos felizes por tê-lo conosco!</p>
    <p>Esta é a sua senha de acesso ao FitApp: <b>${senha}</b></p>
    <a href="https://green-bay-0aa81ec03.2.azurestaticapps.net/login/entrar.html"><button type="button">Entrar</button></a> 
    <p>Atenciosamente, </p> 
    <p>Equipe FitApp</p>`
}

function gerarMensagemComNovaSenha(nome, senha) {
    return `
    <p>Olá <b>${nome}</b>,</p>
    <p>Esta é a sua nova senha de acesso ao FitApp: <b>${senha}</b></p>
    <a href="https://green-bay-0aa81ec03.2.azurestaticapps.net/login/entrar.html"><button type="button">Entrar</button></a>
    <p>Atenciosamente,</p> 
    Equipe FitApp`
}

function gerarNotificacaoNovoAssinante(nomeDestinatario, nomeAssinante) {
    return `
    Olá ${nomeDestinatario},
    Um novo Assinante foi atribuído a você:
    
    Nome: ${nomeAssinante}

    Atenciosamente, 
    Equipe FitApp`
}

function gerarMensagemDeRecusaDeCadastro(nome) {
    return `
    <p>Olá <b>${nome}</b>,</p> 
    <p>Agradecemos o seu interesse em fazer parte da nossa equipe.</p>
    <p>Desculpe-nos mas, o seu cadastro não foi aprovado.</p>
    <p>Para mais informações, entre em contato conosco:</p>
    <p>admin@fitapp.com</p>
    <p>Atenciosamente,</p> 
    <p>Equipe FitApp</p>`
}


module.exports = {
    gerarMensagemDeBoasVindas: gerarMensagemDeBoasVindas,
    gerarMensagemComNovaSenha:gerarMensagemComNovaSenha,
    gerarNotificacaoNovoAssinante: gerarNotificacaoNovoAssinante,
    gerarMensagemDeRecusaDeCadastro: gerarMensagemDeRecusaDeCadastro
}
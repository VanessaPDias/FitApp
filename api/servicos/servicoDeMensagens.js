function gerarMensagemDeBoasVindas(nome, senha) {
    return `
    Olá ${nome}, <br> 
    Estamos felizes por tê-lo conosco!<br>
    Esta é a sua senha de acesso ao FitApp: ${senha}<br><br>
    <a href="https://green-bay-0aa81ec03.2.azurestaticapps.net/login/entrar.html"><button type="button">Entrar</button></a> 
    Atenciosamente, <br> 
    Equipe FitApp`
}

function gerarMensagemComNovaSenha(nome, senha) {
    return `
    Olá ${nome},<br>
    Esta é a sua nova senha de acesso ao FitApp: ${senha}<br><br>
    <a href="https://green-bay-0aa81ec03.2.azurestaticapps.net/login/entrar.html"><button type="button">Entrar</button></a>
    Atenciosamente, <br> 
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
    Olá ${nome}, <br> 
    Agradecemos o seu interesse em fazer parte da nossa equipe.<br>
    Desculpe-nos mas, o seu cadastro não foi aprovado.<br>
    Para mais informações, entre em contato conosco:<br>
    admin@fitapp.com <br>
    Atenciosamente, <br> 
    Equipe FitApp`
}


module.exports = {
    gerarMensagemDeBoasVindas: gerarMensagemDeBoasVindas,
    gerarMensagemComNovaSenha:gerarMensagemComNovaSenha,
    gerarNotificacaoNovoAssinante: gerarNotificacaoNovoAssinante,
    gerarMensagemDeRecusaDeCadastro: gerarMensagemDeRecusaDeCadastro
}
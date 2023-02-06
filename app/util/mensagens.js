export function exibirMensagemAoCarregarAPagina() {
    const mensagemSucesso = localStorage.getItem("mensagem-sucesso");
    if(mensagemSucesso) {
        mostrarMensagemDeSucesso(mensagemSucesso);
        localStorage.removeItem("mensagem-sucesso");
    }
    
    const mensagemErro = localStorage.getItem("mensagem-erro");
    if(mensagemErro) {
        mostrarMensagemDeErro(mensagemErro);
        localStorage.removeItem("mensagem-erro");
    }
}

export function mostrarMensagemDeErro(mensagem, mostrarAoRecarregarPagina) {
    if(!mostrarAoRecarregarPagina) {
    const elementoToast = document.querySelector("#toast-erro");
    const toast = new bootstrap.Toast(elementoToast);

    document.querySelector("#toast-body-erro").innerHTML = mensagem;
    toast.show();
    } else {
        localStorage.setItem("mensagem-erro", mensagem);
    }
}

export function mostrarMensagemDeSucesso(mensagem, mostrarAoRecarregarPagina) {
    if(!mostrarAoRecarregarPagina) {
        const elementoToast = document.querySelector("#toast-sucesso");
        const toast = new bootstrap.Toast(elementoToast);
    
        document.querySelector("#toast-body-sucesso").innerHTML = mensagem;
        toast.show();
    } else {
        localStorage.setItem("mensagem-sucesso", mensagem);
    }
}

function tratarErros(error, req, res, next) {
    if (error.interna) {
        res.status(400).send({ erro: error.mensagem });
    }
    else {
        res.status(500).send({ erro: "Houve um erro interno, tente novamente mais tarde" });
        console.log(error);
    }
}

module.exports = {
    tratarErros: tratarErros
}
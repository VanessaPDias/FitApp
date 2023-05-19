const jwt = require('jsonwebtoken');

function autenticar (req, res, next) {
    if(req.url.startsWith("/imagens")) {
        next();
        return;
    }

    if(req.url.startsWith("/swagger")) {
        next();
        return;
    }
    
    if (req.url == "/esqueciMinhaSenha") {
        next();
        return;
    }

    if (req.url == "/login") {
        next();
        return;
    }

    if (req.url == "/loginGoogle") {
        next();
        return;
    }


    if(req.url == "/assinantes" && req.method == "POST") {
        next();
        return;
    }

    if( req.url.startsWith("/planos")  && req.method == "GET") {
        next();
        return;
    }

    if(req.url.startsWith("/nutricionistas") && req.method == "GET") {
        next();
        return;
    }

    if(req.url == "/nutricionistas" && req.method == "POST") {
        next();
        return;
    }

    if(req.url.startsWith("/personalTrainers") && req.method == "GET") {
        next();
        return;
    }

    if(req.url == "/personalTrainers" && req.method == "POST") {
        next();
        return;
    }

    if (!req.headers.authorization) {
        res.status(401).send({erro: "Não autorizado"});
        return;
    }

    const token = req.headers.authorization.replace("Bearer ", "");

    try {
        const usuario = jwt.verify(token, 'shhhhh');
        req.usuario = usuario;
        next();
    }
    catch (erro) {
        res.status(401).send({ erro: "Erro na validação do Token." })
        return;
    }
}

module.exports = {
    autenticar: autenticar
}
const sendGrid = require('@sendgrid/mail');

function enviar(para, assunto, texto) {
    sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
    let mensagem = {
        to: para,
        from: process.env.SENDGRID_FROM ,
        subject: assunto,
        html: texto        
    };

    sendGrid
    .send(mensagem)
    .then(() => {}, error => {
        console.error(error);

        if(error.response) {
            console.error(error.response.body)
        }
    });
}

module.exports = {
    enviar:enviar
}
const sendGrid = require('@sendgrid/mail');

function enviar(para, assunto, texto) {
    console.log('CHAVESENDGRID:' + process.env.SENDGRID_API_KEY);
    
    sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
    let mensagem = {
        to: para,
        from: "bemestar.fitapp@outlook.com",
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
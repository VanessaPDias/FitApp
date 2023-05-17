const { spec } = require('pactum');
const configuracoes = require('../../configuracoes');
const crypto = require('crypto');
const personalTrainers = require('../../funcoes/personalTrainer');
const usuario = require('../../funcoes/usuario');

it('o sistema apresenta os Personal Trainers ativos', async () => {
    const token = await usuario.gerarToken('admin@fitapp.com', 'admin123');

    const emailPersonalBloqueado =  `personal_teste_${crypto.randomUUID()}@fitapp.com`;
    const emailPersonalAtivo =  `personal_teste_${crypto.randomUUID()}@fitapp.com`;
    
    const idPersonalBloqueado = await personalTrainers.cadastrarPersonal(token, `personal_teste_${crypto.randomUUID()}`, emailPersonalBloqueado, "99999999", "crn000");
    const idPersonalAtivo = await personalTrainers.cadastrarPersonal(token, `personal_teste_${crypto.randomUUID()}`, emailPersonalAtivo, "555555555", "CRN 555");

    await personalTrainers.alterarDadosDoPersonal(token, idPersonalBloqueado, "personal_bloqueado", emailPersonalBloqueado,"000000000", "CRN 123",  true, 1);
    await personalTrainers.alterarDadosDoPersonal(token, idPersonalAtivo, "personal_Ativo", emailPersonalBloqueado,"000000000", "CRN 123",  true, 1);
    
    await spec()
        .get(`${configuracoes.urlDaApi}/personalTrainers`)
        
        .expectJsonLike([
            {
                "idPersonal": idPersonalAtivo
            }
        ])
        .expectStatus(200);

        
})
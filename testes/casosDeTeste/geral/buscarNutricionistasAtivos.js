const { spec } = require('pactum');
const configuracoes = require('../../configuracoes');
const crypto = require('crypto');
const nutricionista = require('../../funcoes/nutricionista');
const usuario = require('../../funcoes/usuario');

it('o sistema apresenta os Nutricionistas ativos', async () => {
    const token = await usuario.gerarToken('admin@fitapp.com', 'admin123');

    const emailNutriBloqueado =  `nutri_teste_${crypto.randomUUID()}@fitapp.com`;
    const emailNutriAtivo =  `nutri_teste_${crypto.randomUUID()}@fitapp.com`;
    
    const idNutriBloqueado = await nutricionista.cadastrarNutri(token, `nutri_teste_${crypto.randomUUID()}`, emailNutriBloqueado, "99999999", "crn000");
    const idNutriAtivo = await nutricionista.cadastrarNutri(token, `nutri_teste_${crypto.randomUUID()}`, emailNutriAtivo, "555555555", "CRN 555");

    await nutricionista.alterarDadosDoNutricionista(token, idNutriBloqueado, "nutri_bloqueado", emailNutriBloqueado,"000000000", "CRN 123",  true, 1);
    await nutricionista.alterarDadosDoNutricionista(token, idNutriAtivo, "nutri_Ativo", emailNutriBloqueado,"000000000", "CRN 123",  true, 1);
    
    await spec()
        .get(`${configuracoes.urlDaApi}/nutricionistas`)
        
        .expectJsonLike([
            {
                "idNutri": idNutriAtivo
            }
        ])
        .expectStatus(200);


})
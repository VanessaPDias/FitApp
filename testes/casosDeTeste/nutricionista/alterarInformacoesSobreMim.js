const { spec } = require('pactum');
const usuario = require('../../funcoes/usuario');

it('CU-N 04 - O Nutricionista deve alterar as informacoes Sobre Mim', async () => {
    const tokenNutri = await usuario.gerarToken('nutri@fitapp.com', 'nutri123');

    await spec()
        .patch(`http://localhost:3000/nutricionista/sobreMim`)
        .withHeaders("Authorization", "Bearer " + tokenNutri)
        .withJson({
            "texto": "Informações sobre a Nutri",
            
        })
        .expectStatus(200);

        await spec()
        .get(`http://localhost:3000/nutricionista/perfil`)
        .withHeaders("Authorization", "Bearer " + tokenNutri)
        .expectJsonLike(
            {
                idNutri: 'idNutri',
                sobreMim:  "Informações sobre a Nutri"
            }
        )
        .expectStatus(200);
        
})
const { spec } = require('pactum');
const usuario = require('../../funcoes/usuario');

it('CU-N 07 - deve listar os dados do Paciente', async () => {

    const tokenNutri = await usuario.gerarToken('nutri@fitapp.com', 'nutri123');

    await spec()
        .get(`http://localhost:3000/nutricionista/idNutri/paciente/idAssinante`)
        .withHeaders("Authorization", "Bearer " + tokenNutri)
        .expectJsonLike(
            {
                nome: 'Assinante'
            }
        )
        .expectStatus(200);



});

it('CU-N 07 - não encontra Paciente quando o id não existe', async () => {

    const tokenNutri = await usuario.gerarToken('nutri@fitapp.com', 'nutri123');

    await spec()
        .get(`http://localhost:3000/nutricionista/idNutri/paciente/id`)
        .withHeaders("Authorization", "Bearer " + tokenNutri)
        .expectJson({ erro: "Não encontrado" })
        .expectStatus(404);



});
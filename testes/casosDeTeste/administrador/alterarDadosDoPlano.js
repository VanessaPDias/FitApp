const { spec } = require('pactum');
const configuracoes = require('../../configuracoes');
const usuario = require('../../funcoes/usuario');
const plano = require('../../funcoes/plano');

const crypto = require('crypto');

it('CU-A 18 - deve alterar dados do Plano', async () => {
    const token = await usuario.gerarToken('admin@fitapp.com', 'admin123');


    const idPlano = await plano.cadastrarPlano(token, `gratuito_${crypto.randomUUID()}`, 0, 15, "Experimente gratis por 15 dias", "2023-01-01 00:00:00");

    await spec()
        .get(`${configuracoes.urlDaApi}/admin/planos/${idPlano}`)
        .withHeaders("Authorization", "Bearer " + token)
        .expectJsonLike(
            {
                "idPlano": idPlano,
            }
        )
        .expectStatus(200);

    const nomeNovoPlano = `trimestral_${crypto.randomUUID()}`

    await plano.alterarPlano(token, idPlano, nomeNovoPlano, 0, 90, "Experimente gratis por 15 dias", true, "2023-01-01 00:00:00")

    await spec()
        .get(`${configuracoes.urlDaApi}/admin/planos/${idPlano}`)
        .withHeaders("Authorization", "Bearer " + token)
        .expectJsonLike(
            {
                nome: nomeNovoPlano
            }
        )
        .expectStatus(200);
});

it('CU-A 18 - Não altera dados do Plano quando o Id não existe', async () => {
    const token = await usuario.gerarToken('admin@fitapp.com', 'admin123');

    const idPlano = await plano.cadastrarPlano(token, `gratuito_${crypto.randomUUID()}`, 0, "Experimente gratis por 15 dias", "2023-01-01 00:00:00");
    
    await spec()
        .patch(`${configuracoes.urlDaApi}/admin/planos/${crypto.randomUUID()}`)
        .withHeaders("Authorization", "Bearer " + token)
        .withJson({
            "nome": `gratuito_55`,
            "valor": 0,
            "duracao": 365,
            "descricao": "Experimente gratis por 15 dias",
            "bloqueado": true,
            "dataLancamento": "2023-01-01 00:00:00"
        })
        .expectJson({ erro: "Plano não encontrado" })
        .expectStatus(404);
});

it('CU-A 18 - Não altera o nome do Plano quando já existe um plano cadastrado com mesmo nome', async () => {
    const token = await usuario.gerarToken('admin@fitapp.com', 'admin123');

    const idPlano = await plano.cadastrarPlano(token, `Gratuito_${crypto.randomUUID()}`, 0, 30,  "Experimente gratis por 15 dias", "2023-01-01 00:00:00");

    await spec()
        .patch(`${configuracoes.urlDaApi}/admin/planos/${idPlano}`)
        .withHeaders("Authorization", "Bearer " + token)
        .withJson({
            "nome": `Gratuito`,
            "valor": 0,
            "duracao": 365,
            "descricao": "Experimente gratis por 15 dias",
            "bloqueado": true,
            "dataLancamento": "2023-01-01 00:00:00"
        })
        .expectJson({ erro: "Já existe Plano com esse nome" })
        .expectStatus(400);
});
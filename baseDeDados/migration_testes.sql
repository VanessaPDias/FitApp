insert into planos (idPlano, nome, valor, duracao, descricao, bloqueado, dataLancamento)
values(
'idGratuito_teste',
'gratuito_teste',
0,
15,
'experimente por 15 dias.',
false,
'2023-01-01 00:00:00'
)
ON DUPLICATE KEY UPDATE idPlano = 'idGratuito_teste';

insert into planos (idPlano, nome, valor, duracao, descricao, bloqueado, dataLancamento)
values(
'idMensal_teste',
'mensal_teste',
100,
30,
'utilize por 30 dias.',
false,
'2023-01-01 00:00:00'
)
ON DUPLICATE KEY UPDATE idPlano = 'idMensal_teste';

insert into planos (idPlano, nome, valor, duracao, descricao, bloqueado, dataLancamento)
values(
'idAnual_teste',
'anual_teste',
250,
365,
'utilize por 365 dias.',
false,
'2023-01-01 00:00:00'
) ON DUPLICATE KEY UPDATE idPlano = 'idAnual_teste';

insert into usuarios (idUsuario, perfil, nome, login, senha, bloqueado)
values (
'idNutri_teste',
'nutricionista',
'nutricionista_teste',
'nutri_teste@fitapp.com',
'nutri123',
false
) ON DUPLICATE KEY UPDATE idUsuario = 'idNutri_teste';

insert into usuarios (idUsuario, perfil, nome, login, senha, bloqueado)
values (
'idPersonal_teste',
'personalTrainer',
'personal_teste',
'personal_teste@fitapp.com',
'personal123',
false
) ON DUPLICATE KEY UPDATE idUsuario = 'idPersonal_teste';

insert into usuarios (idUsuario, perfil, nome, login, senha, bloqueado)
values (
'idAssinante_teste',
'assinante',
'assinante_teste',
'assinante_teste@fitapp.com',
'assinante123',
false
) ON DUPLICATE KEY UPDATE idUsuario = 'idAssinante_teste';

insert into usuarios (idUsuario, perfil, nome, login, senha, bloqueado)
values (
'idAssinanteBloqueado_teste',
'assinante',
'assinanteBloqueado_teste',
'assinantebloqueado_teste@fitapp.com',
'assinante123',
true
) ON DUPLICATE KEY UPDATE idUsuario = 'idAssinanteBloqueado_teste';

insert into usuarios (idUsuario, perfil, nome, login, senha, bloqueado)
values (
'idAssinanteAssinatura_teste',
'assinante',
'assinanteAssinatura_teste',
'assinanteassinatura_teste@fitapp.com',
'assinante123',
false
) ON DUPLICATE KEY UPDATE idUsuario = 'idAssinanteAssinatura_teste';

insert into nutricionistas (idNutri, nome, email, telefone, registroProfissional, cadastroConfirmado)
values (
'idNutri_teste',
'nutricionista_teste',
'nutri_teste@fitapp.com',
999999999,
'crn123',
'1'
) ON DUPLICATE KEY UPDATE idNutri = 'idNutri_teste';

insert into personal_trainers (idPersonal, nome, email, telefone, registroProfissional, cadastroConfirmado)
values (
'idPersonal_teste',
'personal_teste',
'personal_teste@fitapp.com',
999999999,
'cre123',
'1'
) ON DUPLICATE KEY UPDATE idPersonal = 'idPersonal_teste';

insert into assinantes (idAssinante, idNutri, idPersonal, nome, email, altura)
values (
'idAssinante_teste',
'idNutri_teste',
'idPersonal_teste',
'assinante_teste',
'assinante_teste@fitapp.com',
'0'
) ON DUPLICATE KEY UPDATE idAssinante = 'idAssinante_teste';

insert into assinantes (idAssinante, idNutri, idPersonal, nome, email, altura)
values (
'idAssinanteBloqueado_teste',
'idNutri_teste',
'idPersonal_teste',
'assinanteBloqueado_teste',
'assinantebloqueado_teste@fitapp.com',
'0'
) ON DUPLICATE KEY UPDATE idAssinante = 'idAssinanteBloqueado_teste';

insert into assinantes (idAssinante, idNutri, idPersonal, nome, email, altura)
values (
'idAssinanteAssinatura_teste',
'idNutri_teste',
'idPersonal_teste',
'assinante_teste',
'assinanteassinatura_teste@fitapp.com',
'0'
)ON DUPLICATE KEY UPDATE idAssinante = 'idAssinanteAssinatura_teste';

insert into assinaturas (idAssinatura, idAssinante, idPlano, dataInicio, dataFim, bloqueado)
values (
'idAssinatura_teste',
'idAssinante_teste',
'idGratuito_teste',
now(),
date_add(now(),interval 15 day),
false
) ON DUPLICATE KEY UPDATE idAssinatura = 'idAssinatura_teste';

insert into assinaturas (idAssinatura, idAssinante, idPlano, dataInicio, dataFim, bloqueado)
values (
'idAssinaturaBloqueada_teste',
'idAssinanteBloqueado_teste',
'idGratuito_teste',
now(),
date_add(now(),interval 15 day),
true
) ON DUPLICATE KEY UPDATE idAssinatura = 'idAssinaturaBloqueada_teste';

insert into assinaturas (idAssinatura, idAssinante, idPlano, dataInicio, dataFim, bloqueado)
values (
'idAssinaturaAssinatura_teste',
'idAssinanteAssinatura_teste',
'idGratuito_teste',
now(),
date_add(now(),interval 15 day),
false
) ON DUPLICATE KEY UPDATE idAssinatura = 'idAssinaturaAssinatura_teste';

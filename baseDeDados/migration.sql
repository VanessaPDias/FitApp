CREATE DATABASE  IF NOT EXISTS `db_fitapp` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `db_fitapp`;

-- CREATE USER IF NOT EXISTS 'fitapp_user'@'db-fitapp.mysql.database.azure.com' IDENTIFIED BY '4542';
-- GRANT ALL PRIVILEGES ON `db_fitapp`.* TO 'fitapp_user'@'db-fitapp.mysql.database.azure.com';
-- FLUSH PRIVILEGES; 

CREATE TABLE  IF NOT EXISTS `usuarios` (
  `idUsuario` varchar(36) NOT NULL, 
  `perfil` varchar(32) NOT NULL,
  `nome` varchar(128) NOT NULL,
  `login` varchar(128) NOT NULL,
  `senha` varchar(64) NOT NULL,
  `bloqueado` tinyint NOT NULL,
  `imagem` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`idUsuario`),
  UNIQUE KEY `login_usuario_UNIQUE` (`login`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE  IF NOT EXISTS `nutricionistas` (
  `idNutri` varchar(36) NOT NULL,
  `nome` varchar(128) NOT NULL,
  `email` varchar(128) NOT NULL,
  `telefone` varchar(36) NOT NULL,
  `registroProfissional` varchar(30) NOT NULL,
  `sobreMim` varchar(356) DEFAULT NULL,
  `cadastroConfirmado` int NOT NULL,
  PRIMARY KEY (`idNutri`),
  CONSTRAINT `fk_nutricionista_idUsuario` FOREIGN KEY (`idNutri`) REFERENCES `usuarios` (`idUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE  IF NOT EXISTS `personal_trainers` (
  `idPersonal` varchar(36) NOT NULL,
  `nome` varchar(128) NOT NULL,
  `email` varchar(128) NOT NULL,
  `telefone` varchar(36) NOT NULL,
  `registroProfissional` varchar(30) NOT NULL,
  `sobreMim` varchar(356) DEFAULT NULL,
   `cadastroConfirmado` int NOT NULL,
  PRIMARY KEY (`idPersonal`),
  CONSTRAINT `fk_personal_idUsuario` FOREIGN KEY (`idPersonal`) REFERENCES `usuarios` (`idUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE  IF NOT EXISTS `sexos` (
  `idSexo` int NOT NULL,
  `descricao` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`idSexo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE  IF NOT EXISTS `assinantes` (
  `idAssinante` varchar(36) NOT NULL,
  `idNutri` varchar(36) NOT NULL,
  `idPersonal` varchar(36) NOT NULL,
  `nome` varchar(128) NOT NULL,
  `email` varchar(128) NOT NULL,
  `dataNascimento` datetime DEFAULT NULL,
  `idSexo` int DEFAULT NULL,
  `altura` int NOT NULL,
  PRIMARY KEY (`idAssinante`),
  KEY `fk_assinante_idNutricionista_idx` (`idNutri`),
  KEY `fk_assinante_idPersonal_idx` (`idPersonal`),
  KEY `fk_assinante_idSexo_idx` (`idSexo`),
  CONSTRAINT `fk_assinante_idNutricionista` FOREIGN KEY (`idNutri`) REFERENCES `nutricionistas` (`idNutri`),
  CONSTRAINT `fk_assinante_idPersonal` FOREIGN KEY (`idPersonal`) REFERENCES `personal_trainers` (`idPersonal`),
  CONSTRAINT `fk_assinante_idSexo` FOREIGN KEY (`idSexo`) REFERENCES `sexos` (`idSexo`),
  CONSTRAINT `fk_assinante_idUsuario` FOREIGN KEY (`idAssinante`) REFERENCES `usuarios` (`idUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE  IF NOT EXISTS `medidas` (
  `idMedidas` varchar(36) NOT NULL,
  `idAssinante` varchar(36) NOT NULL,
  `peso` int DEFAULT NULL,
  `pescoco` int DEFAULT NULL,
  `cintura` int DEFAULT NULL,
  `quadril` int DEFAULT NULL,
  `data` datetime NOT NULL,
  PRIMARY KEY (`idMedidas`),
  KEY `fk_medidas_idAssinante_idx` (`idAssinante`),
  CONSTRAINT `fk_medidas_idAssinante` FOREIGN KEY (`idAssinante`) REFERENCES `assinantes` (`idAssinante`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE  IF NOT EXISTS `planos` (
  `idPlano` varchar(36) NOT NULL,
  `nome` varchar(128) NOT NULL,
  `valor` decimal(5,2) NOT NULL,
  `duracao` int NOT NULL,
  `descricao` varchar(256) NOT NULL,
  `bloqueado` tinyint NOT NULL,
  `dataLancamento` datetime NOT NULL,
  PRIMARY KEY (`idPlano`),
  UNIQUE KEY `nome_plano_UNIQUE` (`nome`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE  IF NOT EXISTS `assinaturas` (
  `idAssinatura` varchar(36) NOT NULL,
  `idAssinante` varchar(36) NOT NULL,
  `idPlano` varchar(36) NOT NULL,
  `dataInicio` datetime NOT NULL,
  `dataFim` datetime NOT NULL,
  `bloqueado` tinyint NOT NULL,
  PRIMARY KEY (`idAssinatura`),
  KEY `fk_idAssinante_idx` (`idAssinante`),
  KEY `fk_assinatura_idPlano_idx` (`idPlano`),
  CONSTRAINT `fk_assinatura_idAssinante` FOREIGN KEY (`idAssinante`) REFERENCES `assinantes` (`idAssinante`),
  CONSTRAINT `fk_assinatura_idPlano` FOREIGN KEY (`idPlano`) REFERENCES `planos` (`idPlano`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `dietas` (
  `idDieta` VARCHAR(36) NOT NULL,
  `idAssinante` VARCHAR(36) NOT NULL,
  `idNutri` VARCHAR(36) NOT NULL,
  `nome` VARCHAR(128) NOT NULL,
  `objetivo` VARCHAR(126) NOT NULL,
  `dataInicio` DATETIME NOT NULL,
  `dataFim` DATETIME NOT NULL,
  `data` DATETIME NOT NULL,
  `dietaAtual` tinyint NOT NULL,
  PRIMARY KEY (`idDieta`),
  INDEX `fk_dietas_idAssinante_idx` (`idAssinante` ASC) VISIBLE,
  INDEX `fk_dietas_idNutri_idx` (`idNutri` ASC) VISIBLE,
  CONSTRAINT `fk_dietas_idAssinante` FOREIGN KEY (`idAssinante`) REFERENCES `db_fitapp`.`assinantes` (`idAssinante`),
  CONSTRAINT `fk_dietas_idNutri` FOREIGN KEY (`idNutri`) REFERENCES `db_fitapp`.`nutricionistas` (`idNutri`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `treinos` (
  `idTreino` VARCHAR(36) NOT NULL,
  `idAssinante` VARCHAR(36) NOT NULL,
  `idPersonal` VARCHAR(36) NOT NULL,
  `nome` VARCHAR(128) NOT NULL,
  `objetivo` VARCHAR(126) NOT NULL,
  `dataInicio` DATETIME NOT NULL,
  `dataFim` DATETIME NOT NULL,
  `data` DATETIME NOT NULL,
  `treinoAtual` tinyint NOT NULL,
  PRIMARY KEY (`idTreino`),
  INDEX `fk_treinos_idAssinante_idx` (`idAssinante` ASC) VISIBLE,
  INDEX `fk_treinos_idPersonal_idx` (`idPersonal` ASC) VISIBLE,
  CONSTRAINT `fk_treinos_idAssinante` FOREIGN KEY (`idAssinante`) REFERENCES `db_fitapp`.`assinantes` (`idAssinante`),
  CONSTRAINT `fk_treinos_idTreino` FOREIGN KEY (`idPersonal`) REFERENCES `db_fitapp`.`personal_trainers` (`idPersonal`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    
CREATE TABLE IF NOT EXISTS `itens_dieta` (
  `idItemDieta` VARCHAR(36) NOT NULL,
  `idDieta` VARCHAR(36) NOT NULL,
  `descricao` VARCHAR(256) NOT NULL,
  `refeicao` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`idItemDieta`),
  INDEX `fk_itensDieta_idDieta_idx` (`idDieta` ASC) VISIBLE,
  CONSTRAINT `fk_itensDieta_idDieta` FOREIGN KEY (`idDieta`) REFERENCES `db_fitapp`.`dietas` (`idDieta`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `exercicios` (
  `idExercicio` VARCHAR(36) NOT NULL,
  `idTreino` VARCHAR(36) NOT NULL,
  `descricao` VARCHAR(256) NOT NULL,
  `diaDoTreino` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`idExercicio`),
  INDEX `fk_exercicios_idTreino_idx` (`idTreino` ASC) VISIBLE,
  CONSTRAINT `fk_exercicios_idTreino` FOREIGN KEY (`idTreino`) REFERENCES `db_fitapp`.`treinos` (`idTreino`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

set foreign_key_checks = 0;

CREATE TABLE IF NOT EXISTS `mensagens` (
  `idMensagem` VARCHAR(36) NOT NULL,
  `data` DATETIME NOT NULL,
  `idUsuarioRemetente` VARCHAR(36) NOT NULL,
  `idUsuarioDestinatario` VARCHAR(36) NOT NULL,
  `assunto` VARCHAR(128) NOT NULL,
  `texto` VARCHAR(2048) NOT NULL,
  `excluidaRemetente` TINYINT NOT NULL,
  `excluidaDestinatario` TINYINT NOT NULL,
  `idMensagemResposta` VARCHAR(36) NULL,
  PRIMARY KEY (`idMensagem`),
  INDEX `fk_mensagens_idUsuarioRemetente_idx` (`idUsuarioRemetente` ASC) VISIBLE,
  INDEX `fk_mensagens_idUsuarioDestinatario_idx` (`idUsuarioDestinatario` ASC) VISIBLE,
  CONSTRAINT `fk_mensagens_idUsuarioRemetente`
    FOREIGN KEY (`idUsuarioRemetente`)
    REFERENCES `db_fitapp`.`usuarios` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_mensagens_idUsuarioDestinatario`
    FOREIGN KEY (`idUsuarioDestinatario`)
    REFERENCES `db_fitapp`.`usuarios` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION, 
    CONSTRAINT `fk_mensagens_idMensagemResposta`
    FOREIGN KEY (`idMensagemResposta`)
    REFERENCES `db_fitapp`.`mensagens` (`idMensagem`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
    
set foreign_key_checks = 1;

insert into sexos (idSexo, descricao) values(1, 'feminino')
ON DUPLICATE KEY UPDATE idSexo = 1;

insert into sexos (idSexo, descricao) values(2, 'masculino')
ON DUPLICATE KEY UPDATE idSexo = 2;

INSERT into usuarios (idUsuario, perfil, nome, login, senha, bloqueado)
values (
'e7c17d74-f067-46ca-9734-1c232ba0ea18',
'administrador',
'administrador',
'admin@fitapp.com',
'admin123',
false
)
ON DUPLICATE KEY UPDATE idUsuario = 'e7c17d74-f067-46ca-9734-1c232ba0ea18';

insert into planos (idPlano, nome, valor, duracao, descricao, bloqueado, dataLancamento)
values(
'57408fdd-8ccc-441a-953f-555dec2005bc',
'Gratuito',
0,
365,
'Use o FitApp de forma gratuita com as funcionalidades básicas.',
false,
'2023-01-01 00:00:00'
)
ON DUPLICATE KEY UPDATE idPlano = '57408fdd-8ccc-441a-953f-555dec2005bc';

insert into planos (idPlano, nome, valor, duracao, descricao, bloqueado, dataLancamento)
values(
'a6b5723a-e550-4160-8588-0a7aee7b7e54',
'Mensal',
24.99,
30,
'Use todas as funcionalidades do FitApp pagando um pequeno valor mensal.',
false,
'2043-01-01 00:00:00'
)
ON DUPLICATE KEY UPDATE idPlano = 'a6b5723a-e550-4160-8588-0a7aee7b7e54';

insert into planos (idPlano, nome, valor, duracao, descricao, bloqueado, dataLancamento)
values(
'28ba9d23-b9f4-41e2-ab7f-d108cf942e9d',
'Anual',
239.88,
365,
'Use todas as funcionalidades do FitApp e economize R$ 60,00 ao ano.',
false,
'2043-01-01 00:00:00'
)
ON DUPLICATE KEY UPDATE idPlano = '28ba9d23-b9f4-41e2-ab7f-d108cf942e9d';

INSERT into usuarios (idUsuario, perfil, nome, login, senha, bloqueado)
values (
'cdb6531c-0bc4-48b2-b317-dece78f5349e',
'nutricionista',
'nutricionista',
'nutri@fitapp.com',
'nutri123',
false
)
ON DUPLICATE KEY UPDATE idUsuario = 'cdb6531c-0bc4-48b2-b317-dece78f5349e';

INSERT into usuarios (idUsuario, perfil, nome, login, senha, bloqueado)
values (
'355049aa-1742-45d2-934d-278db5a6c224',
'personalTrainer',
'personal',
'personal@fitapp.com',
'personal123',
false
)
ON DUPLICATE KEY UPDATE idUsuario = '355049aa-1742-45d2-934d-278db5a6c224';

INSERT into nutricionistas (idNutri, nome, email, telefone, registroProfissional, cadastroConfirmado)
values (
'cdb6531c-0bc4-48b2-b317-dece78f5349e',
'nutricionista',
'nutri@fitapp.com',
999999999,
'crn123',
true
)
ON DUPLICATE KEY UPDATE idNutri = 'cdb6531c-0bc4-48b2-b317-dece78f5349e';

INSERT into personal_trainers (idPersonal, nome, email, telefone, registroProfissional, cadastroConfirmado)
values (
'355049aa-1742-45d2-934d-278db5a6c224',
'personal',
'personal@fitapp.com',
999999999,
'cre123',
true
)
ON DUPLICATE KEY UPDATE idPersonal = '355049aa-1742-45d2-934d-278db5a6c224';


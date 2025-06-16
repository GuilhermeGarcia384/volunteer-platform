-- Criar e usar a database
CREATE DATABASE IF NOT EXISTS site_voluntariado;
USE site_voluntariado;
	
-- Tabela de ONGs
CREATE TABLE IF NOT EXISTS ongs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    endereco VARCHAR(100)
);

-- Tabela de Oportunidades
CREATE TABLE IF NOT EXISTS oportunidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data_pub DATETIME DEFAULT CURRENT_TIMESTAMP,	
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    ong_id INT NOT NULL,
    ong_nome VARCHAR(100) NOT NULL,
    FOREIGN KEY (ong_id) REFERENCES ongs(id) ON DELETE CASCADE
);

-- Tabela de Voluntários
CREATE TABLE IF NOT EXISTS voluntarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    nascimento DATE,
    cpf VARCHAR(11),
    mensagem TEXT
);

-- Tabela de Inscrições
CREATE TABLE IF NOT EXISTS inscricoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    voluntario_id INT,
    voluntario_nome VARCHAR(100) NOT NULL,
    oportunidade_id INT,
    data_inscricao DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pendente', 'aprovado', 'rejeitado') DEFAULT 'pendente',
    FOREIGN KEY (voluntario_id) REFERENCES voluntarios(id),
    FOREIGN KEY (oportunidade_id) REFERENCES oportunidades(id)
);

-- Usar a database
USE site_voluntariado;

-- Mostrar as tabelas
SHOW TABLES;

-- Inserir dados de exemplo na tabela ONGs
INSERT INTO ongs (nome, endereco) VALUES ('Teste ONG', 'Rua Exemplo, 123');

-- Inserir dados de exemplo na tabela Oportunidades (com ID de ONG)
INSERT INTO oportunidades (titulo, descricao, ong_id, ong_nome) 
VALUES ('Oportunidade de Voluntariado', 'Ajude a nossa ONG com atividades sociais!', 1, 'Teste ONG');

-- Inserir dados de exemplo na tabela Voluntários
INSERT INTO voluntarios (nome, nascimento, cpf, mensagem) 
VALUES ('Petrônio Brás de Cunha', '1967-02-19', '81909010', 'Eu sou Petrônio "Petrobras" Bras de Cunha');

-- Inserir dados de exemplo na tabela Inscrições (com IDs de Oportunidade e Voluntário)
INSERT INTO inscricoes (voluntario_id, voluntario_nome, oportunidade_id) 
VALUES (1, 'Petrônio Brás de Cunha', 1);

-- Ver conteúdo das tabelas
SELECT * FROM ongs;
SELECT * FROM oportunidades;
SELECT * FROM voluntarios;
SELECT * FROM inscricoes;

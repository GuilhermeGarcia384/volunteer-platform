-- Criar e usar a database
DROP DATABASE IF EXISTS site_voluntariado;
CREATE DATABASE site_voluntariado;
USE site_voluntariado;

-- Tabela de ONGs
DROP TABLE IF EXISTS ongs;
CREATE TABLE ongs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    endereco VARCHAR(100)
);

-- Tabela de Oportunidades
DROP TABLE IF EXISTS oportunidades;
CREATE TABLE oportunidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data_pub DATETIME DEFAULT CURRENT_TIMESTAMP,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    latitude TEXT,
    longitude TEXT,
    ong_id INT NOT NULL,
    ong_nome VARCHAR(100) NOT NULL,
    FOREIGN KEY (ong_id) REFERENCES ongs(id) ON DELETE CASCADE
);

-- Tabela de Voluntários
DROP TABLE IF EXISTS voluntarios;
CREATE TABLE voluntarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    nascimento DATE,
    cpf VARCHAR(11),
    mensagem TEXT
);

-- Tabela de Inscrições
DROP TABLE IF EXISTS inscricoes;
CREATE TABLE inscricoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    voluntario_id INT,
    voluntario_nome VARCHAR(100) NOT NULL,
    oportunidade_id INT,
    data_inscricao DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pendente', 'aprovado', 'rejeitado') DEFAULT 'pendente',
    FOREIGN KEY (voluntario_id) REFERENCES voluntarios(id),
    FOREIGN KEY (oportunidade_id) REFERENCES oportunidades(id)
);

-- Inserir dados de exemplo
INSERT INTO ongs (nome, endereco) VALUES ('Teste ONG', 'Rua Exemplo, 123');

INSERT INTO oportunidades (titulo, descricao, latitude, longitude, ong_id, ong_nome) VALUES
('Mutirão na Vila Mariana', 'Ajude a pintar a sede da ONG e organizar doações.', '-23.5897', '-46.6358', 1, 'Teste ONG'),

('Feira de Adoção na Paulista', 'Auxilie com organização e cuidado de pets para adoção.', '-23.5649', '-46.6527', 1, 'Teste ONG'),

('Recreação no Parque Ibirapuera', 'Conduza atividades lúdicas com crianças em situação de risco.', '-23.5874', '-46.6576', 1, 'Teste ONG'),

('Entrega de Cestas em Itaquera', 'Ajude na separação e entrega de alimentos a famílias cadastradas.', '-23.5446', '-46.4606', 1, 'Teste ONG'),

('Oficina de Arte em Pinheiros', 'Instrua crianças em oficinas de arte e criatividade.', '-23.5615', '-46.7021', 1, 'Teste ONG'),

('Campanha de Saúde na Lapa', 'Oriente moradores sobre prevenção de doenças.', '-23.5216', '-46.6934', 1, 'Teste ONG'),

('Educação Ambiental no Brás', 'Organize palestras e dinâmicas sobre sustentabilidade.', '-23.5428', '-46.6215', 1, 'Teste ONG'),

('Atendimento no Centro de Apoio Sé', 'Acolha e oriente pessoas em situação de rua.', '-23.5503', '-46.6339', 1, 'Teste ONG');

INSERT INTO voluntarios (nome, nascimento, cpf, mensagem) 
VALUES ('Petrônio Brás de Cunha', '1967-02-19', '81909010', 'Eu sou Petrônio "Petrobras" Bras de Cunha');

INSERT INTO inscricoes (voluntario_id, voluntario_nome, oportunidade_id) 
VALUES (1, 'Petrônio Brás de Cunha', 1);

-- Ver conteúdo das tabelas
SELECT * FROM ongs;
SELECT * FROM oportunidades;
SELECT * FROM voluntarios;
SELECT * FROM inscricoes;
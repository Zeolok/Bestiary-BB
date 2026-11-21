CREATE DATABASE bdnode;
use bdnode;	

CREATE TABLE estatistica (
id_fraqueza INT AUTO_INCREMENT PRIMARY KEY,
nome_fraqueza VARCHAR(100) NOT NULL
);
INSERT INTO estatistica (nome_fraqueza) VALUES
('Físico'),
('Cortante'),
('Arcano'),
('Fogo'),
('Elétrico');
SELECT * FROM estatistica;

CREATE TABLE statuscriatura (
id_status INT AUTO_INCREMENT PRIMARY KEY,
nome_status VARCHAR(100) NOT NULL
);
INSERT INTO statuscriatura (nome_status) VALUES
('Derrotado(a)'),
('Não Derrotado(a)');
SELECT * FROM statuscriatura;

CREATE TABLE bestiario (
    id_criatura INT AUTO_INCREMENT PRIMARY KEY,
    id_fraqueza INT NOT NULL,
    id_status INT NOT NULL,
    nome VARCHAR(120) NOT NULL UNIQUE,
    localizacao VARCHAR(30) NOT NULL,
	ecos INT NOT NULL,
    FOREIGN KEY (id_fraqueza) REFERENCES estatistica(id_fraqueza),
    FOREIGN KEY (id_status) REFERENCES statuscriatura(id_status)
);
INSERT INTO bestiario (nome, localizacao, ecos, id_fraqueza, id_status) VALUES
('Besta Clerical', 'Yharnam Central (Grande Ponte)', 4000, 4, 1),
('Paarl, Fera Negra', 'Antiga Yharnam', 4500, 3, 2),
('Ebrietas', 'Altar do Desespero', 12000, 5, 1),
('Mártir Logarius', 'Castelo Cainhurst Abandonado', 25000, 1, 1),
('Orfão de Kos', 'Litoral', 30000, 2, 2);
SELECT * FROM bestiario;
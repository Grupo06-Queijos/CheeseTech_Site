CREATE DATABASE Cheese_Tech;
USE Cheese_Tech;
drop database cheese_tech;

-- Criando as tabelas de acordo com a modelagem

CREATE TABLE Empresa(
CNPJ CHAR(18) PRIMARY KEY,
Nome_Empresa VARCHAR(45) NOT NULL,
Email VARCHAR(45) NOT NULL,
Telefone CHAR(14) NOT NULL,
CEP CHAR(9) NOT NULL,
Camara INT NOT NULL
);

DESC Empresa;

CREATE TABLE Usuario(
idUsuario INT AUTO_INCREMENT,
Nome VARCHAR(45) NOT NULL,
Email VARCHAR(45) NOT NULL,
Senha VARCHAR(45) NOT NULL,
fkCNPJ CHAR(18),
CONSTRAINT fkCNPJ FOREIGN KEY (fkCNPJ) 
	REFERENCES Empresa(CNPJ),
CONSTRAINT pkComposta PRIMARY KEY (idUsuario, fkCNPJ)
);
DESC Usuario;

CREATE TABLE Queijo_Metricas(
idQueijo_metrica INT PRIMARY KEY,
nome_queijo VARCHAR(45) NOT NULL UNIQUE,
temperatura_ideal FLOAT NOT NULL,
umidade_ideal FLOAT NOT NULL,
CONSTRAINT chkNome_Queijo CHECK (nome_queijo IN ('Canastra', 'Mussarela', 'Prato'))
);
DESC Queijo_Metricas;

CREATE TABLE Camara(
IdCamara INT PRIMARY KEY AUTO_INCREMENT,
numeracao_camara INT NOT NULL,
fkEndereco INT,
CONSTRAINT fkEnderecoCamara FOREIGN KEY (fkEndereco)
	REFERENCES Endereco(idEndereco),
fkMetricaQueijo INT,
CONSTRAINT fkMetricaQueijo FOREIGN KEY (fkMetricaQueijo)
	REFERENCES Queijo_Metricas(idQueijo_metrica)        
); 
DESC Camara;

CREATE TABLE Sensores( 
idSensor INT PRIMARY KEY AUTO_INCREMENT,
Tipo_Sensor VARCHAR(10) NOT NULL,
Quadrante INT NOT NULL,
fkCamara INT, 
CONSTRAINT fkCamara FOREIGN KEY (fkCamara)
	REFERENCES Camara(idCamara)
);
DESC Sensores;

CREATE TABLE Registro_Sensor(
idRegistro INT AUTO_INCREMENT,
Umidade FLOAT NOT NULL,
Temperatura FLOAT NOT NULL,
Data_Hora datetime default current_timestamp, 
fkSensor INT,
 CONSTRAINT fkSensor FOREIGN KEY (fkSensor) 
	REFERENCES Sensores(idSensor),
CONSTRAINT pkComposta PRIMARY KEY (idRegistro, fkSensor)
);
DESC Registro_Sensor;

-- Inserindo dados nas tabelas

INSERT INTO Endereco VALUES
(NULL, 'Francisco Machado', 'São Joaquim', 1560 , '3° Andar', 'São Roque de Minas', 'MG', '09345-020'),
(NULL, 'Amaro Gomes', 'Moema', 180 , '4°Andar', 'São Paulo', 'SP', '08263-867'),
(NULL, 'Rua Lima', 'Santa Paula', 230 , '6° Andar', 'Triângulo Mineiro', 'MG', '03478-876');

INSERT INTO Empresa VALUES
('12.345.678/0001-01', 'Cantinho Mineiro', 'cantinhomineiro@gmail.com', '(11)97878-8956', 2),
('12.345.678/0002-02', 'Delicias da Serra', 'deleciasdaserra@gmail.com', '(11)90051-6555', 1),
('12.345.678/0003-03', 'Tradição Canastra', 'tradicaocanastra@gmail.com', '(11)95214-5897', 3);
 
INSERT INTO Usuario VALUES
(NULL, 'Lucas', 'lucas@gmail.com', 'lucas123', '12.345.678/0002-02'),
(NULL, 'Marcos', 'marcos@gmail.com', 'marcos123', '12.345.678/0001-01'),
(NULL, 'João', 'joão@gmail.com', 'joao123', '12.345.678/0003-03');

INSERT INTO Queijo_Metricas VALUES
(1, 'Mussarela', '8', '55'),
(2, 'Prato', '10', '83'),
(3, 'Canastra', '10', '85');

INSERT INTO Camara VALUES
(NULL, 1, 1, 1),
(NULL, 5, 1, 2),
(NULL, 10, 2, 3),
(NULL, 4, 3, 3),
(NULL, 8, 2, 1);

INSERT INTO Sensores VALUES
(NULL, 'DHT11', 5, 1),
(NULL, 'LM35', 7, 5),
(NULL, 'DHT11', 2, 3);

INSERT INTO Registro_Sensor VALUES
(NULL, '50', '22', '2023-04-20 00:00:00', 2),
(NULL, '52', '23', '2023-04-20 01:00:00', 2),
(NULL, '56', '10', '2023-04-20 00:00:00', 1),
(NULL, '54', '11', '2023-04-20 01:00:00', 1);

-- Consultando os dados inseridos

SELECT * FROM Endereco;
SELECT * FROM Empresa;
SELECT * FROM Usuario;
SELECT * FROM Queijo_Metricas;
SELECT * FROM Camara;
SELECT * FROM Sensores;
SELECT * FROM Registro_Sensor;

-- Consultas com JOIN

-- Empresas e seus respectivos usuários
SELECT 
Empresa.CNPJ, 
Empresa.Nome_Empresa AS 'Nome Empresa', 
Empresa.Email, 
Empresa.Telefone, 
Empresa.Email, 
Usuario.idUsuario, 
Usuario.Nome AS 'Nome Usuário',
Usuario.Email, 
Usuario.Senha
 FROM Empresa JOIN Usuario
    ON CNPJ = fkCNPJ;

-- Empresas e seu respectivo endereço
SELECT 
Empresa.CNPJ, 
Empresa.Nome_Empresa AS 'Nome Empresa', 
Empresa.Email, 
Empresa.Telefone, 
Empresa.Email, 
Endereco.Rua,
Endereco.Bairro,
Endereco.Numero,
Endereco.Complemento,
Endereco.Cidade,
Endereco.Estado,
Endereco.CEP
 FROM Empresa JOIN Endereco
    ON  idEndereco= fkEndereco;

-- Camâras e seus respectivos tipos de queijos
SELECT 
Camara.idCamara, 
Camara.numeracao_camara AS 'Número da Câmara', 
Queijo_Metricas.nome_queijo AS 'Nome Queijo', 
Queijo_Metricas.temperatura_ideal AS 'Temperatura Ideal', 
Queijo_Metricas.umidade_ideal AS 'Umidade Ideal'
FROM Camara JOIN Queijo_Metricas
    ON idQueijo_metrica= fkMetricaQueijo;
    
-- Registros e seu respectivo sensor
SELECT 
Sensores.idSensor,
Sensores.Tipo_Sensor AS 'Tipo Sensor',
Sensores.Quadrante,
Registro_Sensor.Umidade,
Registro_Sensor.Temperatura,
Registro_Sensor.Data_Hora
FROM Sensores JOIN Registro_Sensor
    ON idSensor = fkSensor;


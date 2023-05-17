var empresaModel = require("../models/empresaModel");

var sessoes = [];

function testar(req, res) {
    console.log("ENTRAMOS NA empresaController");
    res.json("ESTAMOS FUNCIONANDO!");
}

function listar(req, res) {
    empresaModel.listar()
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum resultado encontrado!")
            }
        }).catch(
            function (erro) {
                console.log(erro);
                console.log("Houve um erro ao realizar a consulta! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var cnpj = req.body.CNPJServer;
    var empresa = req.body.empresaServer;
    var emailemp = req.body.emailempServer;
    var telefone = req.body.telefoneServer;
    var cep = req.body.cepServer;
    var camara = req.body.camaraServer;
    // Faça as validações dos valores
    if (cnpj == undefined) {
        res.status(400).send("Seu cnpj está undefined!");

    } else if (empresa == undefined) {
        res.status(400).send("Seu empresa está undefined!");

    } else if (emailemp == undefined) {
        res.status(400).send("Seu emailemp está undefined!");
    } 
    else if (telefone == undefined) {
        res.status(400).send("Seu telefone está undefined!");
    } 
    else if (cep == undefined) {
        res.status(400).send("Seu cep está undefined!");
    } 
      else if (camara == undefined) {
        res.status(400).send("Sua camara está undefined!");
    } else {
        
        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        empresaModel.cadastrar(cnpj, empresa, emailemp, telefone, cep, camara)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

module.exports = {
    //entrar,
    cadastrar,
    listar,
    testar
}
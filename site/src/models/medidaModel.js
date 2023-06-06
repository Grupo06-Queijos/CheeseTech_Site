var database = require("../database/config");

function buscarUltimasMedidas(idAquario, limite_linhas) {

    instrucaoSql = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `select top ${limite_linhas}
        Temperatura as temperatura, 
        Umidade as umidade,  
                        Data_Hora, 
                        FORMAT(Data_Hora, 'HH:mm:ss') as momento_grafico
                    from Registro_Sensor
                    where fkSensor = ${idAquario}
                    order by idRegistro desc`;

        /*TENTAR ISSO TBM
/*SELECT Temperatura as temperatura, 
Umidade as umidade,  
Data_Hora, 
DATE_FORMAT(Data_Hora, '%H:%i:%s') as momento_grafico
FROM Registro_Sensor
WHERE fkSensor = ${idAquario}
ORDER BY idRegistro DESC
LIMIT ${limite_linhas} */
    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        const limite_linhas = 7
        const idAquario = 1
        instrucaoSql = `select 
        Temperatura as temperatura, 
        Umidade as umidade,
                        Data_Hora,
                        DATE_FORMAT(Data_Hora,'%H:%i:%s') as momento_grafico
                    from  Registro_Sensor
                    where fkSensor = ${idAquario}
                    order by idRegistro desc limit ${limite_linhas}`;

        //esse select nao executa no sql
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarMedidasEmTempoReal(idAquario) {

    instrucaoSql = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        // top 1? ta certo isso? mudar para select sem "top 1"
        //tentar fazer esse select funcionar , talvez o problema esteja nele
        instrucaoSql = `SELECT TOP 1
        Temperatura,
        Umidade,
        CONVERT(varchar, Data_Hora, 108) AS momento_grafico,  
        fkSensor
        FROM Registro_Sensor
        WHERE fkSensor = ${idAquario}
        ORDER BY idRegistro DESC;`;

        //Unico que funciona no sql
        /* SELECT Temperatura, Umidade, 
        DATE_FORMAT(Data_Hora, '%H:%i:%s') AS momento_grafico, fkSensor
        FROM Registro_Sensor
        WHERE fkSensor = 1
        ORDER BY idRegistro DESC
        LIMIT 1;*/

        /* select antigo: 
        `select top 1
         dht11_temperatura as temperatura, 
        dht11_umidade as umidade,  
                        CONVERT(varchar, momento, 108) as momento_grafico, 
                        fk_aquario 
                        from medida where fk_aquario = ${idAquario} 
                    order by id desc` */

    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `select 
        Temperatura as temperatura, 
        Umidade as umidade,
                        DATE_FORMAT(Data_Hora,'%H:%i:%s') as momento_grafico, 
                     fkSensor 
             from Registro_Sensor where fkSensor = 1 
                   order by idRegistro desc limit 1`;
        // 1 no lugar do idaquario  e limite 7 buscarmedidasemtemporeal




    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}
// função criada pelo davi copiando a função buscarUltimasMedidas
function calcularMedidas() {

    instrucaoSql = `select 
    avg(Temperatura) as 'medTemp', 
    avg(Umidade) as 'medUmi',
    max(Temperatura) as 'maiorTemp',
    min(Temperatura) as 'menorTemp',
    max(Umidade) as 'maiorUmi',
    min(Umidade) as'menorUmi'
                from Registro_Sensor
                 WHERE fkSensor = 1
        ORDER BY idRegistro DESC
        LIMIT 7 `;


    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

/*  SELECT 
 ROUND(AVG(Temperatura), 2) AS 'mediaTemperatura', 
 ROUND(AVG(Umidade), 2) AS 'mediaUmidade',
 MAX(Temperatura) AS 'maiorTemperatura',
 MIN(Temperatura) AS 'menorTemperatura',
 MAX(Umidade) AS 'maiorUmidade',
 MIN(Umidade) AS 'menorUmidade'
 FROM 
 Registro_Sensor
 WHERE 
 fkSensor = 1
 ORDER BY 
 idRegistro DESC
LIMIT 7; */

/* 
select 
        avg(Temperatura) as 'medTemp', 
        avg(Umidade) as 'medUmi',
        max(Temperatura) as 'maiorTemp',
        min(Temperatura) as 'menorTemp',
        max(Umidade) as 'maiorUmi',
        min(Umidade) as'menorUmi'
                    from Registro_Sensor
                     WHERE fkSensor = 1
            ORDER BY idRegistro DESC
            LIMIT 7 */




module.exports = {
    buscarUltimasMedidas,
    buscarMedidasEmTempoReal,
    calcularMedidas
}


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
    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `select 
        Temperatura as temperatura, 
        Umidade as umidade,
                        Data_Hora,
                        DATE_FORMAT(Data_Hora,'%H:%i:%s') as momento_grafico
                    from  Registro_Sensor
                    where fkSensor = ${idAquario}
                    order by idRegistro desc limit ${limite_linhas}`;
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
        instrucaoSql = `select top 1
        Temperatura as temperatura, 
        Umidade as umidade,  
                        CONVERT(varchar, momento, 108) as momento_grafico, 
                        fk_aquario 
                        from Registro_Sensor where fkSensor = ${idAquario} 
                    order by idRegistro desc`;

    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `SELECT * FROM Queijo_Metricas where idQueijo_metrica = ${idAquario}`;
            
        // `select 
        // dht11_temperatura as temperatura, 
        // dht11_umidade as umidade,
        //                 DATE_FORMAT(momento,'%H:%i:%s') as momento_grafico, 
        //                 fk_aquario 
        //                 from medida where fk_aquario = ${idAquario} 
        //             order by id desc limit 1`;

        
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


module.exports = {
    buscarUltimasMedidas,
    buscarMedidasEmTempoReal
}

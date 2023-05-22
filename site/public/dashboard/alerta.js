var alertas = [];

function obterdados(idAquario) {
    fetch(`/medidas/tempo-real/${idAquario}`)
        .then(resposta => {

            if (resposta.ok) {
                resposta.json().then(resposta => {

                    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

                    alertar(resposta, idAquario);
                });
            } else {

                console.error('Nenhum dado encontrado ou erro na API');
            }
        })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados do aquario p/ gráfico: ${error.message}`);
        });

}

function alertar(resposta, idAquario) {
    var temp = resposta[0].temperatura_ideal;

    console.log(idAquario === resposta[0].fk_aquario)
    
    var grauDeAviso ='';


    var limites = {
        Critico: 10,
        emergencia: 9,
        ideal: 7,
        emergencia: 6,
        critico: 4
    };

    var classe_temperatura = 'cor-alerta';

    if (temp >= limites.Critico) {
        classe_temperatura = 'cor-alerta perigo-emergencia';
        grauDeAviso = 'perigo emergencia'
        grauDeAvisoCor = 'cor-alerta perigo-emergencia'
        exibirAlerta(temp, idAquario, grauDeAviso, grauDeAvisoCor)
    }
    else if (temp < limites.Critico && temp >= limites.emergencia) {
        classe_temperatura = 'cor-alerta alerta-emergencia';
        grauDeAviso = 'alerta emergencia'
        grauDeAvisoCor = 'cor-alerta alerta-emergencia'
        exibirAlerta(temp, idAquario, grauDeAviso, grauDeAvisoCor)
    }
    else if (temp < limites.emergencia && temp > limites.emergencia) {
        classe_temperatura = 'cor-alerta ideal';
        removerAlerta(idAquario);
    }
    else if (temp <= limites.emergencia && temp > limites.critico) {
        classe_temperatura = 'cor-alerta alerta-emergencia';
        grauDeAviso = 'alerta emergencia'
        grauDeAvisoCor = 'cor-alerta alerta-emergencia'
        exibirAlerta(temp, idAquario, grauDeAviso, grauDeAvisoCor)
    }
    else if (temp <= limites.critico) {
        classe_temperatura = 'cor-alerta perigo-emergencia';
        grauDeAviso = 'perigo emergencia'
        grauDeAvisoCor = 'cor-alerta perigo-emergencia'
        exibirAlerta(temp, idAquario, grauDeAviso, grauDeAvisoCor)
    }

    // var card;

    // if (idAquario == 1) {
    //     temp_aquario_1.innerHTML = temp + "°C";
    //     card = card_1
    // } else if (idAquario == 2) {
    //     temp_aquario_2.innerHTML = temp + "°C";
    //     card = card_2
    // } else if (idAquario == 3) {
    //     temp_aquario_3.innerHTML = temp + "°C";
    //     card = card_3
    // } else if (idAquario == 4) {
    //     temp_aquario_4.innerHTML = temp + "°C";
    //     card = card_4
    // }

    // card.className = classe_temperatura;
}

function exibirAlerta(temp, idAquario, grauDeAviso, grauDeAvisoCor) {
    var indice = alertas.findIndex(item => item.idAquario == idAquario);

    if (indice >= 0) {
        alertas[indice] = { idAquario, temp, grauDeAviso, grauDeAvisoCor }
    } else {
        alertas.push({ idAquario, temp, grauDeAviso, grauDeAvisoCor });
    }

    exibirCards();
    
// Dentro da div com classe grauDeAvisoCor há um caractere "invisível", 
// que pode ser inserido clicando com o seu teclado em alt+255 ou pelo código adicionado acima.
}

function removerAlerta(idAquario) {
    alertas = alertas.filter(item => item.idAquario != idAquario);
    exibirCards();
}
 
function exibirCards() {
    alerta.innerHTML = '';

    for (var i = 0; i < alertas.length; i++) {
        var mensagem = alertas[i];
        alerta.innerHTML += transformarEmDiv(mensagem);
    }
}

function transformarEmDiv({ idAquario, temp, grauDeAviso, grauDeAvisoCor }) {
    return `<div class="mensagem-alarme">
    <div class="informacao">
    <div class="${grauDeAvisoCor}">&#12644;</div> 
     <h3>A câmara ${idAquario} está em estado de ${grauDeAviso}!</h3>
    <small>Temperatura ${temp}.</small>   
    </div>
    <div class="alarme-sino"></div>
    </div>`;
}
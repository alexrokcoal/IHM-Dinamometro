/**
 * Classe responsável por gerenciar a conexão com o hardware do dinamômetro por connection.
 * @param {Object} configs - Objeto literal com as configurações de criação do objeto.
 * @constructor
 * @author Alex Silva <alexro.kcoal@gmail.com>
 */
function Connection(configs) {

    // Endereço de ip do connection server do dinamômetro.
    let serverIp = "";

    // Conexão connection.
    let ws = null;

    // Eventos que são disparados durante a conexão.
    let onInit = configs.events.onInit || null,
        onConnect = configs.events.onConnect || null,
        onLost = configs.events.onLost || null,
        onReceiveData = configs.events.onReceiveData || null;

    // Flag utilizada para verificar se está ocorrendo recepção de dados.
    let dataReceived = false;

    // Flag utilizada para seber se está conectado.
    let isConnected = false;

    // Tempo de espera para verificar se está ocorrendo recepção de dados.
    let connectionCheckTime = 3000;

    /**
     * Responsável por checar a conexão de tempo em tempo se está chegando dados.
     * Se não estiver chegando dados a conexão é refeita automaticamente.
     */
    let connectionCheckHandler = function () {
        // Limpa a flag.
        dataReceived = false;

        // Espera o tempo definido para verificar se dados foram recebidos.
        setTimeout(function () {
            // Dados foram recebidos.
            if(isConnected && dataReceived) {
                // Se prepara para fazer a próxima verificação.
                connectionCheckHandler();
                // Dados não foram recebidos.
            } else {
                // Dispara o evento de perda de conexão.
                if (onLost) onLost();
                // Reconecta.
                this.reconnect();
            }
        }.bind(this), connectionCheckTime);
    }.bind(this);

    /**
     * Inicializa a conexão.
     */
    this.init = function () {
        // Dispara o evento para inicializar a conexão.
        if(onInit) onInit();
    };

    /**
     * Conecta com o dinamômetro.
     */
    this.connect = function () {
        // Limpa as flags de conexão e dados recebidos.
        isConnected = false;
        dataReceived = false;

        // Cria a conexão connection.
        ws = new WebSocket("ws://"+serverIp);

        // Define o tipo de transferência de dados.
        ws.binaryType = 'arraybuffer';

        // Evento disparado quando a conexão é aberta.
        ws.onopen = function () {
            // Ativa a flag de status de conexão.
            isConnected = true;
            // Dispara o evento de conexão.
            if (onConnect) onConnect();
        };

        // Evento disparado quando a conexão é fechada.
        ws.onclose = function () {
            //console.log("Conexão fechada!");
        };

        // Evento disparado quando ocorre erro de conexão.
        ws.onerror = function (evt) {
            //console.log("Erro na conexão!");
        };

        // Evento disparado quando dados são recebidos do servidor connection.
        ws.onmessage = function (event) {
            // Ativa a flag de dados recebidos.
            dataReceived = true;
            // Dispara o evento de dados recebidos.
            if (onReceiveData) onReceiveData(event.data);
        }.bind(this);

        // Chama a função para ficar checando a conexão e avisar caso ocorra perca de conexão.
        connectionCheckHandler();
    };

    /**
     * Reconecta com o dinamômetro.
     */
    this.reconnect = function () {
        // Fecha a conexão.
        this.close();
        // Aguarda um tempo para conectar novamente.
        setTimeout(function () {
            // Conecta novamente.
            this.connect();
        }.bind(this), 1000);
    };

    /**
     * Fecha a conexão com o dinamômetro.
     */
    this.close = function () {
        // Se a conexão estiver aberta.
        if (ws) {
            // Fecha a conexão.
            ws.close();
        }
    };

    /**
     * Envia dados para o dinamômetro.
     * @param {ArrayBufferLike} data - Dados a serem enviados.
     */
    this.send = function (data) {
        ws.send(data);
    };

    /**
     * Altera o ip.
     * @param ip - Ip do servidor connection.
     */
    this.setServerIp = function (ip) {
        serverIp = ip;
    };

    /**
     * Devolve a ip do dinamômetro que está conectado.
     * @returns {string} serverIp - Ip do servidor connection.
     */
    this.getServerIp = function () {
        return serverIp;
    }
}

/**
 * Módulo de conexão do dinamômetro.
 * @type {Connection}
 */
Dinamometro.prototype.connection = new Connection({
    // Eventos que são disparados durante a execução da classe.
    events: {

        // Evento disparado para inicializar.
        onInit: function () {
            DINAMOMETRO.dashboard.userInterface.feedbackConnection.onInit();
            if(!DINAMOMETRO.storage.has(DINAMOMETRO.storage.webSocketServerIp)){
                while (!DINAMOMETRO.storage.set(DINAMOMETRO.storage.webSocketServerIp, prompt("Informe o ip do servidor connection: ", "192.168.4.1"))) {
                    alert("Informe um endereço de ip válido!");
                }
            }
            DINAMOMETRO.connection.setServerIp(DINAMOMETRO.storage.get(DINAMOMETRO.storage.webSocketServerIp));
        },

        // Evento disparado sempre que conectar com o dinamômetro.
        onConnect: function () {
            DINAMOMETRO.dashboard.userInterface.feedbackConnection.onConnect();
            if(DINAMOMETRO.status.is(DINAMOMETRO.status.LOST)) DINAMOMETRO.startRealtime();
        },

        // Evento disparado sempre que perder conexão com o dinamômetro.
        onLost: function () {
            DINAMOMETRO.dashboard.userInterface.feedbackConnection.onLost();
            if(DINAMOMETRO.status.is(DINAMOMETRO.status.RUNNING)) DINAMOMETRO.status.set(DINAMOMETRO.status.LOST);
        },

        // Evento disparado sempre que receber dados do dinamômetro.
        onReceiveData: function(data) {
            if(DINAMOMETRO.status.is(DINAMOMETRO.status.RUNNING)) {
                let dataUint16Array = new Uint16Array(data);
                DINAMOMETRO.addDataFrame([((dataUint16Array[0]) | (dataUint16Array[1]<<16))/1000, dataUint16Array[2]/100, dataUint16Array[3]/1000, dataUint16Array[4]/1000, dataUint16Array[5]/1000, dataUint16Array[6]/1000]);
            }
        }
    }
});

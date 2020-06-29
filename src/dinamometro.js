/**
 * Classe principal, compõe toda a aplicação do dinamômetro IHM
 * @constructor
 * @author Alex Silva <alexro.kcoal@gmail.com>
 */
function Dinamometro() {

    // Limite máximo do tamanho do buffer de dados recebidos.
    let dataFrameBufferMaxSize = 200;

    // Buffer que armazena os frames de dados recebidos em um vetor.
    let dataFrameBuffer = [];

    /**
     * Inicializa a aplicação.
     */
    this.init = function () {

        // Inicializa componentes gráficos.
        this.graphics.init();

        // Inicializa a conexão.
        this.connection.init();

        // Conecta com o servidor.
        this.connection.connect();

        // Altera o modo do dashboard para análise.
        this.dashboard.mode.set(this.dashboard.mode.ANALYSE);

        // Ativa o evento de click no botão.
        this.dashboard.userInterface.btnControl.addEventListener();
    };

    /**
     * Inicia a execução de tempo real.
     */
    this.startRealtime = function () {
        // Se o tempo real não estiver sendo executado.
        if (!DINAMOMETRO.status.is(DINAMOMETRO.status.RUNNING)) {

            // Altera o status de tempo real para running.
            DINAMOMETRO.status.set(DINAMOMETRO.status.RUNNING);

            // Limpa o buffer de frame de dados.
            dataFrameBuffer = [];

            // Reseta o zoom do chart de análize.
            DINAMOMETRO.graphics.charts.analyze.resetZoom();

            // Pega o contexto atual do dinamômetro e atribui a that.
            let that = this;

            // Loop para desenhar os dados atualizados.
            function loop() {
                // Se houver dados no buffer de frame de dados.
                if (dataFrameBuffer.length > 0) {
                    // Desenha os dados atualizados.
                    that.graphics.draw();
                }

                // Se o status de execução de tempo real for running chama a função para desenhar novamente.
                if (that.status.is(that.status.RUNNING)) requestAnimationFrame(loop);
            }

            // Inicia a execução do loop de desenho de tempo real.
            loop();
        }
    };

    /**
     * Para a execução de tempo real.
     */
    this.stopRealtime = function () {
        // Altera o status de tempo real para stopped.
        DINAMOMETRO.status.set(DINAMOMETRO.status.STOPPED);
    };

    /**
     * Altera o tamanho máximo do buffer de frame de dados.
     * @param {Number} paramDataFrameBufferMaxSize - Tamanho máximo do buffer de frame de dados.
     */
    this.setDataFrameBufferMaxSize = function (paramDataFrameBufferMaxSize) {
        // Se o valor informado for menor do que o tamanho máximo do buffer de frame de dados atual.
        if (paramDataFrameBufferMaxSize < dataFrameBufferMaxSize){
            // Corta o buffer de frame de dados para ficar do tamanho máximo informado.
            dataFrameBuffer = dataFrameBuffer.slice(dataFrameBuffer.length-paramDataFrameBufferMaxSize);
        }
        // Altera o tamanho máximo do buffer de frame de dados.
        dataFrameBufferMaxSize = paramDataFrameBufferMaxSize;
    };

    /**
     * Devolve o buffer de frame de dados por completo.
     * @returns {[]} - Buffer de frame de dados.
     */
    this.getDataFrameBuffer = function () {
        return dataFrameBuffer;
    };

    /**
     * Devolve o comprimento do buffer de frame de dados.
     * @returns {number} - Comprimento do buffer de frame de dados.
     */
    this.getDataFrameBufferLength = function () {
        return dataFrameBuffer.length;
    };

    /**
     * Insere o frame de dados no final do buffer.
     * @param {Number[]} paramDataFrame - Frame de dados.
     */
    this.addDataFrame = function (paramDataFrame) {
        // Adiciona o frame de dados no buffer.
        dataFrameBuffer.push(paramDataFrame);
        // Se o buffer ultrapassou o tamanho máximo estabelecido remove o primeiro frame de dados do buffer.
        if (dataFrameBuffer.length > dataFrameBufferMaxSize) dataFrameBuffer.shift();
    };

    /**
     * Devolve o frame de dados relacionado ao índice informado.
     * @param {Number} paramIndex - Índice solicitado.
     * @returns {Number[]} - Frame de dados solicitado.
     */
    this.getDataFrame = function (paramIndex) {
        return dataFrameBuffer[paramIndex];
    };

    /**
     * Devolve o último frame de dados adicionado ao buffer.
     * @returns {Number[]} - Último frame de dados do buffer.
     */
    this.getLastDataFrame = function () {
        return dataFrameBuffer[dataFrameBuffer.length-1];
    };

    /**
     *
     * @param {Number} frameRate - Taxa de frames por segundo.
     */
    this.changeFrameRate = function (frameRate) {
        // Cria um vetor de uint8.
        let uintArrayFrameRate = new Uint8Array(1);

        // Se o frame rate informado for entre 4 e 60.
        if(frameRate>=4 && frameRate<=60) {
            // Converte o frame rate em milisegundos.
            uintArrayFrameRate[0] = Math.round(1000/frameRate);
            // Envia para o servidor.
            this.connection.send(uintArrayFrameRate.buffer);
        }
    };

    /**
     * Altera o ip do servidor.
     */
    this.changeServerIp = function () {
        // Pega o ip atual caso exista.
        let currentIp = DINAMOMETRO.storage.get(DINAMOMETRO.storage.webSocketServerIp);

        // Enquanto o ip do servidor for inválido solicita que seja informado o ip novamente.
        while (!DINAMOMETRO.storage.set(DINAMOMETRO.storage.webSocketServerIp, prompt("Informe o ip do servidor connection: ", currentIp ? currentIp : "192.168.4.1"))) {
            alert("Informe um endereço de ip válido!");
        }

        // Recarrega a página com o novo ip.
        location.reload();
    };

}




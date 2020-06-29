/**
 * Classe responsável por gerenciar o status de execução do dinamômetro.
 * @param {Object} configs - Objeto literal com as configurações de criação do objeto.
 * @constructor
 * @author Alex Silva <alexro.kcoal@gmail.com>
 */
function DinamometroStatus(configs) {

    // Constantes do status de execução do dinamômetro.
    this.STOPPED = 0;
    this.RUNNING = 1;
    this.LOST = 2;

    // Flag do Status.
    let currentStatus = this.LOST;

    // Eventos que são disparados quando o status é alterado.
    let beforeChange = configs.events.beforeChange || function () {},
        onStopped = configs.events.onStopped || function () {},
        onRunning = configs.events.onRunning || function () {},
        onLost = configs.events.onLost || function () {};

    /**
     * Responsável por executar os eventos quando o status é alterado.
     */
    let onChange = function () {
        // Dispara o evento que deve ser executado antes de alterar o status caso o evento tenha sido definido.
        if(beforeChange) beforeChange();

        // Dispara o evento de acordo com o status alterado.
        switch(currentStatus) {
            // Se o status foi alterado para stopped.
            case this.STOPPED: onStopped(); break;
            // Se o status foi alterado para running.
            case this.RUNNING: onRunning(); break;
            // Se o status foi alterado para lost.
            case this.LOST: onLost(); break;
        }
    }.bind(this);

    /**
     * Altera o status do dinamômetro.
     * @param {Number} status - Número da constante do status.
     */
    this.set = function (status) {
        // Define o status.
        currentStatus = status;
        // Dispara o evento de status alterado.
        onChange();
    };

    /**
     * Devolve o status atual.
     * @returns {number}
     */
    this.get = function () {
        return currentStatus;
    };

    /**
     * Checa se o status informado é o mesmo do status atual.
     * @param {Number} status - Constante do status.
     * @returns {boolean}
     */
    this.is = function (status) {
        return currentStatus===status;
    };
}

/**
 * Módulo de status do dinamômetro.
 * @type {DinamometroStatus}
 */
Dinamometro.prototype.status = new DinamometroStatus({

    // Eventos que são disparados durante a execução da classe.
    events: {

        // Disparado sempre antes de alterar o status.
        beforeChange: function () {

        },

        // Disparado ao mudar o status para stopped.
        onStopped: function () {
            // Mostra o range selector do char analyse.
            DINAMOMETRO.graphics.charts.analyze.showRangeSelector();
            // Faz alterações na interface do usuário.
            DINAMOMETRO.dashboard.userInterface.btnControl.onStopped();
        },

        // Disparado ao mudar o status para running.
        onRunning: function () {
            // Esconde o range selector do char analyse.
            DINAMOMETRO.graphics.charts.analyze.hideRangeSelector();
            // Faz alterações na interface do usuário.
            DINAMOMETRO.dashboard.userInterface.btnControl.onRunning();
        },

        // Disparado ao mudar o status para lost.
        onLost: function () {
            // Faz alterações na interface do usuário.
            DINAMOMETRO.dashboard.userInterface.btnControl.onLost();
        }
    }
});
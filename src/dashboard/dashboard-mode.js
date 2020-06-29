/**
 * Classe responsável por gerenciar o modo de visualização do dashboard do dinamômetro.
 * @param {Object} configs - Objeto literal com as configurações de criação do objeto.
 * @constructor
 * @author Alex Silva <alexro.kcoal@gmail.com>
 */
function DashboardMode(configs) {

    // Constantes de visualização do dashboard.
    this.PRESENTATION = 0;
    this.ANALYSE = 1;
    this.CONFIGURATION = 2;
    this.ADVANCED = 3;

    // Flag do modo do dashboard
    let currentMode = this.ANALYSE;

    // Eventos que são disparados quando o modo de visualização é alterado.
    let beforeChange = configs.events.beforeChange || function () {},
        onPresentation = configs.events.onPresentation || function () {},
        onAnalyse = configs.events.onAnalyse || function () {},
        onConfiguration = configs.events.onConfiguration || function () {},
        onAdvanced = configs.events.onAdvanced || function () {};

    /**
     * Responsável por executar os eventos quando o modo de visualização é alterado.
     */
    let onChange = function () {
        // Dispara o evento que deve ser executado antes de alterar o modo caso o evento tenha sido definido.
        if(beforeChange) beforeChange();

        // Dispara o evento de acordo com o modo alterado.
        switch(currentMode) {
            // Se o status foi alterado para presentation.
            case this.PRESENTATION: onPresentation(); break;
            // Se o status foi alterado para analyse.
            case this.ANALYSE: onAnalyse(); break;
            // Se o status foi alterado para configuration.
            case this.CONFIGURATION: onConfiguration(); break;
            // Se o status foi alterado para advanced.
            case this.ADVANCED: onAdvanced(); break;
        }
    }.bind(this);

    /**
     * Altera o modo do dashboard.
     * @param {Number} mode - Número da constante do modo do dashboard.
     */
    this.set = function (mode) {
        currentMode = mode;
        onChange();
    };

    /**
     * Devolve o modo de dashboard atual.
     * @returns {number}
     */
    this.get = function () {
        return currentMode;
    };

    /**
     * Checa se o modo de do dashboard informado é o mesmo do status atual.
     * @param {Number} mode - Número da constante do modo do dashboard.
     * @returns {boolean}
     */
    this.is = function (mode) {
        return currentMode===mode;
    };
}

/**
 * Módulo do modo do dashboard.
 * @type {DashboardMode}
 */
Dashboard.prototype.mode = new DashboardMode({
    // Eventos que são disparados durante a execução da classe.
    events: {

        // Disparado sempre antes de alterar o modo.
        beforeChange: function () {
            DINAMOMETRO.dashboard.userInterface.dashboardMode.beforeChange();
            DINAMOMETRO.graphics.gauges.rpm.update({width: 180, height: 180});
            DINAMOMETRO.graphics.gauges.torque.update({width: 140, height: 140});
            DINAMOMETRO.graphics.gauges.avancoReal.update({width: 140, height: 140});
        },

        // Disparado ao mudar o modo para presentation.
        onPresentation: function () {
            DINAMOMETRO.dashboard.userInterface.dashboardMode.onPresentation();
            DINAMOMETRO.graphics.gauges.rpm.update({width: 450, height: 450});
            DINAMOMETRO.graphics.gauges.torque.update({width: 200, height: 200});
            DINAMOMETRO.graphics.gauges.avancoReal.update({width: 200, height: 200});
        },

        // Disparado ao mudar o modo para analyse.
        onAnalyse: function () {
            DINAMOMETRO.dashboard.userInterface.dashboardMode.onAnalyse();
            DINAMOMETRO.graphics.charts.analyze.resize();
        },

        // Disparado ao mudar o modo para configuration.
        onConfiguration: function () {
            DINAMOMETRO.dashboard.userInterface.dashboardMode.onConfiguration();
            DINAMOMETRO.graphics.charts.configuration.getChart().resize();
        },

        // Disparado ao mudar o modo para advanced.
        onAdvanced: function () {
            DINAMOMETRO.dashboard.userInterface.dashboardMode.onAdvanced();
            DINAMOMETRO.graphics.charts.configuration.getChart().resize();
            DINAMOMETRO.graphics.charts.analyze.resize();
        }
    }
});
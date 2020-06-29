/**
 * Classe responsável por gerenciar e manipular a interface do usuário.
 * @constructor
 * @author Alex Silva <alexro.kcoal@gmail.com>
 */
function UserInterface () {

}

/**
 * Manipula a interface do usuário de acordo com o status de conexão.
 * @type {Object}
 */
UserInterface.prototype.feedbackConnection = {
    // Definição do elemento de acesso ao botão no dom.
    feedbackConnectionElement: document.getElementById('feedback-connection'),

    // Remove todas as classes do elemento.
    removeClasses: function () {
        this.feedbackConnectionElement.classList.forEach(function (value) {
            this.feedbackConnectionElement.classList.remove(value);
        }.bind(this));
    },

    // Ao iniciar a conexão.
    onInit: function () {
        this.removeClasses();
        this.feedbackConnectionElement.classList.add("feedback-connection-alert");
        this.feedbackConnectionElement.innerHTML = "Ainda não conectado!";
    },

    // Ao conectar.
    onConnect: function () {
        this.removeClasses();
        this.feedbackConnectionElement.classList.add("feedback-connection-success");
        this.feedbackConnectionElement.innerHTML = "Conectado com: " + DINAMOMETRO.connection.getServerIp();
    },

    // Ao perder conexão.
    onLost: function () {
        this.removeClasses();
        this.feedbackConnectionElement.classList.add("feedback-connection-error");
        this.feedbackConnectionElement.innerHTML = "Conexão perdida com: " + DINAMOMETRO.connection.getServerIp();
    }
};

/**
 * Manipula a interface do usuário de acordo com o status de execução do real time.
 * @type {Object}
 */
UserInterface.prototype.btnControl = {
    // Definição do elemento de acesso ao botão no dom.
    btnControlElement: document.getElementById("btn-control"),

    // Disparado ao mudar o status para stopped.
    onStopped: function () {
        this.btnControlElement.innerHTML = "&#9658;";
        this.btnControlElement.title = "Start";
    },

    // Disparado ao mudar o status para running.
    onRunning: function () {
        this.btnControlElement.innerHTML = "&#9724;";
        this.btnControlElement.title = "Stop";
    },

    // Disparado ao mudar o status para lost.
    onLost: function () {
        this.btnControlElement.innerHTML = "&#9658;";
        this.btnControlElement.title = "Start";
    },

    // Adiciona o evento de click no botão.
    addEventListener: function () {
        this.btnControlElement.addEventListener("click", function () {
            if(DINAMOMETRO.status.is(DINAMOMETRO.status.RUNNING)) {
                DINAMOMETRO.stopRealtime();
            } else if(DINAMOMETRO.status.is(DINAMOMETRO.status.STOPPED)) {
                DINAMOMETRO.startRealtime();
            }
        });
    }
};

/**
 * Manipula a interface do usuário de acordo com o modo do deshboard.
 * @type {Object}
 */
UserInterface.prototype.dashboardMode = {

    // Definição dos elementos de acesso ao dom.
    gaugesContainerElement: document.getElementById('gauges-container'),
    chartAnalyseContainerElement: document.getElementById('chart-analyze-container'),
    chartConfigurationContainerElement: document.getElementById('chart-configuration-container'),
    analyseDygraphElement: document.getElementById('analyze-dygraph'),
    configurationDygraphElement: document.getElementById('configuration-dygraph'),

    // Disparado sempre antes de alterar o modo.
    beforeChange: function () {
        this.gaugesContainerElement.classList.forEach(function (value) {
            this.gaugesContainerElement.classList.remove(value);
        }.bind(this));
        this.chartAnalyseContainerElement.classList.forEach(function (value) {
            this.chartAnalyseContainerElement.classList.remove(value);
        }.bind(this));
        this.chartConfigurationContainerElement.classList.forEach(function (value) {
            this.chartConfigurationContainerElement.classList.remove(value);
        }.bind(this));
    },

    // Disparado ao mudar o modo para presentation.
    onPresentation: function () {
        this.gaugesContainerElement.classList.add("presentation");
        this.chartAnalyseContainerElement.classList.add("hidden");
        this.chartConfigurationContainerElement.classList.add("hidden");
    },

    // Disparado ao mudar o modo para analyse.
    onAnalyse: function () {
        this.gaugesContainerElement.classList.add("analyze");
        this.chartAnalyseContainerElement.classList.add("analyze");
        this.chartConfigurationContainerElement.classList.add("hidden");
        this.analyseDygraphElement.style.height = "275px";
    },

    // Disparado ao mudar o modo para configuration.
    onConfiguration: function () {
        this.gaugesContainerElement.classList.add("configuration");
        this.chartAnalyseContainerElement.classList.add("hidden");
        this.chartConfigurationContainerElement.classList.add("configuration");
        this.configurationDygraphElement.style.height = "300px";
    },

    // Disparado ao mudar o modo para advanced.
    onAdvanced: function () {
        this.gaugesContainerElement.classList.add("advanced");
        this.chartAnalyseContainerElement.classList.add("advanced");
        this.chartConfigurationContainerElement.classList.add("advanced");
        this.analyseDygraphElement.style.height = "175px";
        this.configurationDygraphElement.style.height = "120px";
    }
};

/**
 * Módulo de interface do usuário.
 * @type {UserInterface}
 */
Dashboard.prototype.userInterface = new UserInterface();
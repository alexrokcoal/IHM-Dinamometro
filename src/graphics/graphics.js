/**
 * Classe responsável por gerenciar os componentes gráficos.
 * @constructor
 * @author Alex Silva <alexro.kcoal@gmail.com>
 */
function Graphics () {

    /**
     * Inicializa os componentes gráficos.
     */
    this.init = function () {
        // Inicializa os gauges.
        this.gauges.init();

        // inicializa os charts.
        //this.charts.init();
    };

    /**
     * Responsável por desenhar tudo de acordo com os dados atualizados.
     */
    this.draw = function () {
        // Se o dashboard estiver em modo análise ou avançado.
        if (DINAMOMETRO.dashboard.mode.is(DINAMOMETRO.dashboard.mode.ANALYSE) || DINAMOMETRO.dashboard.mode.is(DINAMOMETRO.dashboard.mode.ADVANCED)) {
            // Desenha o chart de análise com os dados atualizados.
            this.charts.analyze.draw(DINAMOMETRO.getDataFrameBuffer());
        }
        // Desenha gauges com os dados atualizados.
        this.gauges.draw(DINAMOMETRO.getLastDataFrame());

    };
}

/**
 * Módulo de componentes gráficos.
 * @type {Graphics}
 */
Dinamometro.prototype.graphics = new Graphics();
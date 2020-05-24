(function () { // Início do encapsulamento dos chats

    function ConstrutorCharts() {

        // Definição dos charts
        this.analyze;
        this.advancedConfiguration;

    }

    ConstrutorCharts.prototype.init = function () {

        var commonConfigs = {
            legend: "follow",
            valueRange: null,
            drawPoints: true,
            fillGraph: true,
            fillAlpha: .2,
            strokeWidth: 1,
            titleHeight: 30,
            labelsSeparateLines: true,
            highlightSeriesBackgroundAlpha: 1,
            highlightSeriesOpts: {
                strokeWidth: 1,
                highlightCircleSize: 4
            }
        };

        var interactionModelConfigs = {
            interactionModel : {
                'mousedown' : function (event, g, context) {
                    context.initializeMouseDown(event, g, context);
                    if (event.altKey || event.shiftKey) {
                        Dygraph.startZoom(event, g, context);
                    } else {
                        Dygraph.startPan(event, g, context);
                    }
                },
                'mousemove' : function (event, g, context) {
                    if (context.isPanning) {
                        Dygraph.movePan(event, g, context);
                    } else if (context.isZooming) {
                        Dygraph.moveZoom(event, g, context);
                    }
                },
                'mouseup' : function (event, g, context) {
                    if (context.isPanning) {
                        Dygraph.endPan(event, g, context);
                    } else if (context.isZooming) {
                        Dygraph.endZoom(event, g, context);
                    }
                },
                'click' : function (event, g, context) {
                    lastClickedGraph = g;
                    event.preventDefault();
                    event.stopPropagation();
                },
                'dblclick' : function (event, g, context) {
                    g.updateOptions({
                        dateWindow: null,
                        valueRange: null
                    });
                },
                'mousewheel' : null
            }
        };

        var rangeSelectorConfigs = {
            showRangeSelector: true,
            rangeSelectorPlotFillColor: "#002",
            rangeSelectorPlotFillGradientColor: "",
            rangeSelectorPlotLineWidth: 1,
            rangeSelectorPlotStrokeColor: "#002",
            rangeSelectorAlpha: 0.1,
            rangeSelectorHeight: 20
        };

        var analyseConfigs = Object.assign({}, interactionModelConfigs, commonConfigs, rangeSelectorConfigs,
            {
                title: null,
                ylabel: null,
                xlabel: null,
                labels: ['Tempo', 'RPM', 'Lambda', 'Torque', 'Bateria', 'Avanço'],
                colors: ["blue", "green", "yellow", "red", "orange"],
                axes : {
                    y : {
                        valueFormatter: function(y, opts, series_name) {
                            //alert(y+series_name);
                            if (series_name == 'RPM') return y*100;
                            else return y;

                        }
                    }
                }
            }
        );

        var advancedConfigurationConfigs = Object.assign({}, interactionModelConfigs, commonConfigs,
            {
                title: null,
                ylabel: "Avanço",
                xlabel: "RPM",
                labels: ['RPM', 'Mapa1', 'Mapa2'],
                colors: ["green", "blue"],
                showRangeSelector: false
            }
        );

        this.analyze = new Dygraph(document.getElementById("analyze-dygraph"), [[0, 0, 0, 0, 0, 0]], analyseConfigs);
        this.advancedConfiguration = new Dygraph(document.getElementById("advanced-configuration-dygraph"), [[0, 0, 0]], advancedConfigurationConfigs);
    };

    window.DinamometroCharts = new ConstrutorCharts();
})(); // Fim do encapsulamento dos charts
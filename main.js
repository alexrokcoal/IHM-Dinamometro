window.onload = function() { // início função auto-invocável

    function Dinamometro() {
        // Dados do dinamômetro
        this.data = [];

        // Definição dos gauges
        this.rpmGauge = null;
        this.lambdaGauge = null;
        this.torqueGauge = null;
        this.voltagemBateriaGauge = null;
        this.avancoRealGauge = null;

        // Definição dos gráficos
        this.analyzeDygraph = null;
        this.AdvancedConfigurationDygraph = null;

        // Flags
        this.isRealtimeDrawing = false;

        this.DASHBOARD_MODE_BASIC = 0;
        this.DASHBOARD_MODE_ANALYSE = 1;
        this.DASHBOARD_MODE_ADVANCED_CONFIGURATION = 2;

        this.dashboardMode = this.DASHBOARD_MODE_BASIC;

        var generateRandomDataInicio = window.performance.now();
        var generateRandomDataTempo = generateRandomDataInicio;

        this.generateRandomData = function () {
            generateRandomDataTempo = (window.performance.now() - generateRandomDataInicio)/1000;
            var dados = {
                tempo: generateRandomDataTempo,
                rpm: Math.round(Math.sin(generateRandomDataTempo*5)*5000)+5000,
                lambda: parseFloat(Math.sin(generateRandomDataTempo).toFixed(2)),
                torque: parseFloat(((Math.sin(generateRandomDataTempo*5)*2)+10).toFixed(2)),
                voltagemBateria: parseFloat(((Math.sin(generateRandomDataTempo)*2)+10).toFixed(2)),
                avancoReal: parseFloat(((Math.sin(generateRandomDataTempo*5)*2)+23).toFixed(2))
            };

            return dados;
        };

        this.rpmGauge = null;
        this.lambdaGauge = null;
        this.torqueGauge = null;
        this.voltagemBateriaGauge = null;
        this.avancoRealGauge = null;

        this.draw = function (idx) {
            var rpmValue;
            var lambdaValue;
            var torqueValue;
            var voltagemBateriaValue;
            var avancoRealValue;

            if(this.isRealtimeDrawing) {
                this.analyzeDygraph.updateOptions( { 'file': this.data } );
            }

            if(idx && !this.isRealtimeDrawing) {
                rpmValue = this.data[idx][1];
                lambdaValue = this.data[idx][2];
                torqueValue = this.data[idx][3];
                voltagemBateriaValue = this.data[idx][4];
                avancoRealValue = this.data[idx][5];
            } else {
                rpmValue = this.data[this.data.length-1][1];
                lambdaValue = this.data[this.data.length-1][2];
                torqueValue = this.data[this.data.length-1][3];
                voltagemBateriaValue = this.data[this.data.length-1][4];
                avancoRealValue = this.data[this.data.length-1][5];
            }

            this.rpmGauge.update({ units: rpmValue + ' RPM', value: rpmValue });
            this.lambdaGauge.update({ units: lambdaValue + ' V', value: lambdaValue });
            this.torqueGauge.update({ units: torqueValue + ' Kgf/m', value: torqueValue });
            this.voltagemBateriaGauge.update({ units: voltagemBateriaValue + ' V', value: voltagemBateriaValue });
            this.avancoRealGauge.update({ units: avancoRealValue + ' °', value: avancoRealValue });
        };

        this.init = function () {
            this.initGauges();
            this.initDygraphs();
        };

        this.stopRealtimeDrawing = function () {
            this.isRealtimeDrawing = false;

            this.rpmGauge.animation.duration = 100;
            this.lambdaGauge.animation.duration = 100;
            this.torqueGauge.animation.duration = 100;
            this.voltagemBateriaGauge.animation.duration = 100;
            this.avancoRealGauge.animation.duration = 100;
        };

        this.startRealtimeDrawing = function () {
            this.isRealtimeDrawing = true;

            this.rpmGauge.animation.duration = 0;
            this.lambdaGauge.animation.duration = 0;
            this.torqueGauge.animation.duration = 0;
            this.voltagemBateriaGauge.animation.duration = 0;
            this.avancoRealGauge.animation.duration = 0;

            function loop() {

                var dados = this.generateRandomData();

                if(dados.tempo>2) this.data.splice(0, 1);



                this.data.push([parseFloat(dados.tempo.toFixed(2)), dados.rpm, dados.lambda, dados.torque, dados.voltagemBateria, dados.avancoReal]);

                this.draw();

                if(dados.tempo<3) {
                    requestAnimationFrame(loop.bind(this));
                } else {
                    this.stopRealtimeDrawing();
                }
            }

            loop.bind(this)();



        };
        this.stop = function () {};


        this.initGauges = function () {
            var gaugesWidth = 150;
            var gaugesHeight = 150;

            /**
             * Definição do gauge de rpm
             * @type {RadialGauge}
             */
            this.rpmGauge = new RadialGauge({
                renderTo: 'canvas-rpm-gauge',
                width: gaugesWidth+40,
                height: gaugesHeight+40,
                units: 'RPM',
                title: null,
                value: 0,
                minValue: 0,
                maxValue: 15000,
                majorTicks: [
                    '0','2000','4000','6000','8000','1000','12000','14000','16000'
                ],
                highlights: [
                    { from: 0, to: 3000, color: 'rgba(0,255,0,.15)' },
                    { from: 3000, to: 6000, color: 'rgba(255,255,0,.15)' },
                    { from: 6000, to: 9000, color: 'rgba(255,30,0,.25)' },
                    { from: 9000, to: 12000, color: 'rgba(255,0,225,.25)' },
                    { from: 12000, to: 15000, color: 'rgba(0,0,255,.25)' }
                ],
                minorTicks: 2,
                strokeTicks: false,
                colorPlate: '#000',
                colorMajorTicks: '#f5f5f5',
                colorMinorTicks: '#ddd',
                colorTitle: '#fff',
                colorUnits: '#fff',
                colorNumbers: '#fff',
                colorNeedle: 'rgb(240,35,31)',
                colorNeedleEnd: 'rgb(240,35,31)',
                highlightsWidth: 10,
                numbersMargin: -2,
                barWidth: 0,
                barStrokeWidth: 0,
                needleShadow: false,
                //barProgress: 1,
                borders: false,
                barShadow: 0,
                valueBox: false,
                animationRule: 'bounce',
                animationDuration: 100
            }).draw();

            this.lambdaGauge = new RadialGauge({
                renderTo: 'canvas-lambda-gauge',
                width: gaugesWidth,
                height: gaugesHeight,
                units: 'Volts',
                title: null,
                value: 0,
                minValue: 0,
                maxValue: 2,
                majorTicks: [
                    '0','0.25','0.50','0.75','1','1.25','1.50','1.75','2'
                ],
                highlights: [
                    { from: 0, to: 2, color: 'rgba(20,20,20,1)' }
                ],
                minorTicks: 2,
                strokeTicks: false,
                colorPlate: '#000',
                colorMajorTicks: '#f5f5f5',
                colorMinorTicks: '#ddd',
                colorTitle: '#fff',
                colorUnits: '#fff',
                colorNumbers: '#fff',
                colorNeedle: 'rgb(240,35,31)',
                colorNeedleEnd: 'rgb(240,35,31)',
                highlightsWidth: 10,
                numbersMargin: -2,
                barWidth: 0,
                barStrokeWidth: 0,
                needleShadow: false,
                //barProgress: 1,
                borders: false,
                barShadow: 0,
                valueBox: false,
                animationRule: 'bounce',
                animationDuration: 100
            }).draw();

            this.torqueGauge = new RadialGauge({
                renderTo: 'canvas-torque-gauge',
                width: gaugesWidth,
                height: gaugesHeight,
                units: 'Kgf.m',
                title: null,
                value: 0,
                minValue: 0,
                maxValue: 20,
                majorTicks: [
                    '0','2.5','5','7.5','10','12.5','15','17.5','20'
                ],
                highlights: [
                    { from: 0, to: 20, color: 'rgba(20,20,20,1)' }
                ],
                minorTicks: 2,
                strokeTicks: false,
                colorPlate: '#000',
                colorMajorTicks: '#f5f5f5',
                colorMinorTicks: '#ddd',
                colorTitle: '#fff',
                colorUnits: '#fff',
                colorNumbers: '#fff',
                colorNeedle: 'rgb(240,35,31)',
                colorNeedleEnd: 'rgb(240,35,31)',
                highlightsWidth: 10,
                numbersMargin: -2,
                barWidth: 0,
                barStrokeWidth: 0,
                needleShadow: false,
                //barProgress: 1,
                borders: false,
                barShadow: 0,
                valueBox: false,
                animationRule: 'bounce',
                animationDuration: 100
            }).draw();

            this.voltagemBateriaGauge = new RadialGauge({
                renderTo: 'canvas-voltagem-bateria-gauge',
                width: gaugesWidth,
                height: gaugesHeight,
                units: 'V',
                title: null,
                value: 0,
                minValue: 0,
                maxValue: 15,
                majorTicks: [
                    '0','2.5','5','7.5','10','12.5','15'
                ],
                highlights: [
                    { from: 0, to: 15, color: 'rgba(20,20,20,1)' }
                ],
                minorTicks: 2,
                strokeTicks: false,
                colorPlate: '#000',
                colorMajorTicks: '#f5f5f5',
                colorMinorTicks: '#ddd',
                colorTitle: '#fff',
                colorUnits: '#fff',
                colorNumbers: '#fff',
                colorNeedle: 'rgb(240,35,31)',
                colorNeedleEnd: 'rgb(240,35,31)',
                highlightsWidth: 10,
                numbersMargin: -2,
                barWidth: 0,
                barStrokeWidth: 0,
                needleShadow: false,
                //barProgress: 1,
                borders: false,
                barShadow: 0,
                valueBox: false,
                animationRule: 'bounce',
                animationDuration: 100
            }).draw();

            this.avancoRealGauge = new RadialGauge({
                renderTo: 'canvas-avanco-real-gauge',
                width: gaugesWidth,
                height: gaugesHeight,
                units: '°APMS',
                title: null,
                value: 0,
                minValue: 0,
                maxValue: 30,
                majorTicks: [
                    '0','2.5','5','15','20','25','30'
                ],
                highlights: [
                    { from: 0, to: 30, color: 'rgba(20,20,20,1)' }
                ],
                minorTicks: 2,
                strokeTicks: false,
                colorPlate: '#000',
                colorMajorTicks: '#f5f5f5',
                colorMinorTicks: '#ddd',
                colorTitle: '#fff',
                colorUnits: '#fff',
                colorNumbers: '#fff',
                colorNeedle: 'rgb(240,35,31)',
                colorNeedleEnd: 'rgb(240,35,31)',
                highlightsWidth: 10,
                numbersMargin: -2,
                barWidth: 0,
                barStrokeWidth: 0,
                needleShadow: false,
                //barProgress: 1,
                borders: false,
                barShadow: 0,
                valueBox: false,
                animationRule: 'bounce',
                animationDuration: 100
            }).draw();
        };

        this.initDygraphs = function () {
            /**
             * Definição do gráfico de análise dos dados
             * @type {Dygraph}
             */
            this.analyzeDygraph = new Dygraph(document.getElementById("analyze-dygraph"), this.data,
                {
                    titleHeight: 30,
                    title: null,
                    ylabel: null,
                    xlabel: "Tempo (s)",
                    labels: ['Tempo', 'RPM', 'Lambda', 'Torque', 'Bateria', 'Avanço'],
                    labelsSeparateLines: true,
                    legend: "follow",
                    valueRange: [0, 15000],
                    drawPoints: true,
                    colors: ["blue", "green", "yellow", "red", "orange"],
                    fillGraph: true,
                    fillAlpha: 0.2,
                    strokeWidth: 1,
                    highlightSeriesOpts: {
                        strokeWidth: 1,
                        highlightCircleSize: 4
                    },
                    highlightSeriesBackgroundAlpha: 1,
                    showRangeSelector: true,
                    rangeSelectorPlotFillColor: "#0e0e41",
                    rangeSelectorPlotFillGradientColor: "",
                    rangeSelectorPlotLineWidth: 1,
                    rangeSelectorPlotStrokeColor: "blue",
                    rangeSelectorAlpha: 0.1,
                    drawHighlightPointCallback: function(g, seriesName, canvasContext, cx, cy, color, pointSize, idx){
                        if(!ApiDinamometro.isRealtimeDrawing && g.indexFromSetName(seriesName)==1) ApiDinamometro.draw(idx);
                    },
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
                    },
                }
            ); // Fim da definição do gráfico de análise dos dados
        };
    }

    var ApiDinamometro = new Dinamometro();

    ApiDinamometro.init();
    ApiDinamometro.startRealtimeDrawing();














}; // fim
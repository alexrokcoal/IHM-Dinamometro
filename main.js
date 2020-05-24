window.onload = function() { // início função auto-invocável

    function Dinamometro() {
        // Dados do dinamômetro
        this.dataAnalyse = [];

        // Dados do gráfico de configuração do avanço
        this.dataAdvancedConfiguration = [
            [0, 0, 0],
            [3000, 13, 11],
            [15000, 22, 18],
            [15000, 0, 0],
            [16000, 0, 0]
        ];

        // Dados recebidos via websocket
        this.jsonDataReveived;

        this.mapaSelecionado = "";
        this.idSelecionado = 0;
        this.pointSelecionado = {
            canvasx: 0,
            canvasy: 0,
            live: false
        };
        this.mouse = {x:0, y:0};

        this.updatePointSelecionado = function () {
            this.pointSelecionado.canvasx = DinamometroCharts.advancedConfiguration.toDomXCoord(this.dataAdvancedConfiguration[this.idSelecionado][0]);
            this.pointSelecionado.canvasy = DinamometroCharts.advancedConfiguration.toDomYCoord(this.dataAdvancedConfiguration[this.idSelecionado][DinamometroCharts.advancedConfiguration.indexFromSetName(this.mapaSelecionado)]);
        };

        this.drawPointSelecionado = function(ctx) {
            if(this.pointSelecionado.live) {
                this.updatePointSelecionado();
                x = this.pointSelecionado.canvasx;
                y = this.pointSelecionado.canvasy;
                ctx = ctx || DinamometroCharts.advancedConfiguration.hidden_ctx_;
                var cor = DinamometroCharts.advancedConfiguration.colorsMap_[this.mapaSelecionado];

                ctx.strokeStyle = cor;
                ctx.lineWidth = 3;
                ctx.fillStyle = "#111";
                ctx.beginPath();
                ctx.arc(x,y,9 ,0,Math.PI*2,true);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();


                ctx.fillStyle = cor;
                ctx.textAlign = "center";
                ctx.font='bold 11px Arial';
                ctx.fillText(parseFloat(DinamometroCharts.advancedConfiguration.toDataYCoord(y).toFixed(2)), x, y+4);

                // SETA PARA BAIXO
                ctx.beginPath();
                ctx.lineWidth = .7;
                ctx.moveTo(x,y+13);
                ctx.lineTo(x+4,y+13);
                ctx.lineTo(x,y+18);
                ctx.lineTo(x-4,y+13);
                ctx.lineTo(x,y+13);
                ctx.stroke();

                // SETA PARA CIMA
                ctx.beginPath();
                ctx.lineWidth = .7;
                ctx.moveTo(x,y-13);
                ctx.lineTo(x+4,y-13);
                ctx.lineTo(x,y-18);
                ctx.lineTo(x-4,y-13);
                ctx.lineTo(x,y-13);
                ctx.stroke();
            }
        };

        // Flags
        this.isRealtimeDrawing = false;

        this.DASHBOARD_MODE_BASIC = 0;
        this.DASHBOARD_MODE_ANALYSE = 1;
        this.DASHBOARD_MODE_ADVANCED_CONFIGURATION = 2;

        this.dashboardMode = this.DASHBOARD_MODE_BASIC;

        this.draw = function (idx) {

            var data = {
                rpm: 0,
                lambda: 0,
                torque: 0,
                batteryVoltage: 0,
                avancoReal: 0
            };

            if(idx && !this.isRealtimeDrawing) {
                data.rpm = this.dataAnalyse[idx][1]*100;
                data.lambda = this.dataAnalyse[idx][2];
                data.torque = this.dataAnalyse[idx][3];
                data.batteryVoltage = this.dataAnalyse[idx][4];
                data.avancoReal = this.dataAnalyse[idx][5];
            } else {
                data.rpm = this.dataAnalyse[this.dataAnalyse.length-1][1]*100;
                data.lambda = this.dataAnalyse[this.dataAnalyse.length-1][2];
                data.torque = this.dataAnalyse[this.dataAnalyse.length-1][3];
                data.batteryVoltage = this.dataAnalyse[this.dataAnalyse.length-1][4];
                data.avancoReal = this.dataAnalyse[this.dataAnalyse.length-1][5];
            }

            if(this.isRealtimeDrawing) {
                DinamometroCharts.analyze.updateOptions( { 'file': this.dataAnalyse } );
            }

            DinamometroGauges.updateAll(data);
        };

        this.init = function () {

            // Inicializa os gauges
            DinamometroGauges.init();

            // Inicializa os charts
            DinamometroCharts.init();

            DinamometroCharts.analyze.updateOptions({
                drawHighlightPointCallback: function(g, seriesName, canvasContext, cx, cy, color, pointSize, idx){
                    if(!ApiDinamometro.isRealtimeDrawing && g.indexFromSetName(seriesName)==1) ApiDinamometro.draw(idx);
                }
            });

            DinamometroCharts.advancedConfiguration.updateOptions({
                file: this.dataAdvancedConfiguration,
                pointClickCallback: function(e, point) {
                    ApiDinamometro.mapaSelecionado = point.name;
                    ApiDinamometro.idSelecionado = point.idx;
                    ApiDinamometro.pointSelecionado.live = true;
                    ApiDinamometro.mouse.x = e.x;
                    ApiDinamometro.mouse.y = e.y;
                    DinamometroCharts.advancedConfiguration.updateOptions( {} );
                    ApiDinamometro.drawPointSelecionado();
                },
                unhighlightCallback: function(x, seriesName, canvasContext, cx, cy, color, pointSize, idx){
                    DinamometroCharts.advancedConfiguration.clearSelection();
                    DinamometroCharts.advancedConfiguration.updateOptions( {} );
                },
                drawHighlightPointCallback: function(g, seriesName, canvasContext, cx, cy, color, pointSize, idx){
                    ApiDinamometro.drawPointSelecionado(g.canvas_ctx_);
                },
                drawCallback: function(g, seriesName, canvasContext, cx, cy, color, pointSize){
                    ApiDinamometro.drawPointSelecionado();
                },
                clickCallback: function(e, x, points) {
                    if(!(ApiDinamometro.mouse.x == e.x && ApiDinamometro.mouse.y == e.y)) {
                        ApiDinamometro.pointSelecionado.live = false;
                        DinamometroCharts.advancedConfiguration.updateOptions( {} );
                    }
                }
            });
        };

        this.stopRealtimeDrawing = function () {
            this.isRealtimeDrawing = false;
            DinamometroGauges.setAnimationDuration(500);
        };

        this.startRealtimeDrawing = function () {
            this.isRealtimeDrawing = true;
            DinamometroGauges.setAnimationDuration(0);

            var ultimoTempo = 0;
            var contPerda = 0;
            this.dataAnalyse = [];
            window.dataData = null;

            function loop() {
                if (this.jsonDataReveived) {
                    if(this.dataAnalyse.length>=50 && this.jsonDataReveived.tempo!=ultimoTempo) this.dataAnalyse.splice(0, 1);

                    this.dataAnalyse.push([parseFloat(this.jsonDataReveived.tempo.toFixed(2)), this.jsonDataReveived.rpm/100, this.jsonDataReveived.lambda, this.jsonDataReveived.torque, this.jsonDataReveived.voltagemBateria, this.jsonDataReveived.avancoReal]);

                    if(this.dataAnalyse.length>0) this.draw();

                    if (this.jsonDataReveived.tempo==ultimoTempo){
                        contPerda++;
                    }

                    ultimoTempo = this.jsonDataReveived.tempo;
                }

                if(!(contPerda>=50)) {
                    requestAnimationFrame(loop.bind(this));
                } else {
                    this.stopRealtimeDrawing();
                }
            }

            loop.bind(this)();
        };
    }

    var ApiDinamometro = new Dinamometro();

    ApiDinamometro.init();
    ApiDinamometro.startRealtimeDrawing();

    function changeMapa(el) {
        ApiDinamometro.pointSelecionado.live = false;
        DinamometroCharts.advancedConfiguration.setVisibility(el.id, el.checked);
    }

    function aumentarAvanco(){
        if(ApiDinamometro.pointSelecionado.live) {
            ApiDinamometro.dataAdvancedConfiguration[ApiDinamometro.idSelecionado][DinamometroCharts.advancedConfiguration.indexFromSetName(ApiDinamometro.mapaSelecionado)] = ApiDinamometro.dataAdvancedConfiguration[ApiDinamometro.idSelecionado][DinamometroCharts.advancedConfiguration.indexFromSetName(ApiDinamometro.mapaSelecionado)]+1;
            DinamometroCharts.advancedConfiguration.updateOptions( { 'file': ApiDinamometro.dataAdvancedConfiguration } );
            ApiDinamometro.drawPointSelecionado();
        }
    }

    function diminuirAvanco(){
        if(ApiDinamometro.pointSelecionado.live) {
            ApiDinamometro.dataAdvancedConfiguration[ApiDinamometro.idSelecionado][DinamometroCharts.advancedConfiguration.indexFromSetName(ApiDinamometro.mapaSelecionado)] = ApiDinamometro.dataAdvancedConfiguration[ApiDinamometro.idSelecionado][DinamometroCharts.advancedConfiguration.indexFromSetName(ApiDinamometro.mapaSelecionado)]-1;
            DinamometroCharts.advancedConfiguration.updateOptions( { 'file': ApiDinamometro.dataAdvancedConfiguration } );
            ApiDinamometro.drawPointSelecionado();
        }
    }

    document.body.addEventListener('keydown', function(event) {
        switch (event.key) {
            case "ArrowLeft":
                // Left pressed
                break;
            case "ArrowRight":
                // Right pressed
                break;
            case "ArrowUp":
                aumentarAvanco();
                break;
            case "ArrowDown":
                diminuirAvanco();
                break;
        }
    });

    var ws = null;
    var serverUrl = "ws://192.168.1.52";

    var open = function() {
        var url = serverUrl;
        ws = new WebSocket(url);
        ws.onopen = onOpen;
        ws.onclose = onClose;
        ws.onmessage = onMessage;
        ws.onerror = onError;
    }

    var close = function() {
        if (ws) {
            ws.close();
        }
    }

    var onOpen = function() {};

    var onClose = function() {
        ws = null;
    };

    var onMessage = function(event) {
        var jsonData = JSON.parse(event.data);
        ApiDinamometro.jsonDataReveived = jsonData;
    };

    var onError = function(event) {};

    window.reconectar = function () {
        close();
        setTimeout(function () {
            open();
            setTimeout(function () {
                ApiDinamometro.startRealtimeDrawing();
            }, 1000);

        }, 1000);
    };

    //ws.send(msg);

    open();

    window.aumentarAvanco = aumentarAvanco;
    window.diminuirAvanco = diminuirAvanco;
    window.changeMapa = changeMapa;
}; // fim
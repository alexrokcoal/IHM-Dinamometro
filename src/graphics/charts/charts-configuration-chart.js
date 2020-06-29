function ConfigurationChart(configs) {

    let configurationData = [
        [0, 0, 0],
        [3000, 13, 11],
        [15000, 22, 18],
        [15000, 0, 0],
        [16000, 0, 0]
    ];


    let mapaSelecionado = "";
    let idSelecionado = 0;
    let pointSelecionado = {
        canvasx: 0,
        canvasy: 0,
        live: false
    };

    let mouse = {x:0, y:0};



    let configurationChart = new Dygraph(document.getElementById("configuration-dygraph"), configurationData, {
        title: null,
        ylabel: "Avanço",
        xlabel: "RPM",
        labels: ['RPM', 'Mapa1', 'Mapa2'],
        colors: ["green", "blue"],
        showRangeSelector: false,

        legend: "follow",
        valueRange: [],
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
        },

        pointClickCallback: function(e, point) {
            mapaSelecionado = point.name;
            idSelecionado = point.idx;
            pointSelecionado.live = true;
            mouse = {
                x: e.x,
                y: e.y
            };
            configurationChart.updateOptions( {} );
            drawPointSelecionado();
        }.bind(this),
        unhighlightCallback: function(x, seriesName, canvasContext, cx, cy, color, pointSize, idx){
            //configurationChart.clearSelection();
            //configurationChart.updateOptions( {} );
        }.bind(this),
        drawHighlightPointCallback: function(g, seriesName, canvasContext, cx, cy, color, pointSize, idx){
            drawPointSelecionado(g.canvas_ctx_);
        }.bind(this),
        onDrawCallback: function(g, seriesName, canvasContext, cx, cy, color, pointSize){
            drawPointSelecionado();
        }.bind(this),
        clickCallback: function(e, x, points) {
            if(!(mouse.x == e.x && mouse.y == e.y)) {
                pointSelecionado.live = false;
                configurationChart.updateOptions( {} );
            }
        }.bind(this)
    });


    let updatePointSelecionado = function () {
        pointSelecionado.canvasx = configurationChart.toDomXCoord(configurationChart.file_[idSelecionado][0]);
        pointSelecionado.canvasy = configurationChart.toDomYCoord(configurationChart.file_[idSelecionado][configurationChart.indexFromSetName(mapaSelecionado)]);
    };

    let drawPointSelecionado = function(ctx) {
        if(pointSelecionado.live) {
            updatePointSelecionado();
            let x = pointSelecionado.canvasx;
            let y = pointSelecionado.canvasy;
            ctx = ctx || configurationChart.hidden_ctx_;
            var cor = configurationChart.colorsMap_[mapaSelecionado];

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
            ctx.fillText(parseFloat(configurationChart.toDataYCoord(y).toFixed(2)), x, y+4);

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

    this.changeMapa = function(el) {
        pointSelecionado.live = false;
        configurationChart.setVisibility(el.value, el.checked);
    };

    this.aumentarAvanco = function (){
        if(pointSelecionado.live) {
            configurationChart.file_[idSelecionado][configurationChart.indexFromSetName(mapaSelecionado)] = configurationChart.file_[idSelecionado][configurationChart.indexFromSetName(mapaSelecionado)]+1;
            configurationChart.updateOptions( { 'file': configurationChart.file_ } );
            drawPointSelecionado();
        }
    };

    this.diminuirAvanco = function (){
        if(pointSelecionado.live) {
            configurationChart.file_[idSelecionado][configurationChart.indexFromSetName(mapaSelecionado)] = configurationChart.file_[idSelecionado][configurationChart.indexFromSetName(mapaSelecionado)]-1;
            configurationChart.updateOptions( { 'file': configurationChart.file_ } );
            drawPointSelecionado();
        }
    };

    this.getChart = function () {
        return configurationChart;
    };

    document.body.addEventListener('keydown', function(event) {
        switch (event.key) {
            case "ArrowLeft":
                // Left pressed
                break;
            case "ArrowRight":
                // Right pressed
                break;
            case "ArrowUp":
                DINAMOMETRO.graphics.charts.configuration.aumentarAvanco();
                break;
            case "ArrowDown":
                DINAMOMETRO.graphics.charts.configuration.diminuirAvanco();
                break;
        }
    });

}

DinamometroCharts.prototype.configuration = new ConfigurationChart({
    mouseEvents: {
        onMouseDown: function (event, g, context) {
            context.initializeMouseDown(event, g, context);
            if (event.altKey || event.shiftKey) {
                Dygraph.startZoom(event, g, context);
            } else {
                Dygraph.startPan(event, g, context);
            }
        },
        onMouseMove: function (event, g, context) {
            if (context.isPanning) {
                Dygraph.movePan(event, g, context);
            } else if (context.isZooming) {
                Dygraph.moveZoom(event, g, context);
            }
        },
        onMouseUp: function (event, g, context) {
            if (context.isPanning) {
                Dygraph.endPan(event, g, context);
            } else if (context.isZooming) {
                Dygraph.endZoom(event, g, context);
            }
        },
        onClick: function (event, g, context) {
            event.preventDefault();
            event.stopPropagation();
        },
        onDblClick: function (event, g, context) {
            g.updateOptions({
                dateWindow: null,
                valueRange: null
            });
        },
        onMouseWheel: function () {}
    }
});
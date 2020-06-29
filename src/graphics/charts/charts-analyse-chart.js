function AnalyseChart (configs) {

    let analyseChart = new Dygraph(document.getElementById("analyze-dygraph"), [[0, 0, 0, 0, 0, 0]], {
        title: null,
        ylabel: null,
        xlabel: null,
        labels: ['Tempo', 'RPM', 'Lambda', 'Torque', 'Bateria', 'Avanço'],
        colors: ["blue", "green", "yellow", "red", "orange"],

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

        showRangeSelector: true,
        rangeSelectorPlotFillColor: "#002",
        rangeSelectorPlotFillGradientColor: "",
        rangeSelectorPlotLineWidth: 1,
        rangeSelectorPlotStrokeColor: "#002",
        rangeSelectorAlpha: 0.1,
        rangeSelectorHeight: 20,

        axes : {
            y : {
                valueFormatter: function(y, opts, series_name) {
                    if (series_name == 'RPM') return y*100;
                    else return y;

                }
            }
        },

        interactionModel: {
            mousedown: configs.mouseEvents.onMouseDown || null,
            mousemove: configs.mouseEvents.onMouseMove || null,
            mouseup: configs.mouseEvents.onMouseUp || null,
            click: configs.mouseEvents.onClick || null,
            dblclick: configs.mouseEvents.onDblClick || null,
            mousewheel: configs.mouseEvents.onMouseWheel || null,
        },

        drawHighlightPointCallback: configs.chartEvents.onDrawHighlightPointCallback || null
    });

    this.resize = function () {
        analyseChart.resize();
    };

    this.resetZoom = function () {
        analyseChart.resetZoom();
    };

    this.changeAnalyse = function (el) {
        analyseChart.setVisibility(el.id, el.checked);
    };

    this.showRangeSelector = function () {
        analyseChart.hidden_ctx_.clearRect(0, 0, analyseChart.hidden_.width, analyseChart.hidden_.height);
        analyseChart.updateOptions({showRangeSelector: true});
    };

    this.hideRangeSelector = function () {
        analyseChart.updateOptions({showRangeSelector: false});
    };

    this.draw = function (dataFrameBuffer) {
        analyseChart.updateOptions({'file': dataFrameBuffer });
    };
}

DinamometroCharts.prototype.analyze = new AnalyseChart({
    mouseEvents: {
        onMouseDown: function (event, g, context) {
            if(!DINAMOMETRO.status.is(DINAMOMETRO.status.RUNNING)) {
                context.initializeMouseDown(event, g, context);
                if (event.altKey || event.shiftKey) {
                    Dygraph.startZoom(event, g, context);
                } else {
                    Dygraph.startPan(event, g, context);
                }
            }
        },
        onMouseMove: function (event, g, context) {
            if(!DINAMOMETRO.status.is(DINAMOMETRO.status.RUNNING)) {
                if (context.isPanning) {
                    Dygraph.movePan(event, g, context);
                } else if (context.isZooming) {
                    Dygraph.moveZoom(event, g, context);
                }
            }
        },
        onMouseUp: function (event, g, context) {
            if(!DINAMOMETRO.status.is(DINAMOMETRO.status.RUNNING)) {
                if (context.isPanning) {
                    Dygraph.endPan(event, g, context);
                } else if (context.isZooming) {
                    Dygraph.endZoom(event, g, context);
                }
            }
        },
        onClick: function (event, g, context) {
            if(!DINAMOMETRO.status.is(DINAMOMETRO.status.RUNNING)) {
                event.preventDefault();
                event.stopPropagation();
            }
        },
        onDblClick: function (event, g, context) {
            if(!DINAMOMETRO.status.is(DINAMOMETRO.status.RUNNING)) {
                g.updateOptions({
                    dateWindow: null,
                    valueRange: null
                });
            }
        },
        onMouseWheel: function () {}
    },
    chartEvents: {
        onDrawHighlightPointCallback: function(g, seriesName, canvasContext, cx, cy, color, pointSize, idx){
            if(!DINAMOMETRO.status.is(DINAMOMETRO.status.RUNNING)  && DINAMOMETRO.getDataFrameBufferLength()>0) DINAMOMETRO.graphics.gauges.draw(DINAMOMETRO.getDataFrame(idx));
        }
    }
});
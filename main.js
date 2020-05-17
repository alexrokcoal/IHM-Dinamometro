(function() { // início função auto-invocável

    // Gauge

    var gaugePressure = new RadialGauge({
        renderTo: 'canvas-rpm-gauge',
        width: 200,
        height: 200,
        units: 'RPM',
        title: false,
        value: 0,
        minValue: 0,
        maxValue: 15000,
        majorTicks: [
            '0','2000','4000','6000','8000','1000','12000','14000','16000'
        ],
        minorTicks: 2,
        strokeTicks: false,
        highlights: [
            { from: 0, to: 3000, color: 'rgba(0,255,0,.15)' },
            { from: 3000, to: 6000, color: 'rgba(255,255,0,.15)' },
            { from: 6000, to: 9000, color: 'rgba(255,30,0,.25)' },
            { from: 9000, to: 12000, color: 'rgba(255,0,225,.25)' },
            { from: 12000, to: 15000, color: 'rgba(0,0,255,.25)' }
        ],
        colorPlate: '#222',
        colorMajorTicks: '#f5f5f5',
        colorMinorTicks: '#ddd',
        colorTitle: '#fff',
        colorUnits: '#ccc',
        colorNumbers: '#eee',
        colorNeedle: 'rgba(240, 128, 128, 1)',
        colorNeedleEnd: 'rgba(255, 160, 122, .9)',
        valueBox: true,
        animationRule: 'bounce',
        animationDuration: 0
    });

    // Dygraph


    var data = [];


    var g = new Dygraph(document.getElementById("data-dygraph"), data,
        {
            title: "Título",
            titleHeight: 30,
            ylabel: "RPM",
            xlabel: "Tempo (s)",
            drawPoints: true,
            valueRange: [0, 15000],
            labels: ['Time', 'RPM'],
            showRangeSelector: true,
            legend: "follow",
            labelsSeparateLines: true,
            rangeSelectorPlotFillColor: "#0e0e41",
            rangeSelectorPlotFillGradientColor: "",
            rangeSelectorPlotLineWidth: 1,
            rangeSelectorPlotStrokeColor: "blue",

            colors: ["blue"],
            fillGraph: true,
            fillAlpha: .2,
            rangeSelectorAlpha: .1,
            strokeWidth: 1,

            highlightSeriesOpts: {
                strokeWidth: 1,
                highlightCircleSize: 4
            },
            highlightSeriesBackgroundAlpha: 1,
        });
    // It sucks that these things aren't objects, and we need to store state in window.


    var cont = 0;
    var inicio = window.performance.now();
    var tempo = inicio;

    var data_rpm = 0;

    function loop() {
        cont++;
        tempo = (window.performance.now() - inicio)/1000;

        var arredondado = parseFloat(tempo.toFixed(2));

        if(cont>100) data.splice(0, 1);

        data_rpm = Math.round(Math.sin(cont/10)*5000)+5000;
        gaugePressure.value = data_rpm;
        //gaugePressure.draw();


        data.push([arredondado, data_rpm]);
        g.updateOptions( { 'file': data } );

        if(cont<=50) requestAnimationFrame(loop);
    }

    loop();













})(); // fim função auto-invocável
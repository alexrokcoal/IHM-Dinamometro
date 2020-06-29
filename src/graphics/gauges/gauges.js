
function DinamometroGauges() {

    // Definição dos gauges
    this.rpm;
    this.torque;
    this.avancoReal;
    //this.batteryVoltage;
    this.lambda;

    // Settings
    this.gaugesWidth = 140;
    this.gaugesHeight = 140;
}

DinamometroGauges.prototype.init = function () {

    var commonProps = {
        minorTicks: 2,
        strokeTicks: false,
        colorPlate: '#000',
        colorMajorTicks: '#f5f5f5',
        colorMinorTicks: '#ddd',
        colorTitle: '#fff',
        colorUnits: '#bbb',
        colorNumbers: '#bbb',
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
        //animationRule: 'bounce',
        animationDuration: 0,
        //fontValueSize: 40,
        //fontNumbers: "Verdana",
        //fontTitle: "Verdana",
        fontUnits: "Led",
        //fontValue: "Led",
        //fontValueStyle: 'italic',
        //fontNumbersStyle: 'italic',
        //fontNumbersWeight: 'bold',
        //fontTitleSize: 24,
        //fontValueSize: 50,
        animatedValue: false
    };

    var rpmConfig = Object.assign({}, commonProps,
        {
            renderTo: 'canvas-rpm-gauge',
            title: null,
            units: 'RPM',
            width: this.gaugesWidth+40,
            height: this.gaugesHeight+40,
            value: 0,
            minValue: 0,
            maxValue: 16000,
            majorTicks: [
                '0','2000','4000','6000','8000','10000','12000','14000','16000'
            ],
            highlights: [
                { from: 0, to: 5000, color: 'rgba(0,255,0,.3)' },
                { from: 5000, to: 11000, color: 'rgba(255,255,0,.3)' },
                { from: 11000, to: 16000, color: 'rgba(255,30,0,.3)' }
            ],
            fontNumbersSize: 18,
            fontUnitsSize: 30
        }
    );

    var torqueConfig = Object.assign({}, commonProps,
        {
            renderTo: 'canvas-torque-gauge',
            title: null,
            units: 'Kgf.m',
            width: this.gaugesWidth,
            height: this.gaugesHeight,
            value: 0,
            minValue: 0,
            maxValue: 20,
            majorTicks: [
                '0','2.5','5','7.5','10','12.5','15','17.5','20'
            ],
            highlights: [
                { from: 0, to: 10, color: 'rgba(187,187,187,.1)' },
                { from: 10, to: 20, color: 'rgba(255,30,0,.3)' }
            ],
            fontNumbersSize: 25,
            fontUnitsSize: 30
        }
    );

    var avancoRealConfig = Object.assign({}, commonProps,
        {
            renderTo: 'canvas-avanco-real-gauge',
            title: null,
            units: '°APMS',
            width: this.gaugesWidth,
            height: this.gaugesHeight,
            value: 0,
            minValue: 0,
            maxValue: 30,
            majorTicks: [
                '0','2.5','5','15','20','25','30'
            ],
            highlights: [
                { from: 0, to: 30, color: 'rgba(187,187,187,.1)' }
            ],
            fontNumbersSize: 25,
            fontUnitsSize: 30
        }
    );

    this.batteryVoltage = new NumericGauge({
        htmlCanvasElement: document.getElementById("canvas-voltagem-bateria-gauge"),
        width: 100,
        height: 40,
        textColor: "#bbb",
        backgroundColor: "#000",
        data: "00.00"
    });

    this.lambda = new NumericGauge({
        htmlCanvasElement: document.getElementById("canvas-lambda-gauge"),
        width: 100,
        height: 40,
        textColor: "#bbb",
        backgroundColor: "#000",
        data: "0.00"
    });

    this.rpm = new RadialGauge(rpmConfig).draw();
    this.torque = new RadialGauge(torqueConfig).draw();
    this.avancoReal = new RadialGauge(avancoRealConfig).draw();
};

DinamometroGauges.prototype.destroy = function () {
    this.rpm = null;
    this.torque = null;
    this.avancoReal = null;
    this.batteryVoltage = null;
    this.lambda = null;
};


DinamometroGauges.prototype.draw = function (data) {
    this.rpm.update({ units: (data[1]*100).toFixed(0) + ' RPM', value: data[1]*100 });
    //this.lambda.update({ units: data[2].toFixed(2) + ' V', value: data[2] });
    this.torque.update({ units: data[3].toFixed(2) + ' Kgfm', value: data[3] });
    this.avancoReal.update({ units: data[5].toFixed(2) + '°', value: data[5] });

    this.batteryVoltage.draw(data[4]>10 ? data[4].toFixed(2) : "0"+data[4].toFixed(2));
    this.lambda.draw(data[2].toFixed(2));
};

Graphics.prototype.gauges = new DinamometroGauges();

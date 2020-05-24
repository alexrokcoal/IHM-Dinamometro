(function () { // Início do encapsulamento dos gauges

    function ConstrutorGauges() {

        // Definição dos gauges
        this.rpm;
        this.torque;
        this.avancoReal;
        this.batteryVoltage;
        this.lambda;

        // Settings
        this.gaugesWidth = 150;
        this.gaugesHeight = 150;
    }

    ConstrutorGauges.prototype.init = function () {

        var commonProps = {
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
            animationDuration: 100,
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
                    { from: 0, to: 20, color: 'rgba(20,20,20,1)' }
                ],
                fontNumbersSize: 25,
                fontUnitsSize: 35
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
                    { from: 0, to: 30, color: 'rgba(20,20,20,1)' }
                ],
                fontNumbersSize: 25,
                fontUnitsSize: 35
            }
        );

        var batteryVolatageConfig = Object.assign({}, commonProps,
            {
                renderTo: 'canvas-voltagem-bateria-gauge',
                title: null,
                units: 'V',
                width: this.gaugesWidth,
                height: this.gaugesHeight,
                value: 0,
                minValue: 0,
                maxValue: 15,
                majorTicks: [
                    '0','2.5','5','7.5','10','12.5','15'
                ],
                highlights: [
                    { from: 0, to: 15, color: 'rgba(20,20,20,1)' }
                ],
                fontNumbersSize: 25,
                fontUnitsSize: 35
            }
        );

        var lambdaConfig = Object.assign({}, commonProps,
            {
                renderTo: 'canvas-lambda-gauge',
                title: null,
                units: 'Volts',
                width: this.gaugesWidth,
                height: this.gaugesHeight,
                value: 0,
                minValue: 0,
                maxValue: 2,
                majorTicks: [
                    '0','0.25','0.50','0.75','1','1.25','1.50','1.75','2'
                ],
                highlights: [
                    { from: 0, to: 2, color: 'rgba(20,20,20,1)' }
                ],
                fontNumbersSize: 25,
                fontUnitsSize: 35
            }
        );

        this.rpm = new RadialGauge(rpmConfig).draw();
        this.torque = new RadialGauge(torqueConfig).draw();
        this.avancoReal = new RadialGauge(avancoRealConfig).draw();
        this.batteryVoltage = new RadialGauge(batteryVolatageConfig).draw();
        this.lambda = new RadialGauge(lambdaConfig).draw();
    };

    ConstrutorGauges.prototype.destroy = function () {
        this.rpm = null;
        this.torque = null;
        this.avancoReal = null;
        this.batteryVoltage = null;
        this.lambda = null;
    };

    ConstrutorGauges.prototype.setAnimationDuration = function (duration) {
        this.rpm.animation.duration = duration;
        this.lambda.animation.duration = duration;
        this.torque.animation.duration = duration;
        this.batteryVoltage.animation.duration = duration;
        this.avancoReal.animation.duration = duration;
    };

    ConstrutorGauges.prototype.updateAll = function (data) {
        this.rpm.update({ units: data.rpm.toFixed(0) + ' RPM', value: data.rpm });
        this.lambda.update({ units: data.lambda + ' V', value: data.lambda });
        this.torque.update({ units: data.torque + ' Kgf/m', value: data.torque });
        this.batteryVoltage.update({ units: data.batteryVoltage + ' V', value: data.batteryVoltage });
        this.avancoReal.update({ units: data.avancoReal + ' °', value: data.avancoReal });
    };

    window.DinamometroGauges = new ConstrutorGauges();
})(); // Fim do encapsulamento dos gauges
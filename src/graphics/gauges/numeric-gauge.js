/**
 * Classe responsável pelo gauge numeric.
 * @constructor
 * @author Alex Silva <alexro.kcoal@gmail.com>
 */
function NumericGauge(configs) {

    // Definição das configurações.
    let htmlCanvasElement = configs.htmlCanvasElement,
        canvasCtx = htmlCanvasElement.getContext("2d"),
        width = configs.width,
        heigth = configs.height,
        textColor = configs.textColor,
        backgroundColor = configs.backgroundColor,
        data = configs.data;

    htmlCanvasElement.width = width;
    htmlCanvasElement.height = heigth;

    /**
     * Desenha o numeric gauge.
     * @param {String} dat - Dados a serem desenhados.
     */
    this.draw = function (dat) {
        canvasCtx.clearRect(0, 0, width, heigth);
        canvasCtx.fillStyle = backgroundColor;
        canvasCtx.fillRect(0, 0, width, heigth);
        canvasCtx.textAlign = "center";
        canvasCtx.font = "normal 40px Led";
        canvasCtx.fillStyle = textColor;
        canvasCtx.fillText(dat || data,(width/2), (heigth/2)+15);
    };
}
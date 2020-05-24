(function () { // Início do encapsulamento da conexão websocket

    function ConstrutorWebSocketConnection() {
        this.ws = null;
        this.serverUrl = null;

        // Callbacks
        this.onConnect = null;
        this.onMessage = null;

        this.dataReveived = null;
    }

    ConstrutorWebSocketConnection.prototype.init = function (url) {
        this.serverUrl = url;
    };

    ConstrutorWebSocketConnection.prototype.connect = function () {
        this.ws = new WebSocket(this.serverUrl);

        this.ws.onopen = function () {};

        this.ws.onclose = function () {};

        this.ws.onerror = function () {};

        this.ws.onmessage = function (event) {
            WebSocketConnection.dataReveived = event.data;
            if (WebSocketConnection.onMessage) WebSocketConnection.onMessage(WebSocketConnection.dataReveived);
        };

        setTimeout(function () {
            if(WebSocketConnection.dataReveived) {
                if (WebSocketConnection.onConnect) WebSocketConnection.onConnect();
            } else {
                WebSocketConnection.reconnect();
            }
        }, 1000);
    };

    ConstrutorWebSocketConnection.prototype.addEventListener = function(event, callback) {
        switch (event) {
            case "onConnect":
                this.onConnect = callback;
                break;
            case "onMessage":
                this.onMessage = callback;
                break;
        }
    };

    ConstrutorWebSocketConnection.prototype.reconnect = function () {
        this.close();
        setTimeout(function () {
            WebSocketConnection.connect();
        }, 1000);
    };

    ConstrutorWebSocketConnection.prototype.close = function () {
        if (this.ws) {
            this.ws.close();
            this.dataReveived = null;
        }
    };


    //ws.send(msg);


    window.WebSocketConnection = new ConstrutorWebSocketConnection();
})(); // Fim do encapsulamento da conexão websocket
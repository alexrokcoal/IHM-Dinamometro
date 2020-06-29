/**
 * Classe responsável por armazenar dados localmente no dispositivo do cliente.
 * @constructor
 * @author Alex Silva <alexro.kcoal@gmail.com>
 */
function Storage() {
    /**
     * Construtor responsável por criar os itens de storage.
     * @param {String} key - Chave de acesso ao dado.
     * @param {RegExp} filter - Filtro de validação do dado.
     * @constructor
     */
    let StorageItem = function (key, filter) {
        // Atributos do storage item.
        this.key = key;
        this.filter = filter;

        /**
         * Responsável por validar o storageItem.
         * @param {String} value - Valor do item.
         * @returns {boolean}
         */
        this.validate = function (value) {
            return this.filter ? new RegExp(this.filter).test(value) : true;
        };
    };

    // Definição dos itens de storage.
    this.webSocketServerIp = new StorageItem(
        "webSocketServerIp",
        /^([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}|localhost)(:[0-9]{1,5})?$/
    );

    /**
     * Retorna verdadeiro caso exista o dado armazenado localmente ou caso contrário retorna falso.
     * @param {StorageItem} item - storage item.
     * @returns {boolean}
     */
    this.has = function (item) {
        // Se item for instância de this.StorageItem.
        if(item instanceof StorageItem) {
            return item.validate(localStorage.getItem(item.key));
        } else {
            return false;
        }
    };

    /**
     * Define o valor do dado informado de acordo com o item.
     * @param {StorageItem} item - Item de armazenamento.
     * @param {String} value - Valor do item.
     * @returns {boolean}
     */
    this.set = function (item, value) {
        // Se item for instância de this.StorageItem e for válido.
        if(item instanceof StorageItem && item.validate(value)) {
            localStorage.setItem(item.key, value);
            return true;
        } else {
            return false;
        }
    };

    /**
     * Devolve o valor do item armazenado localmente.
     * @param {StorageItem} item - Item armazenado localmente.
     * @returns {string|boolean}
     */
    this.get = function (item) {
        // Se item for instância de this.StorageItem e for válido.
        if(item instanceof StorageItem && item.validate(localStorage.getItem(item.key))) {
            return localStorage.getItem(item.key);
        } else {
            return false;
        }
    };
}

/**
 * Módulo de armazenamento de dados no navegador do cliente.
 * @type {Storage}
 */
Dinamometro.prototype.storage = new Storage();
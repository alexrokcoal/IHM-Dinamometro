/**
 *  Código principal responsável iniciar a aplicação logo que a página estiver carregada.
 *  @author Alex Silva <alexro.kcoal@gmail.com>
 */
window.onload = function() {

    // Cria a aplicação IHM
    window.DINAMOMETRO = new Dinamometro();

    // Inicia a aplicação IHM
    DINAMOMETRO.init();
};
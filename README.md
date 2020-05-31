# IHM Dinamômetro
É uma IHM (interface homem máquina) web, criada para interação com um dinamômetro, mostrando em tempo real dados do dinamômetro como: RPM do motor, torque, e outros dados essenciais. O objetivo da criação deste projeto é obter mais conhecimento e aprender mais sobre sistemas de interação hardware e software.

### Como é o hardware?
É construído basicamente por um motor com seu eixo ligado em um mecanismo que produz resistência. Assim é possível medir o torque para obter o desempenho do motor em diversas condições. O dinamômetro foi desenvolvido com o ESP32, responsável por gerenciar o funcionamento do dinamômetro e interagir com a IHM.  

## Documentação

### Definindo linguagem de programação
Para o desenvolvimento do projeto foi escolhido a linguagem de programação Javascript. O motivo da escolha foi porque é a linguagem padrão dos browsers, funciona em várias plataformas, tem um ótimo desempenho para apesentação dos dados em tempo real e a possibilidade de criar paineis dinâmicos incríveis. 

### Protocolo escolhido para a comunicação
Devido a necessidade de atualização de dados em tempo real, foi escohido o protocolo de comunicação Websocket. Este protocolo foi implementado nos browsers justamente para realizar este tipo de tarefa. Já é nativo da linguagem de programação Javascript e também existe disponível a biblioteca Websocket Server para os embarcados, como no caso do ESP32 utilizado no dinamômetro.

### Bibliotecas utilizadas:
* **Dygraph:** Utilizada para apresentar os gráficos ([Link](http://dygraphs.com/));
* **Gauge:** Utilizada para apresentar os gauges ([Link](https://canvas-gauges.com/));

### Telas:
* **Conexão:** Nesta tela é inserido o ip do dinamômetro para comunicação com o hardware;
* **Dashboard:** Painel da IHM, com o cabeçalho no topo e um conteiner abaixo com os gauges, gráficos e outros componentes necessários.

### Modos de visualização do dashboard:
* **Apresentação:** Apresenta apenas os gauges;
* **Análise:** Apresenta os gauges e o gráfico de análise; 
* **Configuração:** Apresenta os gauges e o gráfico de configuração;
* **Avançado:** Apresenta os gauges, o gráfico de análise e o gráfico de configuração;


 eng-zap-challenge-javascript


- Para rodar localmente, baixar a pasta
- Abrir a pasta e carregar o index.html
- Não há nenhuma dependencias ou adoção de libs externos 
- Stacks utilizadas html/css/javascript - (puros)
- Testes na pasta teste-console / logs prints
- Na pasta teste-console também há um PDF nome (FLUXOGRAMA-TRATAMENTO-DADOS) 
- contendo a lógica que utilizei para realizar a filtragem dos dados
- Abaixo segue um overview sobre o comportamento da aplicação

  
   * ************************* FLUXO DA APLICAÇÃO ****************************
   * 
   * btoFilterByVivaReal || btoFilterByZap - (eVENTOS INICIAIS) - 
   *
   *------------------- funções principais no fluxo ----------------------------------
   * getResultados()
   * ajaxCaller()
   * mainFunction() - Função controladora do fluxo
   *      checaImoveisValidos() - Função auxiliar
   *      vivaBusinessRules() ou zapBusinessRules() - Validação regras de negócio 
   *      startSessionStoragePrinterOnePage()
   *      controlaRolagemPages()
   *      htmlPrinter() - Rederiza o resultado 
   *      -função armazenada em arquivos externo, no mesmo diretório 'html-template-resultado.js'
   * 
   *
   * ------------------- funções auxiliares ------------------------------------
   * htmlPrinter()
   * htmlPrinterError()
   * checkCG() - verificar coordenadas Bouding Box
   * calculaValorMetroQuadrado() 
   * checaImoveisValidos() - Elimina os imóveis considerados não elegíveis 
   * percentValorRent() - verificar o valor da taxa de condomino e compara com valor do aluguel
   * controlaRolagemPages() - Controla a paginação por demanda
   * timerMsgCarregando() - msg para user
   * startSessionStoragePrinterOnePage() - amazenamento local
   * preparaDetalhes() - Renderiza ficha detalhe do imóveil selecionado
      - função armazenada em arquivos externo, mesma pasta 'template-detalhe-imovel.js'
 */

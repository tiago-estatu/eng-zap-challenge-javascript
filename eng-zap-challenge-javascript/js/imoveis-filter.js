(function(){
    'use strict';

    /* TIAGO ESTATU
        tiagoestatu@hotmail.com
        Design adotado "functional programming design"

        /****************************************************************************
         * ************************* FLUXO DA APLICAÇÃO ****************************
         * 
         * $btoFilterByVivaReal || $btoFilterByZap - (eVENTOS)
         *
         *------------------- funções principais no fluxo----------------------------------
         * getResultados()
         * ajaxCaller()
         * mainFunction() - Função controladora do fluxo
         *      checaImoveisValidos() - Função auxiliar
         *      vivaBusinessRules() ou zapBusinessRules() - Validação regras de negócio 
         *      startSessionStoragePrinterOnePage()
         *      controlaRolagemPages()
         *      htmlPrinter() - Rederiza o resultado 
         *                     |- função armazenada em arquivos externo, mesma pasta 'html-template-resultado.js'
         * 
         *------------------- funções auxiliares ------------------------------------
         * 
         * htmlPrinterError()
         * checkCG() - verificar coordenadas Bouding Box
         * calculaValorMetroQuadrado() 
         * checaImoveisValidos() - Elimina os imóveis considerados não elegíveis 
         * percentValorRent() 
         * controlaRolagemPages()
         * timerMsgCarregando()
         * startSessionStoragePrinterOnePage()
         * preparaDetalhes() - Renderiza ficha detalhe do imóveil selecionado
                                |- função armazenada em arquivos externo, mesma pasta 'template-detalhe-imovel.js'
         */  
    
    /* GLOBAIS
    -------------------------------------------------------------------------------*/
    //Armazenando os targets do DOM    
    // TODAS VARIÁVEIS PRECEDIDAS COM O SINAL ($) ARMAZENAM ELEMENTOS (HTML) CAPTURADOS NO DOM 
    
    // BOTÕES  
    const $btoFilterByVivaReal = document.querySelector('#btoFilterByVivaReal');
    const $btoFilterByZap = document.querySelector('#btoFilterByZap');
    const $btoFecharDetalhe = document.querySelector('#fecharDetalhe');
    
     // TARGET NO DOM PARA INSERIR DADOS DA RESPOSTA
    const $insereResultado = document.querySelector('#insereResultado');
    const $btosactionfilter = document.querySelector('#btos-action-filter');
    const $insereDetalheImovel = document.querySelector('#insereDetalheImovel');
    
    

    /* CONFIGURAÇÕES PARA A REALIZAR A REQUISIÇÃO 
    ---------------------------------------------------------------------------------*/
    //URL BASE PARA A CHAMADA = 
        //http://grupozap-code-challenge.s3-website-us-east-1.amazonaws.com/sources/source-1.json
    const urlCalled = "http://grupozap-code-challenge.s3-website-us-east-1.amazonaws.com/sources/source-1.json";

    //HEADER
    const h = new Headers();
    h.append('Accept','application/json');

    // CONTÉM TODOS PARAMETROS PARA O REQUEST
    const requestConfigurado = new Request(urlCalled, {method: 'GET',headers: h, mode: 'cors', cache: 'no-cache'});

    //Recebo a URL que deverá ser "consultada"
    
    const ajaxCaller = async (url) => {
        //URL CHAMADA
        const api_call = await fetch(url);
        
        //Tramento de erro
        if(!api_call.ok){
            //Se o request falhar ERRO CAPTURADO APOS THEN na função getResultados ()
            throw new Error(api_call.status);
            
        }else{
            // Se o status.ok ,
            // Retornamos os dados recebidos
            const data = await api_call.json();
            
            return {data};
        }
    }

     // EXECUTO A CHAMADA PARA FUNÇÃO AJAX 
     const getResultados = (listaType) => {
        
         //Ajax call
         ajaxCaller(requestConfigurado).then((response) => {
            // FUNÇÃO QUE MANIPULA O RESULTADO PARA O OUTPUT
            mainFunction(listaType, response);    
        })
        .catch(err => {
            // Mostra mensagem de erro para o Usuário 
            htmlPrinterError();
            console.log(err);
        })
    }
    
    
    
    /* FUNÇÕES AUXILIARES
    ---------------------------------------------------------------------------------*/
     //FUNÇÃO QUE ESCREVE O HTML A SER PRINTADO QUANDO ERRO NA RESPOSTA DO AJAX
    //Função print mensagem de erro
    const htmlPrinterError = () => {
        //Sempre limpo o conteudo atual antes de escrever 
        $insereResultado.innerHTML ="";
        $insereResultado.innerHTML = `<span class="msgErro">Houston, temos um problema! <br/> Liga pro Andrew que ele manja de JS</span>`;
    }

     

    // Coordenadas para Bounding Box Grupo ZAP
    //minlon: -46.693419
    //minlat -23.568704
    //maxlon: -46.641146
    //maxlat: -23.546686    
    const bBox = {minlon: -46.693419, minlat: -23.568704, maxlon: -46.641146, maxlat: -23.546686}
    
    //FUNÇÃO CHECA BOUNDING AREA
    //TRUE ==  imovel está dentro do bouding
    //FALSE ==  imovel fora do bouding
    const checkCG = (x1, y1, x2, y2, x, y) => {
        if ((x > x1 && x < x2) && (y > y1 && y < y2)) {
            return true;
        }
        else{
            return false; 
        }
    }    

    // RETORNA O VALOR DO METRO QUADRADO DO IMOVEL
    const calculaValorMetroQuadrado = (valorImovel, areaUtil) => {
        let valorMetroQuad = parseInt((valorImovel / areaUtil),10);
        return valorMetroQuad;
    }

    // RETORNA UM ARRAY DE IMÓVEIS CONSIDERADOS,(válidos) ** ELEGIVEIS PARA OS PORTAIS *** 
    // *** CRÍTERIOS MÍNIMOS ***//
    // usableAreas MAIOR QUE 0 (ZERO) E
    // Localização GEO declarada (latitude e longitude)
    const arrayImoveisValidos = [];
    const checaImoveisValidos = (response) => {
        
        response.data.forEach(item => {
            
            // SELEÇÃO DE IMOVEIS 
            // UsableAreas maior que 0 (ZERO) && Cordenadas latitude e Longitude maior que 0 (ZERO)
            if (item.address.geoLocation.location.lat != 0 && item.address.geoLocation.location.lon != 0) {
                arrayImoveisValidos.push(item)
            }   
        })  

        // Session para o carregmento dos detalhes de imóveis
        sessionStorage.setItem('detalhes-imoveis', JSON.stringify(arrayImoveisValidos));    
    }


    // VALIDAÇÃO DO VALOR DO CONDOMINIO COM RELAÇÃO AO VALOR DO ALUGUEL
    const percentValorRent = (txCondo, rentValor) => {
        let valorApurado = parseInt(100 * (txCondo / rentValor));
        
        // SE VALOR DO monthlyCondoFee FOR MENOR QUE 30% EM RELAÇÃO AO VALOR DO ALUGUEL
        // TRUE SERÁ LISTADO 
        if (valorApurado < 30) {
            return true
        }
        else{
            return false;
        }
    } 


    // CONTROLA OS IMÓVEIS CARREGADOS POR DEMANDA
    const controlaRolagemPages = ($insereResultado) => {

        // ARMAZENAGEM LOCAL
        let origemLocalStorage = sessionStorage.getItem('listaImoveisRolagem');
        let recuperadosLocalSession = JSON.parse(origemLocalStorage)
        let loopLimite;


        if (recuperadosLocalSession.length != 0) {
            
            recuperadosLocalSession.length < 19 ? loopLimite = recuperadosLocalSession.length : loopLimite = 20;

            // PREPARO OS PRÓXIMOS IMOVEIS A SEREM CARREGADOS
            const proximaPagina = [];
            for (let i = 0; i < loopLimite; i++) {
                proximaPagina.push(recuperadosLocalSession[i])
            }

            // REMOVER OS 20 IMOVEIS DO ARRAY
            recuperadosLocalSession.splice(0, loopLimite);
            // ARMAZENAR O RESTANTE

            sessionStorage.setItem('listaImoveisRolagem', JSON.stringify(recuperadosLocalSession));
            
            // MOSTRA MSG CARREGANDO MAIS IMÓVEIS
            document.querySelector('#carregandoMaisImoveis').style.display = "block";

            // FUNÇÃO DE OUTPUT DO HTML 
            // ARQUIVO EXTERNO CONTENDO O TEMPLATE DA UI  (html-template-resultado.js)
            htmlPrinter(proximaPagina, $insereResultado)

            // ESCONDE CARREGANDO
            setTimeout(() => timerMsgCarregando(), 2000)
        
        }
    }

    // ESCONDE A MENSAGEM CARREGANDO MAIS IMOVEIS
    const timerMsgCarregando = () => {
         document.querySelector('#carregandoMaisImoveis').style.display = 'none';
    }

    // MOSTRA BOTÃO VOLTAR NA LISTA DE IMOVEIS
    const mostraBotaoVoltar = () => {
        document.querySelector('#btoVoltar').style.display = 'block';
    }

    // BOTÃO FECHAR NA FICHA DETALHE DO IMOVEIS
    const btoFecharDetalhe = () => {
        document.querySelector('#janelaModalDetalheImovel').style.display = 'none';
    }

   
    // INICIA ARMAZENAGEM DOS IMÓVEIS NO LOCALSTORAGE 
    // FAÇO O GERENCIAMENTO DE CONTEÚDO POR DEMANDA  NA FUNÇÃO controlaRolagemPages()
    const startSessionStoragePrinterOnePage = (arrayListaResultados) => {
        const primeiraPagina = [];

        for (let i = 0; i <= 19; i++) {
            primeiraPagina.push(arrayListaResultados[i])
        }

        // REMOVER OS 20 PRIMEIROS IMOVEIS DO ARRAY
        arrayListaResultados.splice(0, 20);
        // ARMAZENAR O RESTANTE
        sessionStorage.setItem('listaImoveisRolagem', JSON.stringify(arrayListaResultados));
        
        // FUNÇÃO DE OUTPUT DO HTML 
        // ARQUIVO EXTERNO CONTENDO O TEMPLATE DA UI  (html-template-resultado.js)
        htmlPrinter(primeiraPagina, $insereResultado)
    }

/*-----------------------------------------------------------------------------------------------*/




    /* ZAP IMÓVEIS
       REGRAS DE NEGÓCIO PARA VALIDAÇÃO PARA TRIAGEM DOS IMOVEIS ZAP
    ---------------------------------------------------------------*/    
    const arrayZapImoveis = [];
    const zapBusinessRules = (arrayImoveisValidos) => {
        
        // VERIFICAÇÃO CADA ITEM DO ARRAY
        arrayImoveisValidos.forEach(item => {
           
            /* imóvel é elegível para o portal ZAP:
            --------------------------------------------------------------------------------
            - Quando o valor do metro quadrado for maior que R$ 3.500,00  (usableAreas / price) 
            - Quando for para venda(SALE) e o valor mínimo acima de R$ 600.000,00
            - Quando for para aluguel(RENTAL) com VALOR mínimo de aluguel acima de R$ 3.500,00.
            ----------------------------------------------------------------------------------*/
            
            /* EXCEÇÃO PARA: IMOVEIS COM VALOR DE VENDA ABAIXO DOS R$600K 
            // SERÃO LISTADOS, SOMENTE QUANDO ESSES ESTIVEREM LOCALIZADOS DENTRO DO (BOUNDING AREA) PRÉ-DETERMINADO
            // POREM COM UM VALOR MÁXIMO DE 10% INFERIOR COM RELAÇÃO AO VALOR PRE-DETERMINADO DE 600K
            // BAIXANDO DE R$ 600.000,00 PARA R$ 540.000,00
            -----------------------------------------------------------------------------------*/

            // Quando for para aluguel(RENTAL) o VALOR mínimo é de R$ 3.500,00.
            if (item.pricingInfos.businessType === 'RENTAL') {
                if (item.pricingInfos.rentalTotalPrice >= 3500) {
                    arrayZapImoveis.push(item)
                }    
            } 
            // VENDA (SALE)
            // Valor do imóvel maior que R$ 540.000,00  (Fazer o filtro das exceções) E
            // valor do metro quadrado maior que R$ 3.500,00 
            if (item.pricingInfos.businessType === 'SALE') {
                if ((item.pricingInfos.price) >= 540000 
                && (calculaValorMetroQuadrado(item.pricingInfos.price, item.usableAreas) > 3500)) 
                {
                    // Está dentro do box bounding ZAP e é inferior a 600K (Exceções)
                    // TRUE (SERÁ LISTADO)
                    if (checkCG(bBox.minlon, bBox.minlat, bBox.maxlon, bBox.maxlan,item.address.geoLocation.location.lon, item.address.geoLocation.location.lat)
                        && (item.pricingInfos.price) < 599999)
                    {
                            arrayZapImoveis.push(item)
                    }
                    // Fora da exceção do box bounding ZAP o valor mínimo volta a ser 600K 
                    if ((item.pricingInfos.price) >= 600000) {
                        arrayZapImoveis.push(item)
                        
                    } 
                }         
            }
         })  
    }



    /* VIVA REAL IMÓVEIS
       REGRAS DE NEGÓCIO PARA VALIDAÇÃO PARA TRIAGEM DOS IMOVEIS VIVA REAL
    ---------------------------------------------------------------*/    
    const arrayVivaImoveis = [];
    const vivaBusinessRules = (arrayImoveisValidos) => {
        // VERIFICAÇÃO CADA ITEM DO ARRAY
        arrayImoveisValidos.forEach(item => {
           
            /* imóvel é elegível para o portal VIVA REAL:
            --------------------------------------------------------------------------------
            - Quando for VENDA o valor máximo é de R$ 700.000,00.
            - Se for para aluguel(RENTAL), 
            - Esse dever ter a taxa de condominio listada (monthlyCondoFee) E
            - O valor da taxa de condominio não ultrapassar 30% do valor do aluguel
            - Imoveis NÃO contendo valor de TAXA CONDOMINIO serão excluidos da seleção 
            ----------------------------------------------------------------------------------*/
            
            /* EXCEÇÃO PARA: IMOVEIS LISTADOS COMO ALUGUEL E COM VALOR DE ATÉ R$6.000,00  
            // ESSES SOMENTE SERÃO INCLUÍDOS SE ESTIVEREM LOCALIZADOS DENTRO DO (BOUNDING AREA) PRÉ-DETERMINADO
            // POREM O VALOR MÁXIMO DO ALUGUEL NÃO DEVE ULTRAPASSAR R$6.000,00  
            // OQUE É EQUIVALENTE A 50% SUPERIOR COM RELAÇÃO AO VALOR PRE-DETERMINADO DE R$4.000,00
            -----------------------------------------------------------------------------------*/
            
            //Quando for VENDA o valor máximo é de R$ 700.000,00.
           if (item.pricingInfos.businessType === 'SALE') {
                if (item.pricingInfos.price <= 700000) {
                    arrayVivaImoveis.push(item)
                }    
            }
            if (
                // Quando for ALUGUEL OS IMOVEIS COM monthlyCondoFee == 0 ou 'undefined' ficam fora da seleção
                (typeof item.pricingInfos.monthlyCondoFee != undefined) 
                && (parseInt(item.pricingInfos.monthlyCondoFee, 10) > 0)) {
                  
                    
                    if(item.pricingInfos.businessType === 'RENTAL') {
                        
                        //VALIDANDO A EXCEÇÃO
                        if (checkCG(bBox.minlon, bBox.minlat, bBox.maxlon, bBox.maxlan,item.address.geoLocation.location.lon, item.address.geoLocation.location.lat)
                        && (item.pricingInfos.rentalTotalPrice) <= 6000 ){
                            
                            // VALIDAÇÃO SE VALOR DO CONDOMINIO É MAIOR INFERIOR A 30% DO ALUGUEL 
                            if (percentValorRent(item.pricingInfos.monthlyCondoFee, item.pricingInfos.rentalTotalPrice)) {
                                arrayVivaImoveis.push(item)
                            }    
                        }
                        // Fora da exceção o valor MÁXIMO volta a ser R$ 4.000,00
                         if ((item.pricingInfos.rentalTotalPrice) <= 4000) {
                            
                            // VALIDAÇÃO SE VALOR DO CONDOMINIO É MAIOR INFERIOR A 30% DO ALUGUEL 
                            if (percentValorRent(item.pricingInfos.monthlyCondoFee, item.pricingInfos.rentalTotalPrice)) {
                                arrayVivaImoveis.push(item)
                            }   
                        } 
                    }
                }
               
        })  
    }

   
    


    /* FUNÇÃO PRINCIPAL QUE GERENCIA TODO O FLUXO DA APLICAÇÃO
    ---------------------------------------------------------------*/ 
    const mainFunction = (listaType, response) => {
        if (listaType === 'viva') {
            
            // EXCLUSÃO DOS IMÓVEIS CONSIDERADOS NÃO ELEGIVEIS PARA AMBOS PORTAIS
            checaImoveisValidos(response);

            // APLICAÇÃO DAS REGRAS DE NEGÓCIO PARA O PORTAL ZAP
            vivaBusinessRules(arrayImoveisValidos);
            
            // RENDERIZAÇÃO DA PRIMEIRA 
            // SE O arrayVivaImoveis FOR < 20 RESULTADOS 
            // htmlPrinter() - DIRETO COM ESSES 20
            // MAIOR QUE 20 RESULTADOS startSessionStoragePrinterOnePage()
            arrayVivaImoveis.length < 20 ? htmlPrinter(arrayVivaImoveis, $insereResultado):startSessionStoragePrinterOnePage(arrayVivaImoveis);
        
        }
        if (listaType === 'zap') {
            
            // EXCLUSÃO DOS IMÓVEIS CONSIDERADOS NÃO ELEGIVEIS PARA AMBOS PORTAIS
            checaImoveisValidos(response);
            
            // APLICAÇÃO DAS REGRAS DE NEGÓCIO PARA O PORTAL ZAP
            zapBusinessRules(arrayImoveisValidos);
            

            // RENDERIZAÇÃO DA PRIMEIRA 
            // SE O arrayVivaImoveis FOR < 20 RESULTADOS 
            // htmlPrinter() - DIRETO COM ESSES 20
            // MAIOR QUE 20 RESULTADOS startSessionStoragePrinterOnePage()
            arrayZapImoveis.length < 20 ? htmlPrinter(arrayZapImoveis, $insereResultado):startSessionStoragePrinterOnePage(arrayZapImoveis);
        }


        // DELEGAÇÃO DE EVENTO CLICK PARA O BOTAO VER DETALHES DEPOIS DO CARREGAMENTO DA LISTA DE RESULTADOS
        $insereResultado.addEventListener( 'click', function(e) {
            // e.target é o elemento clicado
            if (e.target && e.target.classList.contains('btn-primario')) {
                // FUNÇÃO QUE CARREGA DETALHE DO IMÓVEL
                // RECEBE O ID(imovel selecionado) + o DIV destino (janela modal)
                preparaDetalhes(event.target.id, $insereDetalheImovel);
            }
        }, false);
    }
    

    /* EVENTOS
    ---------------------------------------------------------------------------------*/
    //BOTÕES 
    $btoFilterByVivaReal.addEventListener('click', (e) => {
        e.stopPropagation();
        $btosactionfilter.style.display = "none"; 
        getResultados('viva');    
        mostraBotaoVoltar();
    });
    $btoFilterByZap.addEventListener('click', (e) => {
        e.stopPropagation();
        $btosactionfilter.style.display = "none"; 
        getResultados('zap');
        mostraBotaoVoltar();
        
    });

    $btoFecharDetalhe.addEventListener('click', (e) => {
        e.stopPropagation();
        btoFecharDetalhe();
    });

    
    // eVENTO QUE DISPARA O CARREGAMENTO DE MAIS IMÓVEIS
    window.onscroll = (ev) => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            
            // USUÁRIO CHEGOU AO FINAL DA PÁGINA //MOSTRAR MAIS IMÓVEIS
            controlaRolagemPages($insereResultado);
        }
    };
       
})();


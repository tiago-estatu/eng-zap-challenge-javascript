
    const preparaDetalhes = (idimovel, insereDetalheImovel) => {
        
        // RESGATO OS IMOVEIS ARMAZENADOS NA SESSION 
        const arrayDetalheImoveis = sessionStorage.getItem('detalhes-imoveis');
        const listaParaDetalhe = JSON.parse(arrayDetalheImoveis)
        
        // RECEBO O ID DO IMÓVEL QUE SERÁ MOSTRADO NO DETALHE
        const idImovel = idimovel;
        
        // DIV(janela modal) DESTINO PARA ENTREGA DO HTML
        const $insereDetalheImovel = insereDetalheImovel;
        
        // LIMPO O CONTEÚDO ATUAL
        $insereDetalheImovel.innerHTML = '';
        
        
        listaParaDetalhe.forEach(item => {
            
            // VERIFICO QUAL IMÓVEL DEVE BUSCAR AS INFORMAÇÕES
            if (item.id == idImovel) {
               
                // SALE --> VENDA
                // RENT --> ALUGAR
                item.pricingInfos.businessType === 'SALE' ? item.pricingInfos.businessType = 'VENDA': item.pricingInfos.businessType = 'ALUGAR';


                $insereDetalheImovel.insertAdjacentHTML('beforeend',`
                    <div id="fotosDetalhe">
                        <div class="slideshow-container">
                            <img class="fotosImoveis fade" itemprop="photo" content=""  data-indice="0" alt="" src="${item.images[0]}" width="300" height="250">
                            <img class="fotosImoveis fade" itemprop="photo" content=""  data-indice="0" alt="" src="${item.images[1]}" width="300" height="250">
                            <img class="fotosImoveis fade" itemprop="photo" content=""  data-indice="0" alt="" src="${item.images[2]}" width="300" height="250">
                            <img class="fotosImoveis fade" itemprop="photo" content=""  data-indice="0" alt="" src="${item.images[3]}" width="300" height="250">
                            <img class="fotosImoveis fade" itemprop="photo" content=""  data-indice="0" alt="" src="${item.images[4]}" width="300" height="250">
                        </div>
                        <ul class="navegaFotos">
                            <li><span class="btoSetaAnterior"> Anterior </span></li>
                            <li><span class="btoSetaProxima"> Próxima </span></li>
                        </ul>
                    </div>
                    <section class="adressContainer">
                        <h2>
                            <span itemprop="addressLocality">${item.address.city} - ${item.address.neighborhood}</span>
                        </h2>
                    </section>
                    <div id="grupoPrecoContato">
                        <section class="caracteristicasContainer">
                            <div class="preco">
                                <span class="tipoOperacao">${item.pricingInfos.businessType}</span>
                                <ul>
                                    <li><strong>R$ ${new Intl.NumberFormat('de-DE').format(item.pricingInfos.price)},00</strong></li>
                                    <li><span>Condomínio: R$ ${new Intl.NumberFormat('de-DE').format(item.pricingInfos.monthlyCondoFee)},00</span></li>
                                </ul>
                            </div>
                            <ul class="listaCaracts">
                                <li>${item.bedrooms} <em>quartos</em></li>
                                <li>${item.bathrooms} <em>Banheiros</em></li>
                                <li>${item.parkingSpaces} <em>vagas</em></li>
                                <li>${item.usableAreas} <sup>2</sup></li>
                            </ul>
                        </section>
                    </div>
                `);    
            }
        });

        //DISPARA (display:block) na JANELA MODAL;
        document.querySelector('#janelaModalDetalheImovel').style.display = 'block';
        

        // MANIPULA A NAVEGAÇÃO DE FOTOS
        // SEM DÚVIDAS O SLIDESHOW NÃO É A MINHA MELHOR OPÇÃO MAS COMO EU ESTAVA FICANDO SEM TEMPO
        // PEGUEI ESSE "CARINHA" NOS MEUS RASCUNHOS
        /*--------------------------------------------------------------------------------*/
        document.querySelector('.btoSetaAnterior').addEventListener('click', (e) => {
            e.stopPropagation();
            plusSlides(-1);
        });
        document.querySelector('.btoSetaProxima').addEventListener('click', (e) => {
            e.stopPropagation();
            plusSlides(1);
        });


        let slideIndex = 1;
        const plusSlides = (n)=> {showSlides(slideIndex += n)}
        const currentSlide = (n)=> {showSlides(slideIndex = n)}

        const showSlides =(n)=> {
            let i;
            let slides = document.querySelectorAll('.fotosImoveis');
        
            if (n > slides.length) {slideIndex = 1}    
            if (n < 1) {slideIndex = slides.length}
            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";  
            }
            slides[slideIndex-1].style.display = "block";  
        }
        showSlides(slideIndex);
    }
    /*-----------------------------------------------------------------------------------------*/
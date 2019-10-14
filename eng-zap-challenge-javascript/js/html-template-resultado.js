const htmlPrinter = (response, targets) => {
   

    // target representa o DIV reservado para inserção do conteúdo
    // FAÇO LIMPEZA DA DIV AONDE O RESULTADO É INSERIDO
    //target.innerHTML = " ";
    
    response.forEach(item => {
        
        // SALE --> VENDA
        // RENT --> ALUGAR
        item.pricingInfos.businessType === 'SALE' ? item.pricingInfos.businessType = 'VENDA': item.pricingInfos.businessType = 'ALUGAR';
        
        
        // RETORNA O VALOR DO METRO QUADRADO DO IMOVEL
        // ACHEI QUE SERIA INTERESSANTE TER ESSA INFORMAÇÃO NO DETALHE DO IMÓVEL
        let valorMetro = parseInt((item.pricingInfos.price / item.usableAreas),10);
        
        targets.insertAdjacentHTML('beforeend',`
            
            <!-- MAIN CONTAINER PARA CADA IMOVEL -->
            <article class="resultadoBuscaImovelContainer">
            

                <!-- IMAGEM CONTAINER -->
                <figure class="carrossel">
                    <div class="carrossel-container" data-fotos="" data-index="0">
                        <img class="" itemprop="photo" content=""  data-indice="0" alt="" src="${item.images[0]}" width="295" height="250">
                    </div>
                </figure>
                <!-- IMAGEM CONTAINER -->

                <!-- CARACTERISTICAS DO IMOVEL -->
                <section class="caracteristicasContainer">
                    <div class="priceContainer">
                        <a class="priceGroup" href="javascript:void(0)">
                            <span class="tipoOperacao">${item.pricingInfos.businessType}</span>
                            <ul>
                                <li><strong>R$ ${new Intl.NumberFormat('de-DE').format(item.pricingInfos.price)},00</strong></li>
                                <li><span>Condomínio: R$ ${new Intl.NumberFormat('de-DE').format(item.pricingInfos.monthlyCondoFee)},00</span></li>
                            </ul>
                        </a>
                        <ul class="listaCaracteristicas" tabindex="0">
                            <li>${item.bedrooms} <em>quartos</em></li>
                            <li>${item.bathrooms} <em>Banheiros</em></li>
                            <li>${item.parkingSpaces} <em>vagas</em></li>
                            <li>${item.usableAreas} <sup>2</sup></li>
                            <li><em class="metroQuadrado">Metro<sup>2</sup> avalidao em R$ ${new Intl.NumberFormat('de-DE').format(valorMetro)},00 </em></li>
                        </ul>
                    </div>
                </section>
                <!-- /CARACTERISTICAS DO IMOVEL -->


                <!-- ENDEREÇO (lOCALIZAÇÃO FÍSICA) DO IMOVEL -->
                <section class="adressContainer">
                    <a href="javascript:void(0)">
                        <h2>
                            <strong>${item.address.city}</strong>
                            <span itemprop="addressLocality">${item.address.neighborhood}</span>
                        </h2>
                        
                    </a>

                    <div class="btn-user-actions">
                        <button id='${item.id}' class="btn-primario">VER DETALHE</button>
                    </div>
                </section>
                <!-- / ENDEREÇO (lOCALIZAÇÃO FÍSICA) DO IMOVEL -->
            
            </article>
            <!-- /MAIN CONTAINER PARA CADA IMOVEL -->
        
        `);
    });
}
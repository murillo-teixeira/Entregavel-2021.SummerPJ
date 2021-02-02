// Requisição HTTP e montagem do HTML
fetch("https://api.polijunior.com.br/produtos")
    .then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                let productsContent = document.getElementById("products-content");
                for(var product of data){
                    productsContent.innerHTML += `
                    <div class="products-item align-center padding-vertical">
                        <img src="${product.foto}" alt="cafe" width="120" />
                        <h4>${product.nome}</h4>
                        <p class="description">${product.descricao}</p>
                        <div class="grid-infos">
                            <p class="key">Intensidade:</p>
                            <p class = "value">${getIndicadorDeIntensidade(product.intensidade) 
                                                            + "  " + product.intensidade}</p>
                            <p class="key">Preço:</p>
                            <p class = "value">R$ ${parseFloat(product.preco).toFixed(2).replace(".", ",")}</p>
                        </div>
                    </div> `
                }
            });
        } else {
            console.log("Request failed");
        }
    });

// Função responsável pelo dropDown do menu de telas pequenas
function dropDown() {
    var x = document.getElementById("dropdown-content");
    if (x.className.indexOf("dropdown-show") == -1) { 
      x.className += " dropdown-show";
    } else {
      x.className = x.className.replace(" dropdown-show", "");
    }
  }

// Função necessária para criar o botão de dois estados do filtro
  function addCheckedTag(obj) {
    if(obj.className.indexOf("filter-button-checked") == -1) {
        obj.className += " filter-button-checked"
    } else {
        obj.className = obj.className.replace(" filter-button-checked", "");
    }
}

// Função que filtra as cápsulas com base nos inputs do usuário
function filterProducts() {
    var filterButtons = document.getElementsByClassName("filter-button");
    var filterButtonDelicado = false;
    var filterButtonEquilibrado = false;
    var filterButtonIntenso = false;
    var input = document.getElementById("filter-input")
    var filter = input.value.toUpperCase();
    var numberOfHidden = 0;

    for(var i = 0; i < filterButtons.length; i++) {
        if(filterButtons[i].className.indexOf("filter-button-checked") != -1){
            if(filterButtons[i].innerHTML == "Delicado") {
                filterButtonDelicado = true; 
            }
            if(filterButtons[i].innerHTML == "Equilibrado") {
                filterButtonEquilibrado = true; 
            }
            if(filterButtons[i].innerHTML == "Intenso") {
                filterButtonIntenso = true; 
            }
        }
    }

    // Se nenhum botão estiver selecionado não acontece filtragem
    if((filterButtonDelicado || filterButtonEquilibrado || filterButtonIntenso) == false) {
        filterButtonDelicado = true;
        filterButtonEquilibrado = true;
        filterButtonIntenso = true;
    }

    var productsItems = document.getElementsByClassName("products-item");
    for(var i = 0; i < productsItems.length; i++) {
        var intensity = parseInt(productsItems[i].getElementsByClassName("product-intensity")[0].textContent.replace(/[^\d]+/g,''));
        var name = productsItems[i].getElementsByClassName("product-name")[0].textContent;
        productsItems[i].style.display = "none";
        if(intensity >= 1 && intensity <=4 && filterButtonDelicado && name.toUpperCase().indexOf(filter) != -1){
            productsItems[i].style.display = "";
        }
        if(intensity >= 5 && intensity <=7 && filterButtonEquilibrado  && name.toUpperCase().indexOf(filter) != -1){
            productsItems[i].style.display = "";
        }
        if(intensity >= 8 && filterButtonIntenso && name.toUpperCase().indexOf(filter) != -1){
            productsItems[i].style.display = "";
        }
        if(productsItems[i].style.display == "none") numberOfHidden++;
    }

     if(numberOfHidden==productsItems.length) {
        document.getElementById("indicator-filter-return").style.display = "block";
        document.getElementById("invite-to-buy").style.display = "none";
    } else {
        document.getElementById("indicator-filter-return").style.display = "none";
        document.getElementById("invite-to-buy").style.display = "block";
    }
}

// Função para gerar a barra de intensidade
function getIndicadorDeIntensidade(intensidade) {
    var indicadorDeIntensidade = " ■";
    var j;
     for(j = 1; j <= Math.round(intensidade*5/13)-1 && j<=4;j++){
        indicadorDeIntensidade = indicadorDeIntensidade + " ■"; 
    }
     for(var k = 5 - j; k>=1; k--){
         indicadorDeIntensidade = indicadorDeIntensidade + " □"; 
    }
    return indicadorDeIntensidade;
}


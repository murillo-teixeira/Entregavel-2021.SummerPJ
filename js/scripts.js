function addCheckedTag(obj) {
    if(obj.className.indexOf("filter-button-checked") == -1) {
        obj.className += " filter-button-checked"
    } else {
        obj.className = obj.className.replace(" filter-button-checked", "");
    }
}

function dropDown() {
    var x = document.getElementById("dropdown-content");
    if (x.className.indexOf("dropdown-show") == -1) { 
      x.className += " dropdown-show";
    } else {
      x.className = x.className.replace(" dropdown-show", "");
    }
  }

function filterProducts() {
    var filterButtons = document.getElementsByClassName("filter-button");
    var filterButtonDelicado = false; //
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

// Requisição HTTP e montagem do HTML
var url = "https://api.polijunior.com.br/produtos";
fetch(url).then(function(response) {
    if(response.ok) {
        response.json().then(function(data) {
            let bloco = document.getElementById("products-content");
            let nCapsulas = data.length;

            for(var i = 0; i < nCapsulas;i++){
                let divParent = document.createElement("div");
                divParent.className += "products-item align-center padding-vertical";
                divParent.id = "product" + i;

                let img = document.createElement("img");
                img.src = data[i].foto;
                img.alt = "logo" + i;
                img.width="120";

                let name = document.createElement("h4");
                name.innerHTML = data[i].nome;
                name.className += " product-name";

                let descricao = document.createElement("p");
                descricao.classList.add("description");
                descricao.innerHTML = data[i].descricao;

                let divGridInfos = document.createElement("div");
                divGridInfos.classList.add("grid-infos");
                
                let pKeyIntensidade = document.createElement("p");
                pKeyIntensidade.classList.add("key");
                pKeyIntensidade.innerHTML = "Intensidade:"

                let pValueIntensidade = document.createElement("p");
                pValueIntensidade.classList.add("value");
                pValueIntensidade.innerHTML = getIndicadorDeIntensidade(data[i].intensidade) + " " +data[i].intensidade;
                pValueIntensidade.className += " product-intensity";

                let pKeyPreco = document.createElement("p");
                pKeyPreco.classList.add("key");
                pKeyPreco.innerHTML = "Preço:"

                let pValuePreco = document.createElement("p");
                pValuePreco.classList.add("value");
                pValuePreco.innerHTML = "R$ " + parseFloat(data[i].preco).toFixed(2).replace(".", ",");

                let div1 = bloco.appendChild(divParent);
                div1.appendChild(img);
                div1.appendChild(name);
                div1.appendChild(descricao);

                let div2 = div1.appendChild(divGridInfos)
                div2.appendChild(pKeyIntensidade);
                div2.appendChild(pValueIntensidade);
                div2.appendChild(pKeyPreco);
                div2.appendChild(pValuePreco);
            }
        });
    } else {
        console.log("Request failed");
    }
});
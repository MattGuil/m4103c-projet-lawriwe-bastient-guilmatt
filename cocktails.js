const zone_recherche = document.querySelector("#zone_recherche");
const btnFavoris = document.querySelector("#btn-favoris");
const listeFavoris = document.querySelector("#liste-favoris");
const infoVide = document.querySelector(".info-vide");
const etoile = document.querySelector("#etoile");
var notIngrePop = document.querySelector("#NotIngre");

zone_recherche.value = "";
searching();
majListeFav("load", "");

zone_recherche.addEventListener("keydown", function(event){
	//13 est le numéro de "Entrer"
	if (event.keyCode === 13) {
		// Annule le comportement par défaut
		event.preventDefault();
		recherche();
	}
});

function recherche(){

	notIngrePop.classList.remove("show");
	let request = document.getElementById("zone_recherche").value;
	let EncRequest = encodeURIComponent(request);
	ajax_get_request(maj_resultat,"https://www.thecocktaildb.com/api/json/v1/1/filter.php?i="+EncRequest);

}

// pour avoir plus d'info sur un cocktail d'on on a déja l'id'
function recherche_suplementaire_cocktails(id){
	notIngrePop.classList.remove("show"); 
	//let request = document.getElementById("id_cocktail").innerHTML;
	let EncRequest = encodeURIComponent(id);
	ajax_get_request(maj_resultat_ingredients,"https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i="+EncRequest);
}

function rab(){
	var bloc_resultats = document.getElementById('bloc_resultats');
	bloc_resultats.value = "";

	// pour clear les résultats avant de d'en afficher de nouveaux

	var a_suprimer = document.getElementById('resultat');

	// on vérifie que a_suprimer existe
	try {
		a_suprimer.remove();
	} catch(error) {
		//rien d'arrive si il n'y a rien a suprimer
	}
}

function maj_resultat(res){
	// v0 : affiche new text achaque clic (fait)
	// v1 : affiche juste un cocktail de base (fait)
	// v2 affiche la liste des cocktails concerné par l'ingrédients (fait)
	// v3 (existe pas encore) : affiche liste des ingédients par cocktails
	try {
		var obj = JSON.parse(res);
		var bloc_resultats = document.getElementById('bloc_resultats');
 
		// supréssion des résultats pr écédents
		rab();

		let div_general = document.createElement("div");
		div_general.id = "resultat";

		//la boucle
		for(let i = 0; i < obj["drinks"].length; i++)
		{
			//div du cocktail
		let div = document.createElement("div");
		div.id = obj["drinks"][i].idDrink; //id utile pour la recherche des ingrédients par la suite
		div.className = "cocktail";

		//nom du cocktail
		let h3 = document.createElement("h3");
		h3.innerHTML = obj["drinks"][i].strDrink;

		//photo du cocktail
		let img = document.createElement("img");
		img.src = obj["drinks"][i].strDrinkThumb;

		let id_boisson = document.createElement("p");

		id_boisson.id = "id_cocktail"
		id_boisson.innerHTML = obj["drinks"][i].idDrink;

		div.append(h3);
		div.append(id_boisson);
		div.append(img);
		div_general.append(div);

		// pour la liste d'ingredients ATTENTION, NON-FONCTIONNEL probleme dans recherche_suplementaire_cocktails ou maj_resultat_ingredients
		recherche_suplementaire_cocktails(obj["drinks"][i].idDrink)
		// le code continue dans recherche_suplementaire_cocktails puis dans maj_resultat_ingredients dû au callback


		bloc_resultats.append(div_general);
		}
	} catch(error) {
		notIngrePop.classList.add("show");
	}
}

// ajoute la liste des ingedients dans les résultats
function maj_resultat_ingredients(res) {
	var obj = JSON.parse(res);
	// on cherche le div ou on doit injecter la liste des ingedients
	var div_cible = document.getElementById(obj["drinks"][0].idDrink);


	//boucle d'affichage des ingredients
	for (let i = 1; i < 15; i++){
		// affichage d'un ingredient
		let ingredient = document.createElement("p");
		ingredient.id = "ingredient";
		ingredient.innerHTML = obj["drinks"][0][`strIngredient${i}`];
		div_cible.append(ingredient)
	}
	
	//affiche la recette
	let recette = document.createElement("p");
	recette.id = "recette";
	recette.innerHTML = " how to create : " + obj["drinks"][0].strInstructions;
	div_cible.append(recette)
	
}

function majEtoile() {
	if(localStorage.getItem(zone_recherche.value) == null) {
		etoile.setAttribute("src", "images/etoile-vide.svg");
		etoile.setAttribute("alt", "Etoile vide");
	} else {
		etoile.setAttribute("src", "images/etoile-pleine.svg");
		etoile.setAttribute("alt", "Etoile pleine");
	}
}

function majFav() {
	if(zone_recherche.value != "") {
		if(etoile.getAttribute("alt") == "Etoile vide") {
			addFav(zone_recherche.value);
			majEtoile();
		} else {
			removeFav(zone_recherche.value);
			majEtoile();
		}
	}
}

function searching() {
	if(zone_recherche.value == "") {
		btnFavoris.classList.remove("btn_clicable");
	} else {
		btnFavoris.classList.add("btn_clicable");
		majEtoile();
	}
}

function createFavoriItem(favName) {
	const favoriItem = document.createElement("li");
	favoriItem.setAttribute("id", favName);

	const favoriSpan = document.createElement("span");
	favoriSpan.setAttribute("title", "Cliquer pour relancer la recherche");
	favoriSpan.append(favName);
	favoriSpan.setAttribute("onclick", "searchFav(this.innerHTML)");

	const favoriImg = document.createElement("img");
	favoriImg.setAttribute("src", "images/croix.svg");
	favoriImg.setAttribute("alt", "Icone pour supprimer le favori");
	favoriImg.setAttribute("width", "15");
	favoriImg.setAttribute("title", "Cliquer pour supprimer le favori");
	favoriImg.setAttribute("onclick", "removeFav(this.parentNode.firstChild.innerHTML)");

	favoriItem.appendChild(favoriSpan);
	favoriItem.appendChild(favoriImg);

	return favoriItem;
}

function majListeFav(action, favName) {
	if(action == "add") {
		listeFavoris.appendChild(createFavoriItem(favName));
	} else if(action == "remove") {
		listeFavoris.removeChild(listeFavoris.querySelector("#" + favName));
	} else if(action == "load") {
		for(var i = 0; i < localStorage.length; i++) {
			listeFavoris.appendChild(createFavoriItem(localStorage.getItem(localStorage.key(i))));
		}
	}

	if(listeFavoris.children.length == 0) {
		infoVide.style.visibility = "visible";
	} else {
		infoVide.style.visibility = "hidden";
	}
}

function addFav(favToAdd) {
	localStorage.setItem(favToAdd, favToAdd);
	majListeFav("add", favToAdd);
	console.log("Favori ajouté !");
}

function removeFav(favToRemove) {
	localStorage.removeItem(favToRemove);
	majListeFav("remove", favToRemove);
	majEtoile();
	console.log("Favori supprimé !");
}

function searchFav(favToSearch) {
	zone_recherche.value = favToSearch;
	searching();
	majEtoile();
	recherche();
}

// pour l'instant sa sert a rien
function ajax_get_request(callback, url, async = true) {
	// Instanciation d'un objet XHR
	var xhr = new XMLHttpRequest();

	// Définition de la fonction à exécuter à chaque changement d'état
	xhr.onreadystatechange = function(){
		if (callback && xhr.readyState == XMLHttpRequest.DONE
				&& (xhr.status == 200 || xhr.status == 0))
		{
			// Si une fonction callback est définie + que le serveur a fini son travail
			// + que le code d'état indique que tout s'est bien passé
			// => On appelle la fonction callback en passant en paramètre
			//		les données récupérées sous forme de texte brut
			callback(xhr.responseText);
		}
	};

	// Initialisation de l'objet puis envoi de la requête
	xhr.open("GET", url, async);
	xhr.send();
}

const zone_recherche = document.querySelector("#zone_recherche");
const btnFavoris = document.querySelector("#btn-favoris");
const listeFavoris = document.querySelector("#liste-favoris");
const infoVide = document.querySelector(".info-vide");
var notIngrePop = document.querySelector("#NotIngre");

searching();
maj_etat_favoris();

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

function rab(){

    var bloc_resultats = document.getElementById('bloc_resultats');
    bloc_resultats.value = "";

}

function maj_resultat(res){

	// v0 : affiche new text achaque clic (fait)
	// v1 : affiche juste un cocktail de base
	// v2 (existe pas encore) : affiche la liste des cocktails concerné par l'ingrédients
	try{
		var obj = JSON.parse(res);
		var bloc_resultats = document.getElementById('bloc_resultats');

		// boucle a ajouter ensuite

		

		let p = document.createElement("p")
		p.innerHTML = obj["drinks"][0].strDrink;

		bloc_resultats.append(p)
	}catch(error){

		notIngrePop.classList.add("show");
	}



}

function maj_etat_favoris() {
	if(listeFavoris.children.length == 0) {
		infoVide.style.visibility = "visible";
		console.log("liste favoris vide");
	} else {
		infoVide.style.visibility = "hidden";
		console.log("liste favoris non vide");
	}
}

function searching() {
	if(zone_recherche.value == "") {
		btnFavoris.classList.remove("btn_clicable");
	} else {
		btnFavoris.classList.add("btn_clicable");
	}
}

function addFav() {
	const favoriItem = document.createElement("li");

	const favoriSpan = document.createElement("span");
	favoriSpan.setAttribute("title", "Cliquer pour relancer la recherche");
	favoriSpan.append(zone_recherche.value);
	favoriSpan.setAttribute("onclick", "searchFav(this)");

	const favoriImg = document.createElement("img");
	favoriImg.setAttribute("src", "images/croix.svg");
	favoriImg.setAttribute("alt", "Icone pour supprimer le favori");
	favoriImg.setAttribute("width", "15");
	favoriImg.setAttribute("title", "Cliquer pour supprimer le favori");
	favoriImg.setAttribute("onclick", "removeFav(this)");

	favoriItem.appendChild(favoriSpan);
	favoriItem.appendChild(favoriImg);

	listeFavoris.appendChild(favoriItem);

	maj_etat_favoris();

	const cookieName = "fav" + listeFavoris.children.length.toString();
	setCookie(cookieName, zone_recherche.value);

	console.log("Favori ajouté !");
}

function searchFav(fav) {
	zone_recherche.value = fav.innerHTML;
	recherche();
}

function removeFav(fav) {
	listeFavoris.removeChild(fav.parentNode);

	maj_etat_favoris();

	console.log("Favori supprimé !");
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

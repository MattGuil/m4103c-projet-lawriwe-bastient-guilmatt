
function recherche(request){
	maj_resultat()
	let Encdata = encodeURIComponent(data);
	ajax_get_request(maj_resultat,"https://www.thecocktaildb.com/api/json/v1/1/search.php?s="+request);
	





}


function rab(){

    var bloc_resultats = document.getElementById('bloc_resultats');
    bloc_resultats.value = "";

}


function maj_resultat(){
	//var obj = JSON.parse(res);
	// v0 : affiche new text achaque clic (fait)
	// v1 : affiche juste un cocktail de base
	// v2 (existe pas encore) : affiche la liste des cocktails concerné par l'ingrédients
	var bloc_resultats = document.getElementById('bloc_resultats');

	let p = document.createElement("p")
	p.innerHTML = "New text!";
	bloc_resultats.append(p)	
	
	
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

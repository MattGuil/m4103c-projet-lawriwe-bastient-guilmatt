/* Les fonctions ci-dessous sont inspirées des fonctions
		trouvables sur W3Schools : https://www.w3schools.com/js/js_cookies.asp */

/**
	Fonction setCookie pour définir un nouveau Cookie
	dans le navigateur de l'utilisateur
	(en remplaçant le "Path=/" par "SameSite=Lax" comme conseillé dans :
		https://developer.mozilla.org/fr/docs/Web/HTTP/Headers/Set-Cookie/SameSite
	+ en rajoutant le encodeURIComponent() )
*/
function setCookie(cname, cvalue, exdays = 99) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();

    /* Encodage de la valeur pour éviter d'avoir des soucis
        avec certains caractères spéciaux comme :
            => % qui sera transformé en %25
            => & qui sera transformé en %26
                => / qui sera transformé en %2F
    */
    var encodedValue = encodeURIComponent(cvalue);

    document.cookie = cname + "=" + encodedValue + ";" + expires + ";SameSite=Lax";
}

/**
     Fonction getCookie pour récupérer le Cookie
    ayant le nom passé en paramètre
    (Retourne une chaine vide si le Cookie n'existe pas)
*/
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0 ; i < ca.length ; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}

function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}
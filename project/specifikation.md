Funktion 	                 Anrop 	        Metod 	    Parametertyp 	    Exempel 	                Returvärde
Skapa konto                 /createaccount  POST        application/json    { accountname : "name"      
                                                                              password    : "password" }
Logga in                    /loggin         POST        application/json    { accountname : "name"
                                                                              password    : "password" }
hämta alla användare        /users          GET         application/json
skicka vänförfrågan         /users/{id}     POST                                                        HTTP 200
acceptera vänförfrågan      /users/{id}/friends     PATCH                                                       HTTP 200
se sida                     /users/{id}     GET                                                         HTTP 200
Hämta alla vänner           /users/{id}/friends        GET         application/json    { id : "id"}                HTTP 200
Lägga in inlägg             /users/{id}/wall POST
Se inlägg                  /users/{id}/wall  GET        application/json     { message : "message", date: 0 }



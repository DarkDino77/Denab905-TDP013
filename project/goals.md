# Requirments 

## Grade 3 
- [x] Användare ska kunna registrera sig med användarnamn och lösenord.
- [x] Användare ska kunna logga in och logga ut.
- [ ] Lösenord ska inte skickas eller sparas som läsbar text.
- [x] Endast ny informationen ska uppdateras på hemsidan, dvs. hela webbplatsen ska endast laddas om i undantagsfall.
- [x] Det ska finnas en sökfunktion för att hitta andra användare. Man ska kunna söka efter användare även om man bara vet en del av namnet.
- [x] Användare ska kunna lägga skicka vänförfrågningar till andra användare.
- [x] Vänförfrågningar måste accepteras innan man blir vänner.
- [ ] Vänförfrågningar ska inte kunna skickas till användare man redan är vän med.
- [ ] Användare ska kunna se en lista över sina vänner.
- [x] Användare ska ha en personlig sida.
- [ ] Användare ska kunna se sina vänners sidor.
- [ ] Användare ska endast kunna posta meddelanden på sin egen och sina vänners sidor.
- [x] Användare ska inte kunna agera som någon annan, dvs. konton är personliga.
- [x] Nya meddelanden ska valideras på klientsidan. Meddelanden får inte vara tomma eller innehålla fler än 140 tecken.
- [x] Nya meddelanden ska valideras på serversidan enligt samma regler som ovan.
- [x] Inledande och efterföljande whitespace-tecken ska trimmas bort från meddelanden innan validering.
- [x] Data ska sparas i en MongoDB-databas.
- [x] Serversidan ska vara skyddad mot MongoDB-injections.
- [ ] Testning/kodtäckning av backend ska göras med Mocha/Istanbul.
- [ ] Alla element ska placeras på lämpligt sätt i förhållande till varande med lämplig justering av komponenter i höjd- och breddled samt väl valda avstånd mellan komponenter.
- [ ] The Site should look good (CSS requiments)

## Grade 5
- [ ] Möjlighet för vänner att chatta med varandra i realtid med HTML5 WebSockets och socket.io-plugin till NodeJS
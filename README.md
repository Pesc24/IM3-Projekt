# Luftqualität in der Schweiz

## Kurzbeschreibung des Projekts
https://admin.hostpoint.ch/phpmyadmin2/index.php?route=/sql&db=benhan51_etl&table=AirFit&pos=0&server=1806

https://etl.mmp.li/airfit/

https://crontool-frontend.vercel.app/


## Kurzbeschreibung des Projekts

Sportlerinnen und Sportler sollten sich genau Gedanken machen, wann sie Sport im Freien treiben. Konkret können bei körperlicher Anstrengung potenziell viele Schadstoffe in die Bronchien gelangen. Dies insbesondere deshalb, weil beim Sport primär durch den Mund eingeatmet wird. Es sollte möglichst verhindert werden, dass eine grössere Menge Schadstoffe in die Bronchien gelangt. Unsere Website soll den Menschen helfen, den richtigen Zeitpunkt für die nächste sportliche Aktivität im Freien zu finden. Wer nämlich auf die Luftbelastung achtet, macht der persönlichen Gesundheit einen Gefallen. In einem Suchfeld kann man nach seiner Stadt suchen (Hauptstädte in Europa) und erhält dann sämtliche Daten zur Luftqualität und Temperatur.

 

## Benutzte Ressourcen

- GitHub

- GitHub Copilot

- Visual Studio Code

- OpenAI ChatGPT4.0

- Aqicn.org

- CronTool

- phpMyAdmin

- chart.js

- w3schools.com

- google icons

- google fonts

- wenige Code Fragmente aus Thomas & Pascals Resourcen von anderen Projekten

## APIS:
waqi.info (Temperatur & Luftqualität)
carto.com für die Karte
(chart.js)



## Erklärungen

 - PHP: config.php & etl.php sind aus technischen & funktionsgründen beide im etl Ordner, die beiden Scripte die aus der Datenbank dinge lesen im DataFetcher Ordner (einer liest alles im gesammten zeitraum, anderes letze 24h)

- JavaScript: capitals.js = array von allen Städten, script.js = alles was die Datenbank& PHP bezogen ist, search.js ist datenbank frei und ist das popup mit Städte Vorschlägen



## Learnings

Eines unserer Haupt-Learnings: Beim Programmieren braucht es viel Geduld – und Mut zur Lösung. So mussten wir an gewissen Stellen des Codes immer wieder herumexperimentieren, bis es endlich geklappt hatte, wie wir es uns vorgestellt hatten. Gleichzeitig mussten wir uns aber auch von gewissen Ideen verabschieden, weil wir sie innerhalb einer nützlichen Frist nicht wunschgemäß hingebracht hätten. Ganz allgemein.


## Funktionen
Suche: Der User*in(im weiteren wir der generische Maskulin verwendet, sollte jedoch alle Genderform inkludieren) kann anhand drei Möglichkeiten einen Standort suchen: Über das Klicken auf der Karte, vollständige Eingabe im Suchfeld oder dem Suchvorschlag. Bei einer Eingabe von einem Standort bei welchem keine Daten existieren erscheint ein Alert Pop up.  Der User sieht eine Total Score welcher sich aus Luftverschmutung & Temperatur zusammen setzt, Luftverschmutzungsskala im Detail, sowie auch Temperaturskala und einem Grafen über den Totalscore. 


- Responsive: Die Seite ist resposive und wurde anhand vom chrome inspector auf iPhone XR, iPhone 12 Pro, iPhone 14 Pro Max geprüft, sowie auch auf einem Realen Telefon: Xiaomi Redmi Note 13 Pro 5G. Auf diesen Geräten kann eine gute Ansicht garantiert werden. 

- W3 Validator: Die seiten wurden w3 validiert

- Lighthouse: Die Seiten wurden Lighthouse validiert
 

## Schwierigkeiten

Das Projekt bereitete uns ein paar Schwierigkeiten. Zwischendurch hatten wir Mühe, unsere Ideen im Code umzusetzen. Zum Beispiel stellte das Aufsetzen der Datenbank eine grosse Hürde dar. Bis die Daten richtig in die Datenbank transportiert wurden, hatte es mehrere Anläufe gebraucht. Schwierigkeiten hatten wir unter anderem mit unserer Karte von Mapbox. Beim Programmieren merkten wir, dass Mapbox gewisse Funktionen nicht zulässt. Aus diesem Grund haben wir Mapbox durch den einen anderen Anbieter ersetzt. Eine weitere Schwierigkeit war es unter anderem, dass nicht alle Länder unsere gewünschten Daten aufzeichnen. Nicht alle Länder zeichnen im gleichen Tackt Daten auf. Gewisse Zeichnen gar keine Daten auf. Die API hat gewisse Datenlücken.
# Luftqualität für die nächste Sporteinheit

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

- wenige Code-Fragmente aus anderen Projekten von Thomas & Pascal 

## APIS:
waqi.info (Temperatur & Luftqualität)
carto.com für die Karte
(chart.js)


## Erklärungen

PHP: config.php und etl.php sind aus technischen und funktionalen Gründen beide im etl-Ordner. Die beiden Skripte, welche Daten aus der Datenbank lesen, befinden sich im DataFetcher-Ordner (eines liest Daten über den gesamten Zeitraum, das andere die Daten der letzten 24 Stunden).
- JavaScript: capitals.js = array von allen Städten, script.js = alles was die Datenbank& PHP bezogen ist, search.js ist datenbank frei und ist das popup mit Städte Vorschlägen

## Learnings

Eines unserer Haupt-Learnings: Beim Programmieren braucht es viel Geduld – und Mut zur Lösung. So mussten wir an gewissen Stellen des Codes immer wieder herumexperimentieren, bis es endlich geklappt hatte, wie wir es uns vorgestellt hatten. Gleichzeitig mussten wir uns aber auch von gewissen Ideen verabschieden, weil wir sie innerhalb einer nützlichen Frist nicht wunschgemäß hingebracht hätten.

## Funktionen
Suche: Die User*in (im Folgenden wird der generische Maskulinum verwendet, soll jedoch alle Genderformen inkludieren) kann auf drei Arten einen Standort suchen: Durch Klicken auf die Karte, vollständige Eingabe im Suchfeld oder durch den Suchvorschlag. Bei der Eingabe eines Standorts, für den keine Daten existieren, erscheint ein Alert-Pop-up. Der User sieht einen Gesamtscore, der sich aus Luftverschmutzung und Temperatur zusammensetzt, eine detaillierte Skala zur Luftverschmutzung, eine Temperaturskala sowie einen Graphen über den Gesamtscore.


Responsive: Die Seite ist responsive und wurde mithilfe des Chrome Inspectors auf den Geräten iPhone XR, iPhone 12 Pro und iPhone 14 Pro Max geprüft, sowie auf einem realen Telefon: Xiaomi Redmi Note 13 Pro 5G. Auf diesen Geräten kann eine gute Ansicht garantiert werden.

- W3 Validator: Die Seiten wurden w3-validiert

- Lighthouse: Die Seiten wurden mit Lighthouse validiert
 

## Schwierigkeiten

Das Projekt bereitete uns ein paar Schwierigkeiten. Zwischendurch hatten wir Mühe, unsere Ideen im Code umzusetzen. Zum Beispiel stellte das Aufsetzen der Datenbank eine grosse Hürde dar. Bis die Daten richtig in die Datenbank transportiert wurden, brauchte es mehrere Anläufe. Schwierigkeiten hatten wir unter anderem mit unserer Karte von Mapbox. Beim Programmieren merkten wir, dass Mapbox gewisse Funktionen nicht zulässt. Aus diesem Grund haben wir Mapbox durch einen anderen Anbieter ersetzt. Eine weitere Schwierigkeit war, dass nicht alle Länder unsere gewünschten Daten aufzeichnen. Nicht alle Länder zeichnen im gleichen Takt Daten auf, manche zeichnen gar keine Daten auf. Die API weist gewisse Datenlücken auf.
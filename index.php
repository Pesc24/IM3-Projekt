<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <title>Luftqualität in der Schweiz</title>
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <header>
        <h1 class="center">AirFit - atme nicht auf, trainiere durch</h1>
    </header>
    <main>
        <!-- Search field to input city name -->
        <input type="text" class="center" id="city-search" placeholder="Stadt suchen..." />
        <button onclick="searchCity()">Suchen</button>
        <div id="map" class="map"></div>




        <!-- Legend for air quality scale -->
        <div class="container">
            <h3>Luftqualitätsskala</h3>
            <!--THis is data from fetch_air_data.php-->
            <div id="air-quality-data">
                <p>Loading data...</p>
            </div>
            <div id="legend">
                <p><span class="legend-color" style="background-color: #00e400;"></span> <strong>SEHR GUT (0-50)</strong></p>
                <p><span class="legend-color" style="background-color: #ffff00;"></span> <strong>GUT (50-100)</strong></p>
                <p><span class="legend-color" style="background-color: #ff7e00;"></span> <strong>MITTELMÄSSIG (101-150)</strong></p>
                <p><span class="legend-color" style="background-color: #ff0000;"></span> <strong>AUSREICHEND (151-200)</strong></p>
                <p><span class="legend-color" style="background-color: #99004c;"></span> <strong>SCHLECHT (201-300)</strong></p>
                <p><span class="legend-color" style="background-color: #7e0023;"></span> <strong>SEHR SCHLECHT (>300)</strong></p>
            </div>
            </div>

            <div class="container">
            <h3>Temperatur</h3>
            <!--THis is data from fetch_air_data.php-->
            <div id="temperature-data">
                <p>Loading data...</p>
            </div>
            <div id="legend">
                <p><span class="legend-color" style="background-color: #00e400;"></span> <strong>Zu Kalt (0-15)</strong></p>
                <p><span class="legend-color" style="background-color: #ffff00;"></span> <strong>Etwas Kalt (16-19)</strong></p>
                <p><span class="legend-color" style="background-color: #ff7e00;"></span> <strong>Perfekt (20-25)</strong></p>
                <p><span class="legend-color" style="background-color: #ff0000;"></span> <strong>AUSREICHEND (26-32)</strong></p>
                <p><span class="legend-color" style="background-color: #99004c;"></span> <strong>Zu Heiss(32-40)</strong></p>
            </div>
            </div>
    </main>
    <footer class="margin-15">
        <p><a href="mailto:contact@airquality.ch">Kontakt</a></p>
        <p>Adresse: Beispielstraße 1, 8000 Zürich, Schweiz</p>
    </footer>

<script src="js/script.js"></script>
</body>
</html>
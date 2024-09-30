mapboxgl.accessToken = 'pk.eyJ1Ijoic2NodWxwcm9qZWt0MjAyNCIsImEiOiJjbHdxZWI1dGowMWhsMmpzNmtuYmNhMGI0In0.u8jyMsLRqxqj78upp4Cjaw';
const aqicnAPIKey = '655cf8594024de05dbc820f980aba37f23e6d059'; // Your AQICN API key
let map;
let markers = [];

//List of European capitals with their coordinates
const europeanCapitals = [
    { name: "Berlin", lat: 52.5200, lon: 13.4050 },      // Germany
    { name: "Paris", lat: 48.8566, lon: 2.3522 },        // France
    { name: "Rome", lat: 41.9028, lon: 12.4964 },        // Italy
    { name: "Madrid", lat: 40.4168, lon: -3.7038 },      // Spain
    { name: "London", lat: 51.5074, lon: -0.1278 },      // United Kingdom
    { name: "Vienna", lat: 48.2082, lon: 16.3738 },      // Austria
    { name: "Brussels", lat: 50.8503, lon: 4.3517 },     // Belgium
    { name: "Amsterdam", lat: 52.3676, lon: 4.9041 },    // Netherlands
    { name: "Copenhagen", lat: 55.6761, lon: 12.5683 },  // Denmark
    { name: "Lisbon", lat: 38.7223, lon: -9.1393 },      // Portugal
    { name: "Athens", lat: 37.9838, lon: 23.7275 },      // Greece
    { name: "Helsinki", lat: 60.1695, lon: 24.9355 },    // Finland
    { name: "Oslo", lat: 59.9139, lon: 10.7522 },        // Norway
    { name: "Stockholm", lat: 59.3293, lon: 18.0686 },   // Sweden
    { name: "Bern", lat: 46.9480, lon: 7.4481 },         // Switzerland
    { name: "Warsaw", lat: 52.2297, lon: 21.0122 },      // Poland
    { name: "Prague", lat: 50.0755, lon: 14.4378 },      // Czech Republic
    { name: "Budapest", lat: 47.4979, lon: 19.0402 },    // Hungary
    { name: "Sofia", lat: 42.6977, lon: 23.3219 },       // Bulgaria
    { name: "Bucharest", lat: 44.4268, lon: 26.1025 },   // Romania
    { name: "Dublin", lat: 53.3498, lon: -6.2603 },      // Ireland
    { name: "Reykjavik", lat: 64.1466, lon: -21.9426 },  // Iceland
    { name: "Luxembourg", lat: 49.6117, lon: 6.1319 },   // Luxembourg
    { name: "Ljubljana", lat: 46.0569, lon: 14.5058 },   // Slovenia
    { name: "Zagreb", lat: 45.8150, lon: 15.9819 },      // Croatia
    { name: "Bratislava", lat: 48.1486, lon: 17.1077 },  // Slovakia
    { name: "Tallinn", lat: 59.4370, lon: 24.7536 },     // Estonia
    { name: "Riga", lat: 56.9496, lon: 24.1052 },        // Latvia
    { name: "Vilnius", lat: 54.6872, lon: 25.2797 },     // Lithuania
    { name: "Valletta", lat: 35.8997, lon: 14.5146 },    // Malta
    { name: "Nicosia", lat: 35.1856, lon: 33.3823 },     // Cyprus
    { name: "Andorra la Vella", lat: 42.5063, lon: 1.5218 }, // Andorra
    { name: "Monaco", lat: 43.7384, lon: 7.4246 },       // Monaco
    { name: "San Marino", lat: 43.9333, lon: 12.4500 },  // San Marino
    { name: "Vaduz", lat: 47.1416, lon: 9.5215 },        // Liechtenstein
    { name: "Minsk", lat: 53.9006, lon: 27.5590 },       // Belarus
    { name: "Sarajevo", lat: 43.8563, lon: 18.4131 },    // Bosnia and Herzegovina
    { name: "Skopje", lat: 41.9981, lon: 21.4254 },      // North Macedonia
    { name: "Podgorica", lat: 42.4304, lon: 19.2594 },   // Montenegro
    { name: "Belgrade", lat: 44.7866, lon: 20.4489 },    // Serbia
    { name: "Tirana", lat: 41.3275, lon: 19.8189 },      // Albania
    { name: "Chisinau", lat: 47.0105, lon: 28.8638 },    // Moldova
    { name: "Kiev", lat: 50.4501, lon: 30.5234 },        // Ukraine
    { name: "Moscow", lat: 55.7558, lon: 37.6173 },      // Russia
    { name: "Tbilisi", lat: 41.7151, lon: 44.8271 },     // Georgia
    { name: "Yerevan", lat: 40.1792, lon: 44.4991 },     // Armenia
    { name: "Baku", lat: 40.4093, lon: 49.8671 },        // Azerbaijan
    { name: "Vatican City", lat: 41.9029, lon: 12.4534 } // Vatican City
];

function initMap() {
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [10.4515, 51.1657], // Centered on Europe
        zoom: 4
    });

    fetchAirQualityData();
    setInterval(fetchAirQualityData, 7200000); // Update every 2 hours

    document.getElementById('city-search').addEventListener('change', function(event) {
        const searchTerm = event.target.value.toLowerCase();
        if (searchTerm.length > 2) {
            fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchTerm)}.json?access_token=${mapboxgl.accessToken}&types=place&limit=1`)
                .then(response => response.json())
                .then(data => {
                    if (data.features && data.features.length > 0) {
                        const city = data.features[0];
                        map.flyTo({
                            center: city.center,
                            zoom: 12,
                            speed: 1.5, // Adjust the speed of the animation
                            curve: 1 // Adjust the curve of the animation
                        });

                        // Optional: Update city info
                        const cityInfo = document.getElementById('city-info');
                        cityInfo.innerHTML = `<h3>${city.place_name}</h3>`;
                    } else {
                        alert('Keine Stadt gefunden.');
                    }
                })
                .catch(error => console.error('Fehler beim Abrufen der Daten:', error));
        }
    });
}

function fetchAirQualityData() {
    fetch(`https://api.waqi.info/map/bounds/?latlng=35.0,-10.0,70.0,40.0&token=${aqicnAPIKey}`)
        .then(response => response.json())
        .then(data => {
            // This will store the country we already added a station for
            const countriesAdded = new Set();

            const filteredStations = data.data.filter(station => {
                return europeanCapitals.some(capital => {
                    const distance = Math.sqrt(
                        Math.pow(station.lat - capital.lat, 2) +
                        Math.pow(station.lon - capital.lon, 2)
                    );
                    // Find the country that matches the capital and station
                    if (distance < 0.5 && !countriesAdded.has(capital.name)) {
                        countriesAdded.add(capital.name); // Mark this country as added
                        return true; // Include this station
                    }
                    return false; // Skip this station
                });
            });

            updateMap(filteredStations);
        })
        .catch(error => console.error('Fehler beim Abrufen der Daten:', error));
}

function updateMap(stations) {
    markers.forEach(marker => marker.remove());
    markers = [];

    stations.forEach(station => {
        if (station.lat && station.lon) {
            const el = document.createElement('div');
            el.className = 'marker';
            el.style.backgroundColor = '#00e400';
            el.style.width = '20px';
            el.style.height = '20px';
            el.style.borderRadius = '50%';

            const marker = new mapboxgl.Marker(el)
                .setLngLat([station.lon, station.lat])
                .setPopup(new mapboxgl.Popup({ offset: 25 })
                    .setHTML(`<div>
                        <h2>${station.station.name}</h2>
                        <p>Luftqualität: AQI ${station.aqi}</p>
                        <canvas id="chart-${station.uid}" width="400" height="200"></canvas>
                    </div>`))
                .addTo(map);

            marker.getElement().addEventListener('click', () => {
                const chartId = `chart-${station.uid}`;
                setTimeout(() => {
                    const canvasElement = document.getElementById(chartId);
                    if (canvasElement) {
                        displayChart(chartId, station);
                    } else {
                        console.error(`Canvas with id ${chartId} not found`);
                    }
                }, 300);
            });

            markers.push(marker);
        }
    });
}

function displayChart(chartId, station) {
    const ctx = document.getElementById(chartId).getContext('2d');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
                datasets: [{
                    label: 'Luftqualität',
                    data: Array(12).fill(station.aqi), // Example values, replace with real historical data
                    backgroundColor: 'rgba(2, 119, 189, 0.2)',
                    //borderColor: 'rgba(2, 119, 189, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } else {
        console.error(`Canvas with id ${chartId} not found`);
    }
}

// Export functions for testing
window.initMap = initMap;
window.fetchAirQualityData = fetchAirQualityData;
window.updateMap = updateMap;
window.displayChart = displayChart;

// Initialize the map
document.addEventListener('DOMContentLoaded', initMap);

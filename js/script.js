let map;
let markers = [];

// List of European capitals with their coordinates
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
    map = L.map('map').setView([51.1657, 10.4515], 4); // Centered on Europe

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add markers for European capitals
    europeanCapitals.forEach(capital => {
        const marker = L.circleMarker([capital.lat, capital.lon], {
            radius: 5,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map).bindPopup(`<b>${capital.name}</b>`);
        markers.push(marker);
    });
}

// Initialize the map
document.addEventListener('DOMContentLoaded', initMap);









//COMMUNICATION WITH SERVER AND PHP FILE ../ fetch_air_data.php

 // JavaScript to handle city search and form submission
// JavaScript to handle city search and form submission
function searchCity() {
    var city = document.getElementById('city-search').value;
    if (city) {
        fetchData(city);
    } else {
        alert('Please enter a city name');
    }
}

// Fetch air quality and temperature data from the server
function fetchData(city) {
    // Make a POST request to fetch_air_data.php with the city name
    fetch('fetch_air_data.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ 'city_name': city })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById('air-quality-data').innerHTML = `<p>${data.error}</p>`;
            document.getElementById('temperature-data').innerHTML = `<p>${data.error}</p>`;
        } else {
            // Update the air quality section
            document.getElementById('air-quality-data').innerHTML = `
                <p><strong>Air Quality Information:</strong></p>
                <ul>
                    <li>AQI: ${data.aqi}</li>
                    <li>PM2.5: ${data.pm25} µg/m³</li>
                    <li>PM10: ${data.pm10} µg/m³</li>
                    <li>O3: ${data.o3} µg/m³</li>
                </ul>
                <p>The average pollution level: ${data.pollution_avg} µg/m³</p>
            `;
            
            // Update the temperature section
            document.getElementById('temperature-data').innerHTML = `
                <p>The temperature in ${city} on ${data.recorded_time} was ${data.temperature}°C.</p>
            `;
        }
    })
    .catch(error => {
        document.getElementById('air-quality-data').innerHTML = `<p>Error: ${error.message}</p>`;
        document.getElementById('temperature-data').innerHTML = `<p>Error: ${error.message}</p>`;
    });
}

// On page load, fetch data for the default city (Berlin)
window.onload = function() {
    fetchData('Berlin');
};

let map;
let markers = [];

// TOTAL SCORE COLOR TO BE USED ON THE MAP ASWELL
function getScoreColor(roundedScore) {
    let scoreColor;
    if (roundedScore >= 8 && roundedScore <= 10) {
        scoreColor = 'lightgreen';
    } else if (roundedScore >= 4 && roundedScore <= 7) {
        scoreColor = 'orange';
    } else if (roundedScore >= 1 && roundedScore <= 3) {
        scoreColor = 'red';
    }
    else {
        scoreColor = 'grey';
    }
    return scoreColor;
}

// Fetch air quality and temperature data from the server
function fetchData(city) {
    fetch('DataFetcher/fetch_air_data.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ 'city_name': city })
    })
        .then(response => response.json())
        //TOTAL SCORE
        .then(data => {
            if (data.error) {
                document.getElementById('air-quality-data').innerHTML = `<p>${data.error}</p>`;
                document.getElementById('temperature-data').innerHTML = `<p>${data.error}</p>`;
                document.getElementById('total-score-data').innerHTML = `<p>${data.error}</p>`;
            } else {
                let pollutionColor;
                if (data.pollution_avg >= 0 && data.pollution_avg <= 50) {
                    pollutionColor = 'lightgreen';
                } else if (data.pollution_avg >= 51 && data.pollution_avg <= 100) {
                    pollutionColor = 'yellow';
                } else if (data.pollution_avg >= 101 && data.pollution_avg <= 150) {
                    pollutionColor = 'orange';
                } else if (data.pollution_avg >= 151 && data.pollution_avg <= 200) {
                    pollutionColor = 'red';
                } else if (data.pollution_avg >= 201 && data.pollution_avg <= 300) {
                    pollutionColor = 'purple';
                } else if (data.pollution_avg > 300) {
                    pollutionColor = 'darkred';
                }

                document.getElementById('air-quality-data').innerHTML = `
                <b>
                    <p style="background-color: ${pollutionColor};" class="infobox">${data.pollution_avg} µg/m³</p>
                </b><br>
                <div class="container" id="detail-container">
                    <h4>Detail:</h4>
                    <ul>
                        <li>PM2.5: ${data.pm25} µg/m³</li>
                        <li>PM10: ${data.pm10} µg/m³</li>
                        <li>O3: ${data.o3} µg/m³</li>
                    </ul>
                </div>
            `;

                let temperatureColor;
                if (data.temperature >= 0 && data.temperature <= 15) {
                    temperatureColor = 'darkblue';
                    document.getElementById('temperature-data').style.color = 'white';
                } else if (data.temperature >= 16 && data.temperature <= 19) {
                    temperatureColor = 'lightblue';
                } else if (data.temperature >= 20 && data.temperature <= 24) {
                    temperatureColor = 'lightgreen';
                } else if (data.temperature >= 25 && data.temperature <= 32) {
                    temperatureColor = 'orange';
                } else if (data.temperature >= 33 && data.temperature <= 40) {
                    temperatureColor = 'red';
                    document.getElementById('temperature-data').style.color = 'white';
                }

                document.getElementById('temperature-data').innerHTML = `
                <span style="background: ${temperatureColor};" class="infobox">
                    ${data.temperature}°C
                </span>
            `;

                let roundedScore = Math.round(data.tot_score);
                let scoreColor = getScoreColor(roundedScore);

                document.getElementById('total-score-data').innerHTML = `
                <span style="background-color: ${scoreColor};" class="infobox"> <b>${roundedScore}</b></span>
            `;
                //Upper case the city name and display it
                document.getElementById('currentCity').innerHTML = `<h2>CURRENT CITY: ${city.toUpperCase()}</h2>`;

                // Set the marker on the map
                setCityMarker(city, data.lat, data.lon, roundedScore, scoreColor);
            }

            // Fetch last 24 hours data for the city
            fetchLast24HoursData(city);
        })
        .catch(error => {
            document.getElementById('air-quality-data').innerHTML = `<p>Error: ${error.message}</p>`;
            document.getElementById('temperature-data').innerHTML = `<p>Error: ${error.message}</p>`;
            document.getElementById('total-score-data').innerHTML = `<p>Error: ${error.message}</p>`;
        });
}

// Set a marker on the map for the searched city
function setCityMarker(city, lat, lon, score, scoreColor) {
    // Use fallback coordinates if the API didn't return them
    if (!lat || !lon) {
        const cityData = europeanCapitals.find(c => c.name.toLowerCase() === city.toLowerCase());
        if (cityData) {
            lat = cityData.lat;
            lon = cityData.lon;
            console.log(`Using predefined coordinates for ${city}: ${lat}, ${lon}`);
        } else {
            alert(`Coordinates not found for ${city}, and no fallback available.`);
            return;
        }
    }

    const marker = L.circleMarker([lat, lon], {
        radius: 5,
        fillColor: scoreColor,
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }).addTo(map).bindPopup(`<b>${city}</b> (Score: ${score})`);

    marker.openPopup();  // Automatically open the popup for the searched city

    // Center the map on the searched city
    map.setView([lat, lon]);

    // Add the marker to the markers array if needed
    markers.push(marker);
}

// Fetch last 24 hours data for chart
function fetchLast24HoursData(city) {
    fetch('DataFetcher/fetch_last_24_hours_data.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ 'city_name': city })
    })
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                console.error("No data available for the last 24 hours.");
                return;
            }

            const labels = data.map(entry => entry.recorded_time);
            const totalScores = data.map(entry => entry.tot_score);

            // Ensure the container is cleared before adding the chart
            const container = document.getElementById('chart-container');
            container.innerHTML = '';  // Clear any previous chart

            // Create a new canvas for the chart
            const canvas = document.createElement('canvas');
            canvas.id = 'totalScoreChart';
            container.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Total Score',
                        data: totalScores,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 2,
                        fill: false
                    }]
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Timestamps'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Total Score (1 - 10)'
                            },
                            min: 1,
                            max: 10
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error("Error: ", error);
            alert("An error occurred while fetching the last 24 hours data.");
        });
}

// On page load, fetch data for the default city (Berlin)
window.onload = function () {
    fetchData('Berlin');
};

// Add event listener for the Enter key on the city search input
document.getElementById('city-search').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchCity();
    }
});

document.getElementById('search').addEventListener('click', function () {
    searchCity();
});

// City search function
function searchCity() {
    var city = document.getElementById('city-search').value;
    if (city) {
        fetchData(city);
    } else {
        alert('Please enter a city name');
    }
}

// Check if the entered city is a capital city
function isCapitalCity(city) {
    const capitalCities = europeanCapitals.map(capital => capital.name.toLowerCase());
    return capitalCities.includes(city.toLowerCase());
}

// Modify the searchCity function to show a popup if the entered city is not a capital city
function searchCity() {
    var city = document.getElementById('city-search').value;
    if (city) {
        if (isCapitalCity(city)) {
            fetchData(city);
        } else {
            alert('No data found. Please make sure that you have entered a capital city');
        }
    } else {
        alert('Please enter a city name');
    }
}

// Initialize the map
function initMap() {
    // Initialize the map with zooming disabled but dragging enabled
    map = L.map('map', {
        center: [51.1657, 10.4515], // Centered on Europe
        zoom: 4,
        zoomControl: false, // Disable zoom control buttons
        scrollWheelZoom: false, // Disable scroll wheel zoom
        doubleClickZoom: false, // Disable double-click zoom
        boxZoom: false, // Disable box zoom
        dragging: true // Enable map dragging
    });

    // Add CartoDB Positron tile layer for better country visibility
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/attributions">CartoDB</a> contributors'
    }).addTo(map);

    // For each capital, fetch the score from the server
    europeanCapitals.forEach(capital => {
        fetch('DataFetcher/fetch_air_data.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ 'city_name': capital.name })
        })
            .then(response => response.json())
            .then(data => {
                let roundedScore = Math.round(data.tot_score);
                let scoreColor = getScoreColor(roundedScore);

                const marker = L.circleMarker([capital.lat, capital.lon], {
                    radius: 5,
                    fillColor: scoreColor,
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                }).addTo(map).bindPopup(`<b>${capital.name}</b> (Score: ${roundedScore})`);

                marker.on('click', function () {
                    fetchData(capital.name); // Fetch data when marker is clicked
                    document.getElementById('city-search').value = capital.name;
                });

                markers.push(marker);
            })
            .catch(error => {
                console.error(`Error fetching data for ${capital.name}:`, error);
            });
    });
}

document.addEventListener('DOMContentLoaded', initMap);

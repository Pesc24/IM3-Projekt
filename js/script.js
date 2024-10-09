let map;
let markers = [];

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

        // Add click event to the marker
        marker.on('click', function () {
            // Fetch data for the clicked city
            fetchData(capital.name);
            document.getElementById('city-search').value = capital.name; // Update city name in search box
        });

        markers.push(marker);
    });
}

// Initialize the map
document.addEventListener('DOMContentLoaded', initMap);

// JavaScript to handle city search and form submission
function searchCity() {
    var city = document.getElementById('city-search').value;
    if (city) {
        fetchData(city);
    } else {
        alert('Please enter a city name');
    }
}

// Add event listener for the Enter key on the city search input
document.getElementById('city-search').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchCity();
    }
});

// Fetch air quality and temperature data from the server
function fetchData(city) {
    // Make a POST request to fetch_air_data.php with the city name
    fetch('fetch_air_data.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ 'city_name': city })
    }) //POLLUTION
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('air-quality-data').innerHTML = `<p>${data.error}</p>`;
                document.getElementById('temperature-data').innerHTML = `<p>${data.error}</p>`;
                document.getElementById('total-score-data').innerHTML = `<p>${data.error}</p>`;
            } else {

                // Determine the color based on AQI value
                // Determine the color based on pollution_avg value
                let pollutionColor;
                if (data.pollution_avg >= 0 && data.pollution_avg <= 50) {
                    pollutionColor = 'lightgreen'; // SEHR GUT
                } else if (data.pollution_avg >= 51 && data.pollution_avg <= 100) {
                    pollutionColor = 'yellow'; // GUT
                } else if (data.pollution_avg >= 101 && data.pollution_avg <= 150) {
                    pollutionColor = 'orange'; // MITTELMÄSSIG
                } else if (data.pollution_avg >= 151 && data.pollution_avg <= 200) {
                    pollutionColor = 'red'; // AUSREICHEND
                } else if (data.pollution_avg >= 201 && data.pollution_avg <= 300) {
                    pollutionColor = 'purple'; // SCHLECHT
                } else if (data.pollution_avg > 300) {
                    pollutionColor = 'darkred'; // SEHR SCHLECHT
                }

                // Update the air quality section with color and data
                document.getElementById('air-quality-data').innerHTML = `

            ${city}<br />
                <p style="background-color: ${pollutionColor};" class="infobox">${data.pollution_avg} µg/m³</p><br>
               
                <div class="container">
                <h4>Detail:</h4>
                 <ul>
                    <li>PM2.5: ${data.pm25} µg/m³</li>
                    <li>PM10: ${data.pm10} µg/m³</li>
                    <li>O3: ${data.o3} µg/m³</li>
                 </ul>
                </div>
   
        `;

                // temperature
                let temperatureColor;
                if (data.temperature >= 0 && data.temperature <= 15) {
                    temperatureColor = 'darkblue';
                    document.getElementById('temperature-data').style.color = 'white';
                } else if (data.temperature >= 16 && data.temperature <= 19) {
                    temperatureColor = 'lightblue';
                } else if (data.temperature >= 20 && data.temperature <= 24) {
                    temperatureColor = 'green';
                } else if (data.temperature >= 25 && data.temperature <= 32) {
                    temperatureColor = 'orange';
                } else if (data.temperature >= 33 && data.temperature <= 40) {
                    temperatureColor = 'red';
                }

                document.getElementById('temperature-data').innerHTML = `
                 <p>${city}</p><br />
                <span style="background: ${temperatureColor};" class="infobox">
                    ${data.temperature}°C
                </span>
 
            `;

                // Round the total score
                let roundedScore = Math.round(data.tot_score);

                // total score 
                let scoreColor;
                if (roundedScore >= 8 && roundedScore <= 10) {
                    scoreColor = 'lightgreen';
                } else if (roundedScore >= 4 && roundedScore <= 7) {
                    scoreColor = 'orange';
                } else if (roundedScore >= 1 && roundedScore <= 3) {
                    scoreColor = 'red';
                }
                

                document.getElementById('total-score-data').innerHTML = `
                 ${city}:
                <span style="background-color: ${scoreColor};" class="infobox"> ${roundedScore}</span>
            `;

            document.getElementById('currentCity').innerHTML = `<h2>Current City: ${city}</h2>`;
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

// On page load, fetch data for the default city (Berlin)
window.onload = function () {
    fetchData('Berlin');
};

// CHART

function fetchLast24HoursData(city) {
    fetch('fetch_last_24_hours_data.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ 'city_name': city })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);  // Debugging: log the data structure

        if (data.error) {
            console.error("Error fetching data: ", data.error);
        } else {
            // Check if the data array is empty or invalid
            if (!Array.isArray(data) || data.length === 0) {
                console.error("No data available for the last 24 hours.");
                return;
            }

            // Prepare data for the chart
            const labels = data.map(entry => entry.recorded_time); // X-axis: Timestamps
            const totalScores = data.map(entry => entry.tot_score); // Y-axis: Total Scores

            // Clear previous content and charts
            const container = document.getElementById('chart-container');
            container.innerHTML = ''; // Clear any existing content
            
            // Create a canvas for the chart
            const canvas = document.createElement('canvas');
            canvas.id = 'totalScoreChart';
            container.appendChild(canvas);

            // Create the chart
            const ctx = document.getElementById('totalScoreChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',  // Create a line chart
                data: {
                    labels: labels,  // Timestamps
                    datasets: [{
                        label: 'Total Score',
                        data: totalScores,  // Total scores for each timestamp
                        borderColor: 'rgba(75, 192, 192, 1)',  // Line color
                        borderWidth: 2,
                        fill: false  // Do not fill under the line
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
                            min: 1,  // Minimum value for Y axis
                            max: 10  // Maximum value for Y axis
                        }
                    }
                }
            });
        }
    })
    .catch(error => {
        console.error("Error: ", error);
        alert("An error occurred while fetching the last 24 hours data.");
    });
}
<?php

// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include the config file
require_once 'config.php';

// Array of European capital cities
$european_capitals = [
    "Amsterdam", "Andorra la Vella", "Athens", "Belgrade", "Berlin", "Bern", "Bratislava", 
    "Brussels", "Bucharest", "Budapest", "Chisinau", "Copenhagen", "Dublin", "Helsinki", 
    "Kiev", "Lisbon", "Ljubljana", "London", "Luxembourg", "Madrid", "Monaco", "Moscow", 
    "Oslo", "Paris", "Podgorica", "Prague", "Pristina", "Reykjavik", "Riga", "Rome", 
    "San Marino", "Sarajevo", "Skopje", "Sofia", "Stockholm", "Tallinn", "Tirana", 
    "Valletta", "Vienna", "Vilnius", "Warsaw", "Zagreb"
];

// Function to fetch air quality data for a city
function fetchAirQuality($city) {
    $apiToken = '655cf8594024de05dbc820f980aba37f23e6d059';
    $url = "https://api.waqi.info/feed/{$city}/?token={$apiToken}";

    // Initialize cURL
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);

    // Check for cURL errors
    if (curl_errno($ch)) {
        echo 'cURL error: ' . curl_error($ch);
        return null;
    }

    // Close cURL session
    curl_close($ch);

    // Decode and return the JSON response
    return json_decode($response, true);
}

// Establish database connection
try {
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Prepare the SQL statement
$sql = "INSERT INTO AirFit (city_name, latitude, longitude, aqi, pm25, pm10, o3, temperature, recorded_time) 
        VALUES (:city_name, :latitude, :longitude, :aqi, :pm25, :pm10, :o3, :temperature, :recorded_time)";
$stmt = $pdo->prepare($sql);

// Loop through each European capital city
foreach ($european_capitals as $city) {
    $data = fetchAirQuality($city);

    if (!$data || $data['status'] !== 'ok') {
        echo "Failed to fetch or decode air quality data for {$city}.\n";
        continue; // Skip to the next city if data fetching fails
    }

    // Extract relevant data
    $city_data = $data['data'];

    // Execute SQL statement with API data
    $stmt->execute([
        ':city_name'    => $city_data['city']['name'],
        ':latitude'     => $city_data['city']['geo'][0],
        ':longitude'    => $city_data['city']['geo'][1],
        ':aqi'          => $city_data['aqi'],
        ':pm25'         => $city_data['iaqi']['pm25']['v'] ?? null,
        ':pm10'         => $city_data['iaqi']['pm10']['v'] ?? null,
        ':o3'           => $city_data['iaqi']['o3']['v'] ?? null,
        ':temperature'  => $city_data['iaqi']['t']['v'] ?? null,
        ':recorded_time' => $city_data['time']['iso']
    ]);

    echo "Air quality data for {$city} successfully inserted into the database.\n";
}

?>

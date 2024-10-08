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
    "Valletta", "Vienna", "Vilnius", "Warsaw", "Zagreb", "Minsk", "Vaduz", "Nicosia"
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

// Prepare the SQL statement to insert data
$sql = "INSERT INTO AirFit (city_name, latitude, longitude, aqi, pm25, pm10, o3, temperature, recorded_time, recorded_date, pollution_avg, tot_score) 
        VALUES (:city_name, :latitude, :longitude, :aqi, :pm25, :pm10, :o3, :temperature, :recorded_time, :recorded_date, :pollution_avg, :tot_score)";
$stmt = $pdo->prepare($sql);

// Function to calculate pollution points
function calculatePollutionPoints($pollution_avg) {
    if ($pollution_avg <= 50) {
        return 5;
    } elseif ($pollution_avg <= 100) {
        return 4;
    } elseif ($pollution_avg <= 150) {
        return 3;
    } elseif ($pollution_avg <= 200) {
        return 2;
    } elseif ($pollution_avg <= 300) {
        return 1;
    } else {
        return 0;
    }
}

// Function to calculate temperature points
function calculateTemperaturePoints($temperature) {
    if ($temperature >= 0 && $temperature <= 15) {
        return 1.5; // "Kühl"
    } elseif ($temperature >= 16 && $temperature <= 19) {
        return 2.5; // "etwas kühl"
    } elseif ($temperature >= 20 && $temperature <= 25) {
        return 5; // "perfekt"
    } elseif ($temperature >= 26 && $temperature <= 32) {
        return 2.5; // "etwas heiss"
    } elseif ($temperature >= 33 && $temperature <= 40) {
        return 0; // "sehr heiss"
    } else {
        return 0; // Default case if temperature is out of expected range
    }
}

// Loop through each European capital city
foreach ($european_capitals as $city) {
    $data = fetchAirQuality($city);

    if (!$data || $data['status'] !== 'ok') {
        echo "Failed to fetch or decode air quality data for {$city}.\n";
        continue; // Skip to the next city if data fetching fails
    }

    // Extract relevant data
    $city_data = $data['data'];

    // Extract air pollution values
    $aqi = $city_data['aqi'];
    $pm25 = $city_data['iaqi']['pm25']['v'] ?? null;
    $pm10 = $city_data['iaqi']['pm10']['v'] ?? null;
    $o3 = $city_data['iaqi']['o3']['v'] ?? null;

    // Calculate pollution average by summing non-null values and dividing by their count
    $sum = 0;
    $count = 0;

    if (!is_null($aqi)) {
        $sum += $aqi;
        $count++;
    }
    if (!is_null($pm25)) {
        $sum += $pm25;
        $count++;
    }
    if (!is_null($pm10)) {
        $sum += $pm10;
        $count++;
    }
    if (!is_null($o3)) {
        $sum += $o3;
        $count++;
    }

    // Calculate the pollution average
    $pollution_avg = ($count > 0) ? $sum / $count : null;

    // Calculate pollution points
    $pollution_points = calculatePollutionPoints($pollution_avg);

    // Extract temperature
    $temperature = $city_data['iaqi']['t']['v'] ?? null;

    // Calculate temperature points
    $temperature_points = calculateTemperaturePoints($temperature);

    // Calculate total score
    $tot_score = $temperature_points + $pollution_points;

    // Execute SQL statement with the calculated average, total score, and other API data
    $stmt->execute([
        ':city_name'    => $city, // Use the city name from the array
        ':latitude'     => $city_data['city']['geo'][0],
        ':longitude'    => $city_data['city']['geo'][1],
        ':aqi'          => $aqi,
        ':pm25'         => $pm25,
        ':pm10'         => $pm10,
        ':o3'           => $o3,
        ':temperature'  => $temperature,
        ':recorded_time' => $city_data['time']['iso'],
        ':recorded_date' => date('Y-m-d'), // Get the current date
        ':pollution_avg' => $pollution_avg, // Insert the calculated pollution average
        ':tot_score'    => $tot_score // Insert the calculated total score
    ]);

    echo "Air quality data for {$city} successfully inserted into the database with pollution average: " . round($pollution_avg, 2) . " and total score: " . $tot_score . ".\n";
}
?>
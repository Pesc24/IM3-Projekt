<?php

// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include the config file
require_once 'config.php';

// Array of European capital cities with standardized names, latitudes, and longitudes
$european_capitals_with_coordinates = [
    ["name" => "Berlin", "lat" => 52.5200, "lon" => 13.4050],      // Germany
    ["name" => "Paris", "lat" => 48.8566, "lon" => 2.3522],        // France
    ["name" => "Rome", "lat" => 41.9028, "lon" => 12.4964],        // Italy
    ["name" => "Madrid", "lat" => 40.4168, "lon" => -3.7038],      // Spain
    ["name" => "London", "lat" => 51.5074, "lon" => -0.1278],      // United Kingdom
    ["name" => "Vienna", "lat" => 48.2082, "lon" => 16.3738],      // Austria
    ["name" => "Brussels", "lat" => 50.8503, "lon" => 4.3517],     // Belgium
    ["name" => "Amsterdam", "lat" => 52.3676, "lon" => 4.9041],    // Netherlands
    ["name" => "Copenhagen", "lat" => 55.6761, "lon" => 12.5683],  // Denmark
    ["name" => "Lisbon", "lat" => 38.7223, "lon" => -9.1393],      // Portugal
    ["name" => "Athens", "lat" => 37.9838, "lon" => 23.7275],      // Greece
    ["name" => "Helsinki", "lat" => 60.1695, "lon" => 24.9355],    // Finland
    ["name" => "Oslo", "lat" => 59.9139, "lon" => 10.7522],        // Norway
    ["name" => "Stockholm", "lat" => 59.3293, "lon" => 18.0686],   // Sweden
    ["name" => "Bern", "lat" => 46.9480, "lon" => 7.4481],         // Switzerland
    ["name" => "Warsaw", "lat" => 52.2297, "lon" => 21.0122],      // Poland
    ["name" => "Prague", "lat" => 50.0755, "lon" => 14.4378],      // Czech Republic
    ["name" => "Budapest", "lat" => 47.4979, "lon" => 19.0402],    // Hungary
    ["name" => "Sofia", "lat" => 42.6977, "lon" => 23.3219],       // Bulgaria
    ["name" => "Bucharest", "lat" => 44.4268, "lon" => 26.1025],   // Romania
    ["name" => "Dublin", "lat" => 53.3498, "lon" => -6.2603],      // Ireland
    ["name" => "Reykjavik", "lat" => 64.1466, "lon" => -21.9426],  // Iceland
    ["name" => "Luxembourg", "lat" => 49.6117, "lon" => 6.1319],   // Luxembourg
    ["name" => "Ljubljana", "lat" => 46.0569, "lon" => 14.5058],   // Slovenia
    ["name" => "Zagreb", "lat" => 45.8150, "lon" => 15.9819],      // Croatia
    ["name" => "Bratislava", "lat" => 48.1486, "lon" => 17.1077],  // Slovakia
    ["name" => "Tallinn", "lat" => 59.4370, "lon" => 24.7536],     // Estonia
    ["name" => "Riga", "lat" => 56.9496, "lon" => 24.1052],        // Latvia
    ["name" => "Vilnius", "lat" => 54.6872, "lon" => 25.2797],     // Lithuania
    ["name" => "Valletta", "lat" => 35.8997, "lon" => 14.5146],    // Malta
    ["name" => "Nicosia", "lat" => 35.1856, "lon" => 33.3823],     // Cyprus
    ["name" => "Andorra la Vella", "lat" => 42.5063, "lon" => 1.5218], // Andorra
    ["name" => "Monaco", "lat" => 43.7384, "lon" => 7.4246],       // Monaco
    ["name" => "San Marino", "lat" => 43.9333, "lon" => 12.4500],  // San Marino
    ["name" => "Vaduz", "lat" => 47.1416, "lon" => 9.5215],        // Liechtenstein
    ["name" => "Minsk", "lat" => 53.9006, "lon" => 27.5590],       // Belarus
    ["name" => "Sarajevo", "lat" => 43.8563, "lon" => 18.4131],    // Bosnia and Herzegovina
    ["name" => "Skopje", "lat" => 41.9981, "lon" => 21.4254],      // North Macedonia
    ["name" => "Podgorica", "lat" => 42.4304, "lon" => 19.2594],   // Montenegro
    ["name" => "Belgrade", "lat" => 44.7866, "lon" => 20.4489],    // Serbia
    ["name" => "Tirana", "lat" => 41.3275, "lon" => 19.8189],      // Albania
    ["name" => "Chisinau", "lat" => 47.0105, "lon" => 28.8638],    // Moldova
    ["name" => "Kiev", "lat" => 50.4501, "lon" => 30.5234],        // Ukraine
    ["name" => "Moscow", "lat" => 55.7558, "lon" => 37.6173],      // Russia
    ["name" => "Tbilisi", "lat" => 41.7151, "lon" => 44.8271],     // Georgia
    ["name" => "Yerevan", "lat" => 40.1792, "lon" => 44.4991],     // Armenia
    ["name" => "Baku", "lat" => 40.4093, "lon" => 49.8671],        // Azerbaijan
    ["name" => "Vatican City", "lat" => 41.9029, "lon" => 12.4534] // Vatican City
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

// Loop through each European capital city
foreach ($european_capitals_with_coordinates as $city_info) {
    $data = fetchAirQuality($city_info['name']);

    if (!$data || $data['status'] !== 'ok') {
        echo "Failed to fetch or decode air quality data for {$city_info['name']}.\n";
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

    // Check if a record with the same city_name and recorded_time already exists
    $check_sql = "SELECT COUNT(*) FROM AirFit WHERE city_name = :city_name AND recorded_time = :recorded_time";
    $check_stmt = $pdo->prepare($check_sql);
    $check_stmt->execute([
        ':city_name' => $city_info['name'],
        ':recorded_time' => $city_data['time']['iso']
    ]);
    $exists = $check_stmt->fetchColumn();

    if ($exists) {
        echo "Record for {$city_info['name']} at {$city_data['time']['iso']} already exists. Skipping insertion.\n";
        continue; // Skip to the next city if a duplicate record is found
    }

    // Execute SQL statement with the calculated average, total score, and other API data
    $stmt->execute([
        ':city_name'    => $city_info['name'], // Use the standardized city name
        ':latitude'     => $city_info['lat'],
        ':longitude'    => $city_info['lon'],
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

    echo "Air quality data for {$city_info['name']} successfully inserted into the database with pollution average: " . round($pollution_avg, 2) . " and total score: " . $tot_score . ".\n";
}

?>

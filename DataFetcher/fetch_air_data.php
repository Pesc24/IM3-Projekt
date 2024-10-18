<?php
session_start(); // Start the session

// Include the database connection
include_once '../etl/config.php';

// Handle form submission using POST
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['city_name'])) {
    // Sanitize and store city name in session
    $_SESSION['city_name'] = htmlspecialchars($_POST['city_name']);
}

// Set the default city name to 'Berlin' or the one stored in the session
$city_name = isset($_SESSION['city_name']) ? $_SESSION['city_name'] : 'Berlin';

try {
    // Create a new PDO instance (connect to the database)
    $pdo = new PDO($dsn, $username, $password, $options);

    // SQL query to fetch the latest data (including AQI, PM2.5, PM10, O3) for the specified city from the 'AirFit' table
    $sql = "SELECT temperature, aqi, pm25, pm10, o3, pollution_avg, recorded_time, tot_score FROM `AirFit` 
            WHERE city_name = :city_name 
            ORDER BY recorded_time DESC LIMIT 1;";

    // Prepare the SQL statement
    $stmt = $pdo->prepare($sql);

    // Execute the statement with the city name
    $stmt->execute(['city_name' => $city_name]);

    // Fetch the result
    $result = $stmt->fetch();

    // Return data as JSON
    if ($result) {
        echo json_encode($result);
    } else {
        echo json_encode(['error' => 'No air quality data found for ' . $city_name]);
    }

} catch (PDOException $e) {
    // Handle any errors during the query
    echo json_encode(['error' => $e->getMessage()]);
}
?>
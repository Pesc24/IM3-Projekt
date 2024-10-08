<?php
session_start();
include_once 'etl/config.php';

// Set the default city name to 'Berlin' or the one stored in the session
$city_name = isset($_SESSION['city_name']) ? $_SESSION['city_name'] : 'Berlin';

try {
    // Create a new PDO instance (connect to the database)
    $pdo = new PDO($dsn, $username, $password, $options);

    // SQL query to fetch temperature, AQI, PM2.5, PM10, O3, pollution_avg, and recorded_time for the last 24 hours
    $sql = "SELECT temperature, aqi, pm25, pm10, o3, pollution_avg, recorded_time, tot_score 
            FROM `AirFit` 
            WHERE city_name = :city_name 
              AND recorded_time >= NOW() - INTERVAL 1 DAY 
            ORDER BY recorded_time ASC";

    // Prepare the SQL statement
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['city_name' => $city_name]);

    // Fetch all results
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return data as JSON
    echo json_encode($results);

} catch (PDOException $e) {
    // Handle any errors during the query
    echo json_encode(['error' => $e->getMessage()]);
}
?>
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
$city_name = isset($_SESSION['city_name']) ? $_SESSION['city_name'] : 'Paris';

try {
    // Create a new PDO instance (connect to the database)
    $pdo = new PDO($dsn, $username, $password, $options);

    // SQL query to fetch the temperature, pollution_avg, recorded_time, and tot_score for the last 24 hours
    $sql = "SELECT temperature, pollution_avg, recorded_time, tot_score 
            FROM `AirFit` 
            WHERE city_name = :city_name 
            ORDER BY recorded_time DESC;";

    // Prepare the SQL statement
    $stmt = $pdo->prepare($sql);

    // Execute the statement with the city name
    $stmt->execute(['city_name' => $city_name]);

    // Fetch all results
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return data as JSON
    if ($result) {
        echo json_encode($result);
    } else {
        echo json_encode(['error' => 'No air quality data found for the last 24 hours in ' . $city_name]);
    }

} catch (PDOException $e) {
    // Handle any errors during the query
    echo json_encode(['error' => $e->getMessage()]);
}
?>
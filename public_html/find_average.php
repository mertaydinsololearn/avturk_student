<?php

session_start();
if (!isset($_SESSION['logged_in'])){
    header("Location: index.html");
    exit();
}


$studentNumber = $_SESSION['studentNumber'];

// Create a database connection 
$servername = "127.0.0.1";
$username = "avturk";
$dbPassword = "Bilimbenimsin1!";
$dbName = "avturk_student";

// Create connection
$conn = new mysqli($servername, $username, $dbPassword, $dbName);
// Check connection
if ($conn->connect_error) {
  echo("0");
  exit();
}

$stmt = $conn->prepare(" SELECT SUM(g.grade * s.weight) / SUM(s.weight) AS average FROM grades AS g INNER JOIN subjects AS s ON g.subject_id = s.id WHERE g.student_id = ? GROUP BY student_id");
$stmt->bind_param("i", $studentNumber); 
$result = $stmt->execute(); // Execute the prepared statement

$result = $stmt->get_result(); 

if ($result->num_rows > 0) {
    // Fetching data as an associative array
    $data = $result->fetch_assoc();
    
    // Convert fetched data to JSON
    echo json_encode($data);
} else {
    echo json_encode(null);
}

$stmt->close();
$conn->close();

?>


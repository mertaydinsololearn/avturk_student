<?php

session_start();
if (empty($_SESSION['logged_in'])){
    header("Location: index.html");
    exit();
}

$studentId = isset($_POST['studentId']) ? intval($_POST['studentId']) : 0;

// Validate if $id is a valid integer
if ($studentId  == 0 || !filter_var($studentId, FILTER_VALIDATE_INT)) {
    header("Location: student.php");
    exit();
}

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

// Delete student
$stmt = $conn->prepare("DELETE FROM students WHERE student_number = ?");
$stmt->bind_param("i",  $studentId); 
$result = $stmt->execute(); // Execute the prepared statement


if ($result) {
    // Deletion successful
    $deletedRows = $stmt->affected_rows;
    if ($deletedRows > 0) {
        // If one or more rows were deleted
        echo "1";
        $stmt->close();
        $conn->close();
        exit();
    } else {
        // If no rows were affected (student not found)
        echo "0";
        $stmt->close();
        $conn->close();
        exit();
    }
} else {
    // Deletion failed
    echo "0";
    $stmt->close();
    $conn->close();
    exit();
}


?>


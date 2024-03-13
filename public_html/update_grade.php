<?php

session_start();
if (!isset($_SESSION['logged_in'])){
    header("Location: index.html");
    exit();
}



$period = isset($_POST['period']) ? ($_POST['period']) : '';
$grade= isset($_POST['grade']) ? ($_POST['grade']) : '';
$gradeId= isset($_POST['gradeId']) ? ($_POST['gradeId']) : '';



// Validate if $id is a valid integer
if (!(is_numeric($period)  &&  is_numeric($gradeId) &&  is_numeric($grade)) ) {
    echo("0");
    exit();
}

$period = intval($period);
$gradeId = intval($gradeId);
$grade = intval($grade);


// validate input
if ($period <= 0 || $period > 10 || $grade < 0 || $grade > 100) {
    echo("0");
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

$stmt = $conn->prepare("UPDATE grades SET grade = ?, period = ? WHERE id = ?");
$stmt->bind_param("iii", $grade, $period, $gradeId); 
$result = $stmt->execute(); // Execute the prepared statement

if ($result && $stmt->affected_rows > 0) {
    echo ("1");
} else {
    // Update failed or no rows were affected
    echo "0";
}

$stmt->close();
$conn->close();

?>


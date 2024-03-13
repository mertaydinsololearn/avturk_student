<?php

session_start();
if (empty($_SESSION['logged_in'])){
    header("Location: index.html");
    exit();
}


$fname = isset($_POST['fname']) ? trim($_POST['fname']) : '';
$lname = isset($_POST['lname']) ? trim($_POST['lname']) : '';
$studentId =  isset($_POST['studentId']) ? $_POST['studentId'] : '0';


// If first name, last name, email , or password is empty stop the script
if (empty($fname) || empty($lname)){
    echo("0");
  exit();
}



if (strlen($fname) > 100 || strlen($lname) > 100){
    echo("0");
  exit();
}
// Validate if $id is a valid integer
if ($studentId  == 0 || !is_numeric($studentId)) {
    echo("0");
    exit();
}

$studentId = intval($studentId);

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
$userId = $_SESSION['user_id'];

$stmt = $conn->prepare("UPDATE students SET first_name = ?, last_name = ? WHERE student_number = ?");
$stmt->bind_param("ssi", $fname, $lname, $studentId); 
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


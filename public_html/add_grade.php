<?php

session_start();
if (!isset($_SESSION['logged_in'])){
    header("Location: index.html");
    exit();
}

$period = isset($_POST['period']) ? ($_POST['period']) : '';
$subjectId = isset($_POST['subjectId']) ? ($_POST['subjectId']) : '';
$grade= isset($_POST['grade']) ? ($_POST['grade']) : '';

$studentId = $_SESSION['studentNumber']; 

// Validate if $id is a valid integer
if (!(is_numeric($period)  &&  is_numeric($subjectId) &&  is_numeric($grade)) ) {
    header("Location: student.php");
    exit();
}

$period = intval($period);
$subjectId = intval($subjectId);
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

// add grade
$stmt = $conn->prepare("INSERT INTO grades(period, student_id, subject_id, grade) VALUES (?, ?, ?, ?)");
$stmt->bind_param("iiii", $period, $studentId, $subjectId, $grade); 
$success = $stmt->execute();

if ($success) {
    $lastInsertedId = $conn->insert_id;
    $insertedData = [
     "success" => true,
     "message" => "Insertion successful",
     "result" => [
         "id" => $lastInsertedId
     ]
 ];
 echo json_encode($insertedData); // Return the inserted data as JSON object
 $stmt->close();
$conn->close();
exit();
} else {
    echo ("0");
    $stmt->close();
    $conn->close();
    exit();
}


?>





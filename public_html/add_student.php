<?php

session_start();
if (!isset($_SESSION['logged_in'])){
    header("Location: index.html");
    exit();
}


$fname = isset($_POST['fname']) ? trim($_POST['fname']) : '';
$lname = isset($_POST['lname']) ? trim($_POST['lname']) : '';


// If first name, last name, email , or password is empty stop the script
if (empty($fname) || empty($lname)){
  exit();
}



if (strlen($fname) > 100 || strlen($lname) > 100){
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

// Check if email is already registered
$stmt = $conn->prepare("INSERT INTO students(first_name, last_name) VALUES (?, ?)");
$stmt->bind_param("ss", $fname, $lname); 
$result = $stmt->execute(); // Execute the prepared statement


if ($result) {
       // Insertion successful
       $lastInsertedId = $conn->insert_id;
       $insertedData = [
        "success" => true,
        "message" => "Insertion successful",
        "result" => [
            "first_name" => $fname,
            "last_name" => $lname,
            "student_number" => $lastInsertedId
        ]
    ];
    echo json_encode($insertedData); // Return the inserted data as JSON object
} else {
    // Insertion failed
    echo "0";
}

$stmt->close();
$conn->close();

?>


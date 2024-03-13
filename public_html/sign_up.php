<?php
$fname = isset($_POST['fname']) ? trim($_POST['fname']) : '';
$lname = isset($_POST['lname']) ? trim($_POST['lname']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$password = isset($_POST['password']) ? trim($_POST['password']) : '';

// Validate input
if (!filter_var($email, FILTER_VALIDATE_EMAIL)){
  exit();
}

// If first name, last name, email , or password is empty stop the script
if (empty($fname) || empty($lname) || empty($email) || empty($password) ){
  exit();
}

if (strlen($password) < 8){
  exit();
}

if (strlen($fname) > 100 || strlen($lname) > 100 || strlen($email) > 255 || strlen($password) > 255){
  exit();
}
// Add salt and hash the password
$password = password_hash($password, PASSWORD_DEFAULT);


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
$stmt = $conn->prepare("SELECT email FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result(); // get the mysqli result

while ($row = $result->fetch_assoc()) {
  if ($row['email']){
    echo("-1");
    $result -> free_result();
    $stmt->close();
    $conn->close();
    exit();
  }
}
$stmt->close();



// Add user's information to database
  // prepare and bind
  $stmt = $conn->prepare("INSERT INTO users(first_name, last_name, email, password) VALUES (?, ?, ?, ?)");
  $stmt->bind_param("ssss", $fname, $lname, $email, $password);
  $stmt->execute();

  $stmt->close();
  $conn->close();
  session_start();
  $_SESSION['logged_in'] = true;
  $_SESSION['email'] = $email;
  $_SESSION['user_id'] =  $mysqli->insert_id;
  echo("1");
  exit();

// Close the connection and delete the unnecesary data
$conn->close();

?>


<?php
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$password = isset($_POST['password']) ? trim($_POST['password']) : '';

// Validate input
if (!filter_var($email, FILTER_VALIDATE_EMAIL)){
  exit();
}

// If email or password is empty, stop the script
if (empty($email) || empty($password) ){
  exit();
}

if (strlen($password) < 8){
  exit();
}

if (strlen($email) > 255 || strlen($password) > 255){
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

// Check user's information
$stmt = $conn->prepare("SELECT id, email, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

// Check if email exists
$email_exist = $result->num_rows;

if ($email_exist > 0) {
    $row = $result->fetch_assoc();
    if (password_verify($password, $row['password'])) {
        // Passwords match, proceed with logging in
        session_start();
        $_SESSION['logged_in'] = true;
        $_SESSION['email'] = $email;
        $_SESSION['user_id'] =  $row['id'];
        echo("1");
        $stmt->close(); 
        $conn->close();
        exit();
    } else {
        // Passwords do not match
        echo("-1");
        $stmt->close();
        $conn->close();
        exit();
    }
} else {
    // Email does not exist in the database
    echo("-1");
    $stmt->close();
    $conn->close();
    exit();
}

?>

<?php

session_start();
if (empty($_SESSION['logged_in'])){
    header("Location: index.html");
    exit();
}

$studentId = isset($_GET['studentId']) ? $_GET['studentId'] : 0;
$fname = isset($_GET['fname']) ? ($_GET['fname']) : '';
$lname = isset($_GET['lname']) ? ($_GET['lname']) : '';
$_SESSION['studentNumber'] = $studentId; 

// Validate if $id is a valid integer
if ($studentId  == 0 || !is_numeric($studentId)) {
    header("Location: student.php");
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

$grades = null;
$subjects = null;
// get grades
$stmt = $conn->prepare("SELECT g.id, g.period, s.subject_name, s.weight  FROM grades  AS g INNER JOIN subjects AS s  ON g.subject_id = s.id WHERE g.student_id = ?");
$stmt->bind_param("i",  $studentId); 
$stmt->execute();
$result = $stmt->get_result(); // get the mysqli result

if ($result->num_rows > 0) {
    // Fetching data as an associative array
    $grades = $result->fetch_all(MYSQLI_ASSOC);
}
$stmt->close();


// get subject names 
$stmt = $conn->prepare("SELECT id,  subject_name FROM subjects");
$stmt->execute();
$result = $stmt->get_result(); // get the mysqli result

if ($result->num_rows > 0) {
    // Fetching data as an associative array
    $subjects = $result->fetch_all(MYSQLI_ASSOC);
}
$stmt->close();


$conn->close();


?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Öğrenciler</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link href="css/grades.css" rel="stylesheet">

</head>
<body>
    <div class="container mt-5">
        <h1>Notlar</h1>
        <?php 
            echo '<p>Öğrencinin adı: ' . $fname. ' Soyadı: '. $lname. ' Öğrenci Numarası: ' . $studentId . '</p>';  
        ?>
        <hr />
        <div class="alert alert-success hidden"  id="success-info" role="alert">
            Not Başarıyla Eklendi
        </div>
        <div class="alert alert-danger error-info hidden" id="error-info" role="alert">
            Veritabanında bir arıza oluştu. LÜtfen kısa bir süre sonra tekrar deneyin.
        </div>
        <div class="alert alert-success hidden"  id="deletion-success" role="alert">
            Not Başarıyla Silindi
        </div>
        
        
        <div class="form-wrap" id="add-grades-div">
            <div class="form-inner">
                <form  class="pt-3" id="add-grades-form">
                    <div class="form-floating">
                    <?php 
                      echo '<select class="form-control grades-input" id="name" name="name">';
                     echo '<option value="">Ders seçin</option>';

                    foreach ($subjects as $subject) {
                        echo '<option value="' . htmlspecialchars($subject['id']) . '">' . htmlspecialchars($subject['subject_name']) . '</option>';
                    }   
                    echo '</select>';
                    ?>

                    </div>
                    <div class="form-floating">
                        <input type="number" class="form-control grades-input" min="1" max="10" id="class_period" placeholder="" name="class_period">
                        <label for="class_period">Dönem</label>
                    </div>
                    <div class="form-floating">
                        <input type="number" min="0" max="100" class="form-control grades-input" id="course_grade" placeholder="" name="course_grade">
                        <label for="course_grade">Not</label>
                    </div>
                           
                    <div class="d-grid mb-4">
                        <button type="submit" class="btn btn-primary grades-add-btn">Not Ekle</button>
                    </div>
                </form>
            </div>
        </div>
       
        <table class="table table-bordered table-striped">
            <thead class="table-dark">
                <tr>
                    <th>Ad</th>
                    <th>Dönem</th>
                    <th>Not</th>
                    <th>Güncelle</th>
                    <th>Sil</th>
                </tr>
            </thead>
           
            <tbody id="grades-table">
            <?php
            // Check if $students is not empty
            if (!empty($grades)) {
            foreach ($grades as $grade) {
                 echo '<tr id="' . $grade['id'] . '">';
                echo '<td><input type="text" value="' . $grade['subject'] . '"></td>';
                echo '<td><input type="text" value="' . $grade['period'] . '"></td>';
                echo '<td><input type="number" min="0" max="100" value="' . $grade['grade'] . '"></td>';
                echo '<td><a class="btn btn-info btn-sm update-button">Güncelle</a></td>';
                echo '<td><a class="btn btn-danger btn-sm delete-button">Sil</a></td>';
                echo '</tr>';
            }
        } 
?>
            </tbody>
        </table>
    </div>
    <script src="js/grades.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js"></script>
</body>
</html>


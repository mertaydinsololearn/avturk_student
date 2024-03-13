<?php 
    session_start();
    if (empty($_SESSION['logged_in'])){
        header("Location: index.html");
        exit();
    }

    $servername = "127.0.0.1";
    $username = "avturk";
    $dbPassword = "Bilimbenimsin1!";
    $dbName = "avturk_student";
    
    // Create connection
    $conn = new mysqli($servername, $username, $dbPassword, $dbName);
    // Check connection
    if ($conn->connect_error) {
        echo("Veritabanında bir sorun oluştu lütfen kısa bir süre sonra tekrar deneyin");
        exit();
    }

    $userId = $_SESSION['user_id'];
    $students = null;

    $stmt = $conn->prepare("SELECT student_number, first_name, last_name FROM students");
    $stmt->execute();
    $result = $stmt->get_result(); // get the mysqli result

    if ($result->num_rows > 0) {
        // Fetching data as an associative array
        $students = $result->fetch_all(MYSQLI_ASSOC);
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
    <link href="css/students.css" rel="stylesheet">

</head>
<body>
    <div class="container mt-5">
        <h1>Öğrencileriniz</h1>
        <hr />
        <div class="alert alert-success  hidden"  id="success-info" role="alert">
            Öğrenci Başarıyla Eklendi
        </div>
        <div class="alert alert-success  hidden"  id="update-success-info" role="alert">
            Öğrenci Başarıyla Güncellendi
        </div>
        <div class="alert alert-danger error-info hidden" id="error-info" role="alert">
            Veritabanında bir arıza oluştu. LÜtfen kısa bir süre sonra tekrar deneyin.
        </div>
        <div class="alert alert-success hidden"  id="deletion-success" role="alert">
            Öğrenci Başarıyla Silindi
        </div>
        
        
        <div class="form-wrap" id="add-student-div">
            <div class="form-inner">
                <form  class="pt-3" id="add-student-form">
                    <div class="form-floating">
                        <input type="text" class="form-control student-input" id="first_name" placeholder="" name="fname">
                        <label for="first_name">İsim</label>
                    </div>
                    <div class="form-floating">
                        <input type="text" class="form-control student-input" id="last_name" placeholder="" name="lname">
                        <label for="last_name">Soyad</label>
                    </div>
                           
                    <div class="d-grid mb-4">
                        <button type="submit" class="btn btn-primary student-add-btn">Öğrenciyi Ekle</button>
                    </div>
                </form>
            </div>
        </div>
       
        <table class="table table-bordered table-striped">
            <thead class="table-dark">
                <tr>
                    <th>İsim</th>
                    <th>Soyad</th>
                    <th>Numara</th>
                    <th>Gör</th>
                    <th>Güncelle</th>
                    <th>Sil</th>
                </tr>
            </thead>
           
            <tbody id="student-table">
        <?php
        // Check if $students is not empty
        if (!empty($students)) {
        // Iterate through each student
        foreach ($students as $student) {
        // Echo the details inside each <tr>
            echo '<tr' . ' id="' . $student['student_number'] . '">';
            echo '<td><input type="text" class="table_first_name" value="' . $student['first_name'] . '"></td>';
            echo '<td><input type="text" class="table_last_name" value="' . $student['last_name'] . '"></td>';
            echo '<td>' . $student['student_number'] . '</td>';
            echo '<td><a class="btn btn-info btn-sm update-button">Güncelle</a></td>';
            echo '<td><a href="grades.php?studentId=' . $student['student_number'] . '&fname=' . $student['first_name'] . '&lname=' . $student['last_name'] . '" class="btn btn-info btn-sm view-button">Notlar</a></td>';
            echo '<td><a class="btn btn-danger btn-sm delete-button">Sil</a></td>';
            echo '</tr>';
        }
        } else {
         // If $students is empty, display a message
            echo '<tr id="not_found"><td colspan="5">Öğrenci Bulunamadı</td></tr>';
        }
        ?>

            </tbody>
        </table>
    </div>
    <script src="js/students.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js"></script>
</body>
</html>
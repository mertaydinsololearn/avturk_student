
document.addEventListener("DOMContentLoaded", function(event) {
    
    document.getElementById("add-student-form").addEventListener("submit", (e) => {
        var valid = true;
        var firstName = document.getElementById("first_name");
        var firstNameVal = firstName.value;
        var lastName =  document.getElementById("last_name");
        var lastNameVal = lastName.value;

        if (firstNameVal.length == 0){
            valid = false;
	        firstName.setCustomValidity("Bu alanı doldurmanız gerekmektedir");
	        firstName.reportValidity();
	    } else if (firstNameVal.length > 100){
            valid = false;
	        firstName.setCustomValidity("Lütfen daha kısa bir isim");
	        firstName.reportValidity();
	    } 
        if (valid && lastNameVal.length == 0 ){
            valid = false;
	        lastName.setCustomValidity("Bu alanı doldurmanız gerekmektedir");
	        lastName.reportValidity();
	    } else if (valid && lastNameVal.length > 100){
            valid = false;
		    lastName.setCustomValidity("Daha kısa bir soyad yazınız");
		    lastName.reportValidity();
    	}

        if (!valid) {
            e.preventDefault();
        } else {
            e.preventDefault();
            
            $.post("add_student.php", {fname: firstNameVal, lname: lastNameVal}, function(data) {
                var parsedData = JSON.parse(data);
                if (parsedData == 0) {
                    document.getElementById("success-info").classList.add("hidden");
                    document.getElementById("update-success-info").classList.add("hidden");
                    document.getElementById("deletion-success").classList.add("hidden");
                    document.getElementById("error-info").classList.remove("hidden");

                } else {
                    document.getElementById("error-info").classList.add("hidden");
                    document.getElementById("update-success-info").classList.add("hidden");
                    document.getElementById("deletion-success").classList.add("hidden");
                    document.getElementById("success-info").classList.remove("hidden");
        
                    var insertedData = parsedData.result;
                    var insertedFirstName = insertedData.first_name;
                    var insertedLastName = insertedData.last_name;
                    var insertedStudentNumber = insertedData.student_number;

                    var successInfo =  document.getElementById("success-info");
                    var newText = "" + insertedFirstName + " " + insertedLastName + " adındaki " + insertedStudentNumber + " numaralı öğrenci başarıyla eklendi"; 
                    successInfo.innerText = newText;
                    
                    
                    var newRowHtml = 
                        '<tr id="' + insertedStudentNumber + '">' +
                            '<td>' +  '<input type="text" class="table_first_name" value="' + insertedFirstName + '"</td>' +
                            '<td>' +   '<input type="text"  class="table_last_name" value="' + insertedLastName + '"</td>' +
                            '<td>' + insertedStudentNumber + '</td>' +
                            '<td><a class="btn btn-info btn-sm update-button">Güncelle</a></td>' +
                            '<td><a href="grades.php?studentId=' + insertedStudentNumber +  '&fname=' + insertedFirstName + '&lname=' + insertedLastName + '" class="btn btn-info btn-sm view-button">Notlar</a></td>' +
                            '<td><a class="btn btn-danger btn-sm delete-button">Sil</a></td>' +
                        '</tr>';
        
                    document.getElementById("student-table").insertAdjacentHTML('beforeend', newRowHtml);

                    if(document.getElementById("not_found")) {
                        document.getElementById("not_found").remove();
                    }
                }
            });
        }
    });

    // add event listeners to delete buttons
    document.getElementById("student-table").addEventListener('click', function(e) {
        var target = e.target;
        // Check if the clicked element is a delete button
        if (target && target.classList.contains('delete-button')) {
            var row = target.closest('tr');
            var choice = confirm("Öğrenci ve öğrenciye ait tüm bilgilerin silinmesini onaylıyor musunuz?");
            if (!choice) {
                return;
            } 
            if (row) {
                var studentId = row.getAttribute('id');

                $.post("delete_student.php", {studentId: studentId}, function(data) {                    
                    if (data == 1) {

                        var firstName = row.querySelector('.table_first_name').value;
                        var lastName = row.querySelector('.table_last_name').value;

                        document.getElementById("error-info").classList.add("hidden");
                        document.getElementById("success-info").classList.add("hidden");
                        document.getElementById("update-success-info").classList.add("hidden");
                        document.getElementById("deletion-success").classList.remove("hidden");
                        

                        var deletionInfo =  document.getElementById("deletion-success");
                        var newText = "" + firstName + " " + lastName + " adındaki " + studentId + " numaralı öğrenci başarıyla silindi"; 
                        deletionInfo.innerText = newText;
                        row.remove();
  
                    } else if (data == 0) {
                        document.getElementById("error-info").classList.remove("hidden");
                        document.getElementById("success-info").classList.add("hidden");
                        document.getElementById("deletion-success").classList.add("hidden");
                        document.getElementById("update-success-info").classList.add("hidden");

                    } 

                });

            }
        }
    });




     // add event listeners to delete buttons
     document.getElementById("student-table").addEventListener('click', function(e) {
        var target = e.target;
        // Check if the clicked element is a delete button
        if (target && target.classList.contains('update-button')) {  
        var row = target.closest('tr');

            if (row) {
                var studentId = row.getAttribute('id');

                var firstName = row.querySelector('.table_first_name');
                var lastName = row.querySelector('.table_last_name');

                var firstNameVal = firstName.value;
                var lastNameVal = lastName.value;

                var valid = true;
            
        
                if (firstNameVal.length == 0){
                    valid = false;
                    firstName.setCustomValidity("Bu alanı doldurmanız gerekmektedir");
                    firstName.reportValidity();
                } else if (firstNameVal.length > 100){
                    valid = false;
                    firstName.setCustomValidity("Lütfen daha kısa bir isim");
                    firstName.reportValidity();
                } 
                if (valid && lastNameVal.length == 0 ){
                    valid = false;
                    lastName.setCustomValidity("Bu alanı doldurmanız gerekmektedir");
                    lastName.reportValidity();
                } else if (valid && lastNameVal.length > 100){
                    valid = false;
                    lastName.setCustomValidity("Daha kısa bir soyad yazınız");
                    lastName.reportValidity();
                }
        
                if (!valid) {
                    e.preventDefault();
                } else {

                $.post("update_student.php", {studentId: studentId, fname: firstNameVal, lname: lastNameVal}, function(data) {                    
                    
                    if (data == 1) {
                        document.getElementById("error-info").classList.add("hidden");
                        document.getElementById("success-info").classList.add("hidden");
                        document.getElementById("deletion-success").classList.add("hidden");
                        document.getElementById("update-success-info").classList.remove("hidden");
                        
                        var updateInfo =  document.getElementById("update-success-info");
                        var newText = "" + firstNameVal + " " + lastNameVal + " adındaki " + studentId + " numaralı öğrencinin bilgisi başarıyla güncellendi"; 
                        updateInfo.innerText = newText;
                        

                        
                    } else if (data == 0) {
                        document.getElementById("error-info").classList.remove("hidden");
                        document.getElementById("success-info").classList.add("hidden");
                        document.getElementById("deletion-success").classList.add("hidden");
                        document.getElementById("update-success-info").classList.add("hidden");
                    } 

                });

            }
        }
    }
    });


    // Select all elements with class 'sign_input'
var signInputs = document.querySelectorAll('.student-input');

// Iterate over each sign_input element and add the event listener
signInputs.forEach(function(element) {
    element.addEventListener('input', function() {
        this.setCustomValidity('');
        this.reportValidity();
    });
});
    

});
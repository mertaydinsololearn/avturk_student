document.addEventListener("DOMContentLoaded", function(event) {
    
    document.getElementById("add-grades-form").addEventListener("submit", (e) => {
        var valid = true;
        var subjectId = document.getElementById("name");
        var subjectIdVal = subjectId.value;
        var subjectIdText = subjectId.selectedOptions[0].innerText;
        var classPeriod =  document.getElementById("class_period");
        var classPeriodVal = classPeriod.value;
        var courseGrade =  document.getElementById("course_grade");
        var courseGradeVal = courseGrade.value;

        if (subjectIdVal.length == 0){
            valid = false;
	        subjectId.setCustomValidity("Bu alanı doldurmanız gerekmektedir");
	        subjectId.reportValidity();
	    } else if (subjectIdVal.length > 100){
            valid = false;
	        subjectId.setCustomValidity("Lütfen daha kısa bir isim");
	        subjectId.reportValidity();
	    } if (valid && !classPeriodVal) {
            valid = false;
	        classPeriod.setCustomValidity("Lütfen 1-10 arası bir sayı giriniz");
	        classPeriod.reportValidity();
        } if (valid && !courseGradeVal) {
            valid = false;
	        courseGrade.setCustomValidity("Lütfen 0-100 arası bir sayı giriniz");
	        courseGrade.reportValidity();
        }

        if (!valid) {
            e.preventDefault();
        } else {
            e.preventDefault();
            $.post("add_grade.php", {period : classPeriodVal, subjectId: subjectIdVal, grade: courseGradeVal }, function(data) {
                var parsedData = JSON.parse(data);
                if (parsedData == 0) {
                    document.getElementById("success-info").classList.add("hidden");
                    document.getElementById("deletion-success").classList.add("hidden");
                    document.getElementById("update-success-info").classList.add("hidden");
                    document.getElementById("error-info").classList.remove("hidden");

                } else {
                    document.getElementById("error-info").classList.add("hidden");
                    document.getElementById("update-success-info").classList.add("hidden");
                    document.getElementById("deletion-success").classList.add("hidden");
                    document.getElementById("success-info").classList.remove("hidden");
        
                    var insertedData = parsedData.result;
                    var insertedGradeId = insertedData.id;

                    var successInfo =  document.getElementById("success-info");
                    var newText = "" + subjectIdText + " adlı " + classPeriodVal + " dönemindeki not başarıyla eklendi"; 
                    successInfo.innerText = newText;

                    
                    var newRowHtml = 
                        '<tr id="' + insertedGradeId + '">' +
                            '<td class="grade_table_subject">' + subjectIdText + '</td>' +
                            '<td>' + '<input type="number" min="1" max="10" class="grades-input grade_table_period" value="' +  classPeriodVal + '"/></td>' +
                            '<td>' + '<input type="number" min="0" max="100" class="grades-input grade_table_grade" value="' + courseGradeVal + '"/></td>' +
                            '<td><a class="btn btn-info btn-sm update-button">Güncelle</a></td>' +
                            '<td><a class="btn btn-danger btn-sm delete-button">Sil</a></td>' +
                        '</tr>';
        
                    document.getElementById("grades-table").insertAdjacentHTML('beforeend', newRowHtml);
                }
            });
        }
    });

    // add event listeners to delete buttons
    document.getElementById("grades-table").addEventListener('click', function(e) {
        var target = e.target;
        // Check if the clicked element is a delete button
        if (target && target.classList.contains('delete-button')) {
            var row = target.closest('tr');
            if (row) {
                var gradeId = row.getAttribute('id');

                $.post("delete_grade.php", {gradeId: gradeId}, function(data) {                    
                    
                    if (data == 1) {

                        var subject = row.querySelector('.grade_table_subject').innerText;
                        var period = row.querySelector('.grade_table_period').value;
                        var grade = row.querySelector('.grade_table_grade').value;

                        document.getElementById("error-info").classList.add("hidden");
                        document.getElementById("success-info").classList.add("hidden");
                        document.getElementById("update-success-info").classList.add("hidden");
                        document.getElementById("deletion-success").classList.remove("hidden");

                       
                        var deletionInfo =  document.getElementById("deletion-success");
                        var newText = "" + subject + "  adlı " + period + " dönemi " + grade + " notu başarıyla silindi"; 
                        deletionInfo.innerText = newText;
                        row.remove();

                    } else if (data == 0) {
                        document.getElementById("success-info").classList.add("hidden");
                        document.getElementById("update-success-info").classList.add("hidden");
                        document.getElementById("deletion-success").classList.add("hidden");
                        document.getElementById("error-info").classList.remove("hidden");
                    } 

                });

            }
        }  else if (target && target.classList.contains('update-button')) {  
            var row = target.closest('tr');
         if (row) {
            var valid = true;
             var gradeId = row.getAttribute('id');
             var period = row.querySelector('.grade_table_period');
             var grade = row.querySelector('.grade_table_grade');
    
             var subject = row.querySelector('.grade_table_subject').innerText;
    
             console.log(grade.value);
             if (!period.value) {
                valid = false;
                period.setCustomValidity("Lütfen 1-10 arası bir sayı giriniz");
                period.reportValidity();
            } if (valid && !grade.value) {
                valid = false;
                grade.setCustomValidity("Lütfen 0-100 arası bir sayı giriniz");
                grade.reportValidity();
            }
    
            if (!valid) {
                e.preventDefault();
            } else {
                e.preventDefault();
           $.post("update_grade.php", {gradeId: gradeId, period : period.value, grade: grade.value }, function(data) {                    
             
             if (data == 1) {
    
                 document.getElementById("error-info").classList.add("hidden");
                 document.getElementById("success-info").classList.add("hidden");
                 document.getElementById("deletion-success").classList.add("hidden");
                 document.getElementById("update-success-info").classList.remove("hidden");
                
                 var updateInfo =  document.getElementById("update-success-info");
                 var newText = "" + subject + "  adlı " + period.value + " dönemi için " + grade.value + " notu başarıyla güncellendi"; 
                 updateInfo.innerText = newText;
    
             } else if (data == 0) {
                 document.getElementById("success-info").classList.add("hidden");
                 document.getElementById("update-success-info").classList.add("hidden");
                 document.getElementById("deletion-success").classList.add("hidden");
                 document.getElementById("error-info").classList.remove("hidden");
    
             } 
    
         });
    
     }
    }
            }
        });
        




     

    // Select all elements with class 'sign_input'
var signInputs = document.querySelectorAll('.grades-input');

// Iterate over each sign_input element and add the event listener
signInputs.forEach(function(element) {
    element.addEventListener('input', function() {
        this.setCustomValidity('');
        this.reportValidity();
    });
});
    

document.getElementById("average-button").addEventListener("click", (e) => {
    $.get("find_average.php", {}, function(data) {   
        var parsedData = JSON.parse(data);
        if (!parsedData) {
            document.getElementById("average_span").innerText = "Veritabanında bir hata oluştu";
        } else {
            document.getElementById("average_span").innerText = "Ortalama: " + parseFloat(parsedData.average).toFixed(2);

        }
    });
});



});
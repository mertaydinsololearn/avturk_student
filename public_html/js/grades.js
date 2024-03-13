
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
	        classPeriod.setCustomValidity("Lütfen bir sayı giriniz");
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
                    document.getElementById("error-info").classList.remove("hidden");
                    document.getElementById("deletion-success").classList.add("hidden");

                } else {
                    document.getElementById("error-info").classList.add("hidden");
                    document.getElementById("success-info").classList.remove("hidden");
                    document.getElementById("deletion-success").classList.add("hidden");
        
                    var insertedData = parsedData.result;
                    var insertedGradeId = insertedData.id;

                    
                    var newRowHtml = 
                        '<tr id="' + insertedGradeId + '">' +
                            '<td>' + subjectIdText + '</td>' +
                            '<td>' + classPeriodVal + '</td>' +
                            '<td>' + courseGradeVal + '</td>' +
                            '<td><a class="btn btn-info btn-sm">Güncelle</a></td>' +
                            '<td><a class="btn btn-danger btn-sm delete-button">Sil</a></td>' +
                        '</tr>';
        
                    document.getElementById("grades-table").insertAdjacentHTML('beforeend', newRowHtml);
                }
            });
        }
    });

    // add event listeners to delete buttons
    var deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // Find the parent <tr> element and remove it
            var row = button.closest('tr');
            if (row) {
                var gradeId = row.getAttribute('id');

                $.post("delete_grade.php", {gradeId: gradeId}, function(data) {                    
                    
                    if (data == 1) {
                        row.remove();
                        document.getElementById("error-info").classList.add("hidden");
                        document.getElementById("success-info").classList.add("hidden");
                        document.getElementById("deletion-success").classList.remove("hidden");
                    } else if (data == 0) {
                        document.getElementById("error-info").classList.remove("hidden");
                        document.getElementById("success-info").classList.add("hidden");
                        document.getElementById("deletion-success").classList.add("hidden");
                    } 

                });

            }
        });
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
    

});
(function() {

    'use strict';

          var signinShow = document.getElementById('sign_in_show'),
        signinPasswordInput = document.getElementById('sign_in_password');

        signinShow.addEventListener('click', (e) => {
            e.preventDefault();

            if (signinShow.classList.contains('active') ) {
                signinPasswordInput.setAttribute('type', 'password');
                signinShow.classList.remove('active');
            } else {
            signinPasswordInput.setAttribute('type', 'text');
                signinShow.classList.add('active');
            }
        })

        var signupShow = document.getElementById('sign_up_show'),
        signupPasswordInput = document.getElementById('sign_up_password');

        signupShow.addEventListener('click', (e) => {
            e.preventDefault();

            if ( signupShow.classList.contains('active') ) {
                signupPasswordInput.setAttribute('type', 'password');
                signupShow.classList.remove('active');
            } else {
            signupPasswordInput.setAttribute('type', 'text');
                signupShow.classList.add('active');
            }
        })

})()


document.addEventListener("DOMContentLoaded", function(event) {

    document.getElementById("switch_sign_in").addEventListener("click", (e) => {
        document.getElementById("sign_in_form_div").classList.add("hidden");
        document.getElementById("sign_up_form_div").classList.remove("hidden");
    });

    document.getElementById("switch_sign_up").addEventListener("click", (e) => {
        document.getElementById("sign_up_form_div").classList.add("hidden");
        document.getElementById("sign_in_form_div").classList.remove("hidden");
    });
    
    
    document.getElementById("sign_in_form").addEventListener("submit", (e) => {

        var valid = true;
        var email = document.getElementById("sign_in_email");
        var emailVal = email.value;
        var password =  document.getElementById("sign_in_password");
        var passwordVal = password.value;

       if (emailVal.length > 255){
            valid = false;
	        email.setCustomValidity("Lütfen daha kısa bir e-posta yazınız");
	        email.reportValidity();
	    } 
    if (valid && passwordVal.length > 255){
            valid = false;
		    password.setCustomValidity("Daha kısa bir şifre giriniz");
		    password.reportValidity();
    	}


        if (!valid) {
            e.preventDefault();
        } else {
            e.preventDefault();
            $.post("sign_in.php", {email: emailVal, password: passwordVal}, function(data) 
            {
                if (data == 1) {
                    window.location.href = 'students.php';
                } else if (data == -1)
                {
                  email.setCustomValidity("E-posta veya şifre bulunamadı");
                  email.reportValidity();
                }  else if (data == 0) {
                    email.setCustomValidity("Veritabanında hata oluştu kısa bir süre sonra tekrar deneyinç");
                    email.reportValidity();
                }
        })
    }


    });

    document.getElementById("sign_up_form").addEventListener("submit", (e) => {

        var valid = true;
        var firstName = document.getElementById("first_name");
        var firstNameVal  = firstName.value;
        var lastName = document.getElementById("last_name");
        var lastNameVal  = lastName.value;
        var email = document.getElementById("sign_up_email");
        var emailVal = email.value;
        var password =  document.getElementById("sign_up_password");
        var passwordVal = password.value;


       if (firstNameVal.length > 255){
            valid = false;
	        firstName.setCustomValidity("Lütfen daha kısa bir isim yazınız.");
	        firstName.reportValidity();
	    } 
        if (valid && lastNameVal.length > 255){
            valid = false;
	        lastName.setCustomValidity("Lütfen daha kısa bir soyisim");
	        lastName.reportValidity();
	    } 
      if (valid && emailVal.length > 100){
            valid = false;
	        email.setCustomValidity("Lütfen daha kısa bir e-posta yazınız");
	        email.reportValidity();
	    } 
        
      if (valid && passwordVal.length > 100){
            valid = false;
		    password.setCustomValidity("Daha kısa bir şifre giriniz");
		    password.reportValidity();
    	}

        if (!valid) {
            e.preventDefault();
        } else {
            e.preventDefault();
            $.post("sign_up.php", {fname: firstNameVal, lname: lastNameVal, email: emailVal, password: passwordVal}, function(data) 
            {   
                if (data == 1) {
                    window.location.href = 'students.php';
                } else if (data == -1)
                {
                  email.setCustomValidity("Bu e-posta adresi kullanılmaktadır, lütfen başka bir e-posta giriniz");
                  email.reportValidity();
                }
                else if (data == 0){
                    email.setCustomValidity("Veritabanında hata oluştu kısa bir süre sonra tekrar deneyin");
                    email.reportValidity();
                }
        })
    }
    });


// Select all elements with class 'sign_input'
var signInputs = document.querySelectorAll('.sign_input');

// Iterate over each sign_input element and add the event listener
signInputs.forEach(function(element) {
    element.addEventListener('input', function() {
        this.setCustomValidity('');
        this.reportValidity();
    });
});


//As when a password or email doesn't match or can't be found one of them is called with setCustomValidity & reportValidity the other gets affected
document.getElementById("sign_in_email").addEventListener("input", (e) => {
    document.getElementById("sign_in_password").setCustomValidity('');
    document.getElementById("sign_in_password").reportValidity();
});
document.getElementById("sign_in_password").addEventListener("input", (e) => {
    document.getElementById("sign_in_email").setCustomValidity('');
    document.getElementById("sign_in_email").reportValidity();
});


document.getElementById("sign_up_email").addEventListener("input", (e) => {
    document.getElementById("sign_up_password").setCustomValidity('');
    document.getElementById("sign_up_password").reportValidity();
});
document.getElementById("sign_up_password").addEventListener("input", (e) => {
    document.getElementById("sign_up_email").setCustomValidity('');
    document.getElementById("sign_up_email").reportValidity();
});

});
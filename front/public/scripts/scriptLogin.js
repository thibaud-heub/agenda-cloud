document.addEventListener("DOMContentLoaded", function() {
    var loginForm = document.getElementById("login-form");
    var signupForm = document.getElementById("signup-form");
    var loginLink = document.getElementById("toLoginLink");
    var signupLink = document.getElementById("toCreateAcount");

    loginLink.addEventListener('click', function(){
        loginForm.style.display = "block";
        signupForm.style.display = "none";
    });

    signupLink.addEventListener('click', function(){
        loginForm.style.display = "none";
        signupForm.style.display = "block";
    });
});




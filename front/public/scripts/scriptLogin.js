document.addEventListener("DOMContentLoaded", function() {
    var loginForm = document.getElementById("login-form");
    var signUpForm = document.getElementById("signup-form");
    var loginLink = document.getElementById("toLoginLink");
    var signupLink = document.getElementById("toCreateAcount");

    loginLink.addEventListener('click', function(){
        loginForm.style.display = "block";
        signUpForm.style.display = "none";
    });

    signupLink.addEventListener('click', function(){
        loginForm.style.display = "none";
        signUpForm.style.display = "block";
    });    
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
    
            fetch('api/login', {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, password: password })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Login successful:', data);
                window.location.href = '/agenda';
            })
            .catch((error) => {
                console.error('Login error:', error);
            });
        });
    
        signUpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const Prenom = document.getElementById('name').value;
            const Nom = document.getElementById('LastName').value;
            const email = document.getElementById('email_from').value;
            const password = document.getElementById('password_form').value;
    
            fetch('api/signup', {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: Prenom, 
                    lastName: Nom,    
                    mail: email,        
                    password: password
                })
            })
            
            .then(response => response.json())
            .then(data => {
                console.log('Registration successful:', data);
                window.location.href = '/';

            })
            .catch((error) => {
                console.error('Registration error:', error);
            });
        });
    
        document.getElementById('toCreateAcount').addEventListener('click', function() {
            loginForm.style.display = 'none';
            signUpForm.style.display = 'block';
        });
    
        document.getElementById('toLoginLink').addEventListener('click', function() {
            signUpForm.style.display = 'none';
            loginForm.style.display = 'block';
        });
    });
    




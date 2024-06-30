document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword){
        document.getElementById('message').textContent = 'Passwords do not match';
        return;
    }
    fetch('/register', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password}),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success){
            alert('Registration Successful!');
            localStorage.setItem("username",data.user.username);
            window.location.href = '/dashboard';
        }
        else{
            document.getElementById("message").textContent = data.message;
        }
    })

});
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword){
        document.getElementById('message').textContent = 'Passwords do not match';
        setTimeout(() =>{
            document.getElementById('message').textContent = '';
        },5000);
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
            console.log(data);
            localStorage.setItem("userToken",data.accessToken);
            window.location.href = '/post.html';
        }
        else{
            document.getElementById("message").textContent = data.message;
            setTimeout(() =>{
                document.getElementById('message').textContent = '';
            },5000);
        }
    })
    .catch(error =>{
        console.error("Error:", error);
        document.getElementById("message").textContent = 'An error occured during the registration.'
        setTimeout(() =>{
            document.getElementById('message').textContent = '';
        },5000);
    })

});
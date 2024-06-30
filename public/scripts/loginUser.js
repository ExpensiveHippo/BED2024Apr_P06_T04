document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("You are now logged in!")
            localStorage.setItem("username",username);
            localStorage.setItem("id", data.id);
            window.location.href = '/post.html'; //enter next page if password is correct
        } else {
            document.getElementById('message').textContent = 'Invalid username or password';
            setTimeout(() =>{
                document.getElementById('message').textContent = '';
            },5000);
        }
    });
});

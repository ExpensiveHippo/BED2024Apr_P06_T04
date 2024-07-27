document.addEventListener('DOMContentLoaded',fetchProfile);
let profileUsername;
function checkAuthentication() {
    const token = localStorage.getItem("userToken");
    if (!token) {
        displayLoginMessage();
    } else {
        fetchProfile(token);
    }
}


function displayLoginMessage() {
    const mainContent = document.querySelector('body');
    mainContent.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; text-align: center;">
            <h1>You need to log in first</h1>
            <p>Please <a href="index.html">log in</a> to access your profile.</p>
        </div>
    `;
}

async function fetchProfile(token){
    if (token){
        await fetch('/Profile', {
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response =>{
            if (!response.ok){
                if (response.status === 403 || response.status === 401) {
                    // Token is expired or invalid
                    displayLoginMessage();
                    return;
                } else{
                    throw new Error('Error in network response');
                }
            }
            return response.json();
        })
        .then(data =>{
            if (data.success){
                profileUsername = data.user.username;
                document.getElementById('edit-profile-name').value = profileUsername
                document.getElementById('edit-profile-email').value = data.user.email;
                document.getElementById('edit-profile-bio').value = data.user.bio === null ? "No bio" : data.user.bio;
                document.getElementById('edit-profile-link').value = data.user.link === null ? "No bio": data.user.link;
            }
        })
    }
    else{
        console.error('No access token found');
    }
}

document.getElementById('save-changes').addEventListener('click', function(){
    
})
document.addEventListener('DOMContentLoaded',checkAuthentication);
let profileUsername;
const token = localStorage.getItem("userToken");
function checkAuthentication() {
    if (!token) {
        displayLoginMessage();
    } else {
        fetchProfileDetails(token);
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

async function fetchProfileDetails(token){
    if (token){
        await fetch('/getUser', {
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
                }
                else{
                    throw new Error("Failed to fetch Profile");
                }
            }
            return response.json();
        })
        .then(data =>{
            if (data.success){
                profileUsername = data.user.username;
                document.getElementById('edit-profile-name').value = profileUsername;
                document.getElementById('edit-profile-email').value = data.user.email;
                document.getElementById('edit-profile-bio').value = data.user.bio === null ? "No bio" : data.user.bio;
                document.getElementById('edit-profile-link').value = data.user.link === null ? "No Link": data.user.link;
            }
        })
    }
    else{
        console.error('No access token found');
    }
}

document.getElementById('save-changes').addEventListener('click', function(){
    const newProfileUsername = document.getElementById('edit-profile-name').value 
    const newProfileEmail = document.getElementById('edit-profile-email').value
    const newProfileBio = document.getElementById('edit-profile-bio').value
    const newProfileLink = document.getElementById('edit-profile-name').value
    
    
    if(token){
        updateProfile(token,newProfileUsername, newProfileEmail, newProfileBio, newProfileLink);
    }
    else{
        console.error('No access token found');
    }
})

async function updateProfile(token,newUsername, newEmail, newBio, newLink) {
    const bio = newBio.trim() === "" ? null : newBio;
    const link = newLink.trim() === "" ? null : newLink;

    await fetch('/updateProfile', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            newUsername: newUsername,
            newEmail: newEmail,
            newBio: bio,
            newLink: link
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update profile');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Profile updated successfully');
            localStorage.setItem("userToken",data.accessToken);
            window.location.href = "profile.html"
        } else {
            alert('Failed to update profile: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error updating profile:', error);
        alert('Error updating profile');
    });
}
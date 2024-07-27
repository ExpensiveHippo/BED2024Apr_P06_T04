document.addEventListener('DOMContentLoaded', checkAuthentication); 
    const token = localStorage.getItem("userToken");

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
                    //handles expired tokens
                    if (response.status === 403 || response.status === 401) {
                        // Token is expired or invalid
                        displayLoginMessage();
                        return;
                    }
                }
                else{
                    throw new Error("Network error")
                }
                return response.json()
            })
            .then(data =>{
                const profileName = document.getElementById('profile-name');
                const profileRole = document.getElementById('profile-role');
                const profileEmail = document.getElementById('profile-email');
                const profileLink = document.getElementById('profile-link');
                const profileBio = document.getElementById('profile-bio');
                if (data.success){
                    profileName.textContent = data.user.username;
                    const userRole = data.user.role;
                    profileRole.textContent = userRole[0].toUpperCase() + userRole.slice(1);
                    profileEmail.textContent = data.user.email;
                    if (data.user.bio === null){
                        profileBio.textContent = "No biography"
                    } else{
                        profileBio.textContent = data.user.bio;
                    }
                    if (data.user.link === null){
                        profileLink.textContent = "No link"
                    } else{
                        profileLink.textContent = data.user.link;
                    }
                }
                else{
                    profileName.textContent = "Unable to fetch"
                    profileRole.textContent = "Unable to fetch"
                    console.error('Failed to fetch', data.message);
                }
            })
            .catch(error =>{
                console.error('Issue with fetch operation', error);
            })
        }
        else{
            console.error('No access token found');
        }
    }
    
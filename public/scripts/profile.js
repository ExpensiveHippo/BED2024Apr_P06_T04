document.addEventListener('DOMContentLoaded', (event) =>{
    const token = localStorage.getItem("userToken");
    
    if (token){
        fetch('/Profile', {
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response =>{
            if (!response.ok){
                throw new Error('Error in network response');
            }
            return response.json();
        })
        .then(data =>{
            const profileName = document.getElementById('profile-name');
            const profileRole = document.getElementById('profile-role');
            if (data.success){
                profileName.textContent = data.user.username;
                profileRole.textContent = data.user.role;
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
})
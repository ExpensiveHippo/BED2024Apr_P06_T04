
fetchSearchedProfile();

async function fetchSearchedProfile(){
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    const token = localStorage.getItem('userToken');
    try{
        const response = await fetch(`/getSearchedProfile/${username}`,{
            method: 'GET',
        });
        if (!response.ok){
            throw new Error('Error getting searched user profile');
        }
        const data = await response.json();
        // get elements from profile.html
        if (data.user){
            updateProfileUI(data,token, username);
        }
        else{
            console.log(data.message);
        }
    }
    catch(err){
        alert('Error fetching searched profile: ', err);
    }
}


function updateProfileUI(data, token, searchedUsername) {
    const profileName = document.getElementById('profile-name');
    const profileRole = document.getElementById('profile-role');
    const profileEmail = document.getElementById('profile-email');
    const profileLink = document.getElementById('profile-link');
    const profileBio = document.getElementById('profile-bio');
    const editButton = document.getElementById('edit-profile-button');

    if (data.success) {
        profileName.textContent = data.user.username;
        const userRole = data.user.role;
        profileRole.textContent = userRole[0].toUpperCase() + userRole.slice(1);    //Capitalize User role 
        profileEmail.textContent = data.user.email;
        profileBio.textContent = data.user.bio || "No biography";   //displays something instead of NULL
        profileLink.textContent = data.user.link || "No link";      //displays something instead of NULL

        if (token) {
            fetch(`/getUser`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.user.username === searchedUsername) {
                    editButton.style.display = 'block';     //enables signed-in user who searched for their profile in search bar to edit their profile
                } 
                else {
                    editButton.style.display = 'none';      //disables the edit-button for when signed-in users is looking at someone else's profile.
                }
            });
        } 
        else {
            editButton.style.display = 'none';  //if user isn't signed in, it should naturally disable the editButton 
        }
    } 
    else {
        profileName.textContent = "Unable to fetch";
        profileRole.textContent = "Unable to fetch";
        console.error('Failed to fetch', data.message);
    }
}

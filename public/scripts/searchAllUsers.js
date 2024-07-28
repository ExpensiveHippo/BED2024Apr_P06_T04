document.addEventListener('DOMContentLoaded', fetchUsernames());

let usernames = []; //get all users

async function fetchUsernames(){
    try{
        const response = await fetch('/getAllUsers', {
            method: 'GET',
        });
        if (!response.ok){
            throw new Error('Failed to fetch usernames');
        }
        const data = await response.json();
        if (data.success){
            usernames = data.usernameArray;
        }else{
            alert(data.message);
        }
    }
    catch(err){
        console.error(err);
    }
}

document.getElementById('user-search-input').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const suggestionsContainer = document.getElementById('user-suggestions');
    suggestionsContainer.innerHTML = '';
    if (query) {
        const filteredUsernames = usernames.filter(username => username.toLowerCase().includes(query)).slice(0,5);  //Limit up to 5 search results
        filteredUsernames.forEach(username => {
            const suggestion = document.createElement('div');
            suggestion.className = 'suggestion';
            suggestion.textContent = username;
            suggestion.addEventListener('click', () => {
                window.location.href = `/profile.html?username=${username}`
            });
            suggestionsContainer.appendChild(suggestion);
        });
    }
});

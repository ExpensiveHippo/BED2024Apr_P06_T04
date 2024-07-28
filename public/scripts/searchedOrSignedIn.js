// in presence of search params, run different JS files
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('username')) {
        const script = document.createElement('script');
        script.src = './scripts/searchedProfile.js';
        document.body.appendChild(script);
        script.onload = () =>{
          console.log('searchProfile.js executed')
        }
    } else {
        const script = document.createElement('script');
        script.src = './scripts/userProfile.js';
        document.body.appendChild(script);
        script.onload = () =>{
          console.log('Profile.js executed')
        }
    }
});
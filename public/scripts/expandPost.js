
document.addEventListener('DOMContentLoaded', fetchUser);

async function fetchUser(){
    const token = localStorage.getItem("userToken");
    if (token){ 
        await fetch('/getUser', { 
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
                    return; 
                } 
            } 
            return response.json() 
        }) 
        .then(data =>{
            if (data.success){
                signedInUser  = data.user.username
                fetchPostDetail(signedInUser)
            }
        })
}}

async function fetchPostDetail(username) {
    // Extract the postId from the query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = localStorage.getItem("userToken");
    const postId = urlParams.get('postId');
    if (!postId) {
        console.error('Post ID not found in query parameters.');
        return;
    }
    try {
        const response = await fetch(`/Posts/${postId}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`}}); // Endpoint to get post by ID
        
        if (!response.ok) {
            throw new Error(`Failed to fetch post: ${response.status} ${response.statusText}`);
        }
        const post = await response.json();
        const postDetailContainer = document.getElementById('postDetailContainer');
        if (!postDetailContainer) {
            console.error('Post detail container not found.');
            return;
        }
        postDetailContainer.innerHTML = `
            <h5>Posted By: ${post.post.username}</h5>
            <h2>${post.post.title}</h2>
            <p>${post.post.content}</p>
            <div class="post-icons">
                <button class="fas fa-heart"></button>
                <button class="fas fa-comment" id="commentIcon"></button>
                <button class="fa fa-ellipsis-v" aria-hidden="true"></button>
            </div>
        `;
        const iconLike = postDetailContainer.querySelector('.fa-heart');
        const iconComment = postDetailContainer.querySelector('.fa-comment');
        const iconKebab = postDetailContainer.querySelector('.fa-ellipsis-v');
        const dropdownMenu = document.getElementById('dropdownMenu');

        if (username === post.post.username) {
            document.querySelector('.edit-option').style.display = 'block';
            document.querySelector('.delete-option').style.display = 'block';

            document.querySelector('.edit-option').href = `updatePost.html?postId=${postId}`;
            document.querySelector('.delete-option').href = `deletePost.html?postId=${postId}`;
        } else {
            document.querySelector('.edit-option').style.display = 'none';
            document.querySelector('.delete-option').style.display = 'none';
        }
      
        // Toggle dropdown menu visibility
        iconKebab.addEventListener('click', () => {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        });

        // Handle click outside to close dropdown
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.post-icons')) {
                dropdownMenu.style.display = 'none';
            }
        });
        // get arguements for Like
        const token = localStorage.getItem('userToken');
        const contentType = "Posts";
        const contentId = postId;
      
        document.getElementById("kebabReport").addEventListener('click', () => {
            document.getElementById("reason-container").style.display = "block";
        })

        document.getElementById("btn-cancel").addEventListener('click', () => {
            document.getElementById("reason-container").style.display = "none";
        })

        document.getElementById("btn-submit").addEventListener('click', () => {
            const reason = document.getElementById("selectReason").value;
            document.getElementById("reason-container").style.display = "none";

            var body = {
                industry: "Education",
                contentType: "Posts",
                contentId: postId,
                reason: reason
            }

            fetch (`/createReport`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            .then(res => {
                if (res.status === 201) {
                    console.log("createReport:success");
                } else {
                    console.log("createReport:failure");
                }
            })
            .catch(error => console.error(error));
        })
        
        fetch(`/like/${contentType}/${contentId}`, {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data != null) {
                iconLike.classList.toggle('clicked');
            }
        })
        .catch(error => console.log("Error: " + error))  
        iconLike.addEventListener('click', async () => {
            // default to add like
            var method = 'POST';
            var endpoint = '/like';
            // if user has already liked, change method and endpoint to del like
            if (iconLike.classList.contains('clicked')) {
                method = 'DELETE';
                endpoint = '/unlike';
            }
            const requestBody = {
                contentType: contentType,
                contentId: contentId
            }
            
            // send request
            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(requestBody)
            });
            
            // if changes are recorded in db, then change appearance of like icon
            if (response.ok) {
                iconLike.classList.toggle('clicked');
            } 
        })
        iconComment.addEventListener('click', () => {
            window.location.href = 'comment.html';
        });
    }   
    catch (error) {
        console.error('Error fetching post details:', error);
    }
}
document.addEventListener('DOMContentLoaded', fetchPostDetail);

async function fetchPostDetail() {
    // Extract the postId from the query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');

    if (!postId) {
        console.error('Post ID not found in query parameters.');
        return;
    }

    try {
        const response = await fetch(`/Posts/${postId}`); // Endpoint to get post by ID
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
                <button class="fas fa-comment"></button>
                <button class="fa fa-ellipsis-v" aria-hidden="true"></button>
            </div>
        `;
        
        // get icons
        const iconLike = postDetailContainer.querySelector('.fa-heart');
        const iconComment = postDetailContainer.querySelector('.fa-comment');
        const iconKebab = postDetailContainer.querySelector('fa-ellipsis-v');

        // get arguements for Like
        const token = localStorage.getItem('userToken');
        const contentType = "Posts";
        const contentId = postId;

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
    }   
    catch (error) {
        console.error('Error fetching post details:', error);
    }
}



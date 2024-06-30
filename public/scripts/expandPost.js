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
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Expected JSON response from server');
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

        // !------------------------------------------------NEED TO CHECK IF USER HAS LIKED POST BEFORE
        
        // get icons
        const iconLike = postDetailContainer.querySelector('.fa-heart');
        const iconComment = postDetailContainer.querySelector('.fa-comment');
        const iconKebab = postDetailContainer.querySelector('fa-ellipsis-v');

        iconLike.addEventListener('click', async () => {

            // default to add like
            var method = 'POST';
            var endpoint = '/like';

            // if user has already liked, change method and endpoint to del like
            if (iconLike.classList.contains('clicked')) {
                method = 'DELETE';
                endpoint = '/unlike';
            }

            // get arguements for Like
            const userId = localStorage.getItem('id');
            const contentType = "Posts";
            const contentId = postId;
            const requestBody = {
                userId: userId,
                contentType: contentType,
                contentId: contentId
            }
            console.log(requestBody);
            // send request
            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            
            // if changes are recorded in db, then change appearance of like icon
            if (response.ok) {
                iconLike.classList.toggle('clicked');
            } 
        })
        }  catch (error) {
        console.error('Error fetching post details:', error);
    }
}



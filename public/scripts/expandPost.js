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
                <button class="fas fa-heart" onclick="this.style.color = (this.style.color === 'black' ? '' : 'black')"></button>
                <button class="fas fa-comment"></button>
                <button class="fa fa-ellipsis-v" aria-hidden="true"></button>
            </div>
        `;
        const icons = postElement.querySelectorAll('.post-icons i');
        icons.forEach(icon => {
            icon.addEventListener('click', () => {
                icon.classList.toggle('clicked');
            });
        });
        }  catch (error) {
        console.error('Error fetching post details:', error);
    }
}



document.addEventListener('DOMContentLoaded', () => {
    const updatePostForm = document.getElementById('updatePostForm');

    createPostForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const accessToken = localStorage.getItem("userToken");
        const username = localStorage.getItem("username");
        const postId = document.getElementById('postId').value;
        const industry = document.getElementById('industry').value;
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;

        try {
            const response = await fetch("/updatePost", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ postId, industry, title, content})
            });

            const result = await response.json();
            if (result.success) {
                alert('Post created successfully!');
                // Optionally, redirect to the posts page
                window.location.href = '/post.html';
            } else {
                alert('Failed to create post: ' + result.message);
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Error creating post');
        }
    });
});

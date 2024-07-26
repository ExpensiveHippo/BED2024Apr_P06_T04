document.addEventListener('DOMContentLoaded', () => {
    const createPostForm = document.getElementById('createPostForm');

    createPostForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const accessToken = localStorage.getItem("userToken");
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const industry = document.getElementById('industry').value;

        try {
            const response = await fetch("/createPost", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({title, content, industry })
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

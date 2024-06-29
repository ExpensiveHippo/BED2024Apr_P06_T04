document.addEventListener('DOMContentLoaded', () => {
    const createPostForm = document.getElementById('createPostForm');

    createPostForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;

        try {
            const response = await fetch('/Posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, title, content })
            });

            const result = await response.json();
            if (result.success) {
                alert('Post created successfully!');
                // Optionally, redirect to the posts page
                window.location.href = '/posts.html';
            } else {
                alert('Failed to create post: ' + result.message);
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Error creating post');
        }
    });
});

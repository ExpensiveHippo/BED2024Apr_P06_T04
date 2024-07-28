document.addEventListener('DOMContentLoaded', () => {
    const updatePostForm = document.getElementById('updatePostForm');
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');
    updatePostForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const accessToken = localStorage.getItem("userToken");
        const industry = document.getElementById('industry').value;
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;

        try {
            const response = await fetch(`/updatePost/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ industry, title, content })
            });

            const result = await response.json();
            if (result.success) {
                alert('Post updated successfully!');
                // Optionally, redirect to the posts page
                window.location.href = '/post.html';
            } else {
                alert('Failed to update post: ' + result.message);
            }
        } catch (error) {
            console.error('Error updating post:', error);
            alert('Error updatin post');
        }
    });
});

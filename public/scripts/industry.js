document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.view-posts-button');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const industry = button.getAttribute('data-industry');
            viewRelatedPosts(industry);
        });
    });
});

function viewRelatedPosts(industry) {
    // Redirect to posts.html with the industry as a query parameter
    window.location.href = `post.html?industry=${industry}`;
}
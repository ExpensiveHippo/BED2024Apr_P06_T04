document.addEventListener('DOMContentLoaded', fetchPosts);

        async function fetchPosts() {
            try {
                const response = await fetch("/Posts"); // Correct endpoint
                if (!response.ok) {
                    throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
                }
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('Expected JSON response from server');
                }
                const data = await response.json();

                const postsContainer = document.getElementById('postsContainer');
                if (!postsContainer) {
                    console.error('Posts container not found.');
                    return;
                }
                postsContainer.innerHTML = ''; // Clear previous content

                if (data.success && data.posts && data.posts.length > 0) {
                    data.posts.forEach(post => {
                        const postElement = document.createElement('div');
                        postElement.classList.add('post');
                        postElement.innerHTML = `
                            <h2>${post.title}</h2>
                            <p>${post.content}</p>
                        `;
                        postsContainer.appendChild(postElement);
                    });
                } else {
                    const message = document.createElement('p');
                    message.textContent = data.message || 'No posts found.';
                    postsContainer.appendChild(message);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        }
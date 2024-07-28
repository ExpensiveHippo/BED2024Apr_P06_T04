document.addEventListener("DOMContentLoaded", () => {
    fetchComments();
 
    document.getElementById("commentForm").addEventListener("submit", async (event) => {
        event.preventDefault();
       
        const userId = document.getElementById("userId").value;
        const contentType = document.getElementById("contentType").value;
        const contentId = document.getElementById("contentId").value;
        const content = document.getElementById("content").value;
 
        try {
            const response = await fetch('/createComment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, contentType, contentId, content })
            });
           
            if (response.ok) {
                alert('Comment added successfully!');
                fetchComments(); // Refresh comments list
            } else {
                alert('Failed to add comment.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error adding comment.');
        }
    });
});
 
async function fetchComments() {
    try {
        const response = await fetch('/Comments');
        const data = await response.json();
        console.log(data);
        if (data.success) {
            displayComments(data.comments);
        } else {
            alert('Failed to fetch comments.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching comments.');
    }
}
 
function displayComments(comments) {
    const commentContainer = document.getElementById("commentContainer");
    commentContainer.innerHTML = ''; // Clear previous comments
 
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        commentElement.dataset.commentId = comment.commentId;
 
        commentElement.innerHTML = `
            <p><strong>User:</strong> ${comment.username}</p>
            <p><strong>Content:</strong> ${comment.content}</p>
            <select onchange="handleCommentAction(${comment.userId}, ${comment.commentId}, this.value, this)">
                <option value="">Select Action</option>
                <option value="delete">Delete</option>
                <option value="update">Update</option>
                <option value="view">View All User Comments</option>
            </select>
        `;
        
        commentContainer.appendChild(commentElement);
    });
}
 
async function handleCommentAction(userId, commentId, action, element) {
    switch (action) {
        case 'delete':
            deleteComment(commentId);
            break;
        case 'update':
            updateComment(commentId);
            break;
        case 'view':
            viewUserDetails(userId, element);
            break;
        default:
            console.error('Unknown action:', action);
    }
}
 
async function deleteComment(commentId) {
    try {
        const response = await fetch(`/deleteComments/${commentId}`, {
            method: 'DELETE'
        });
 
        if (response.ok) {
            alert('Comment deleted successfully!');
            fetchComments(); // Refresh comments list
        } else {
            alert('Failed to delete comment.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error deleting comment.');
    }
}
 
async function updateComment(commentId) {
    const newContent = prompt('Enter new content:');
   
    if (newContent) {
        try {
            const response = await fetch(`/updateComments/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: newContent })
            });
           
            if (response.ok) {
                alert('Comment updated successfully!');
                fetchComments(); // Refresh comments list
            } else {
                alert('Failed to update comment.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error updating comment.');
        }
    }
}
 
async function viewUserDetails(userId, dropdownElement) {
    try {
        const response = await fetch(`/Comments/${userId}`);
        const data = await response.json();
        console.log(data);
 
        if (data.success) {
            const userDetails = document.createElement('div');
            userDetails.classList.add('user-details');
 
            data.comments.forEach(comment => {
                userDetails.innerHTML += `
                    <p><strong>Comment:</strong> ${comment.content}</p>
                `;
            });
            userDetails.innerHTML += `<br>`;
            const commentElement = dropdownElement.parentElement;
            const existingDetails = commentElement.querySelector('.user-details');
            if (existingDetails) {
                existingDetails.remove();
            }
 
            commentElement.appendChild(userDetails);
        } else {
            alert('Failed to fetch user details.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching user details.');
    }
}
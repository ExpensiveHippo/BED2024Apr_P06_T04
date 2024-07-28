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

      commentElement.innerHTML = `
          <p><strong>User ID:</strong> ${comment.userId}</p>
          <p><strong>Content Type:</strong> ${comment.contentType}</p>
          <p><strong>Content ID:</strong> ${comment.contentId}</p>
          <p><strong>Content:</strong> ${comment.content}</p>
          <button onclick="deleteComment(${comment.commentId})">Delete</button>
          <button onclick="updateComment(${comment.commentId})">Update</button>
          <button onclick="viewDetails(${comment.commentId})">View Details</button>
      `;

      commentContainer.appendChild(commentElement);
  });
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

async function viewDetails(commentId) {
  try {
      const response = await fetch(`/Comments/${commentId}`);
      const data = await response.json();

      if (data.success) {
          alert(`Comment Details:\nUser ID: ${data.comment.userId}\nContent Type: ${data.comment.contentType}\nContent ID: ${data.comment.contentId}\nContent: ${data.comment.content}`);
      } else {
          alert('Failed to fetch comment details.');
      }
  } catch (error) {
      console.error('Error:', error);
      alert('Error fetching comment details.');
  }
}

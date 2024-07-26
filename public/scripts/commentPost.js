async function fetchComments() {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId');
  const endpoint = userId ? `/Comments/${userId}` : "/Comments";

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Failed to fetch comments: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);

    const commentList = document.getElementById("commentContainer");
    commentList.innerHTML = ''; 

    data.comments.forEach((comment) => {
      const commentItem = document.createElement("div");
      commentItem.classList.add("comment");

      const titleElement = document.createElement("h2");
      titleElement.textContent = `Comment: ${comment.comment}`;

      const likedElement = document.createElement("p");
      likedElement.textContent = `Liked: ${comment.liked}`;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener('click', () => deleteComment(comment.commentId));

      commentItem.appendChild(titleElement);
      commentItem.appendChild(likedElement);
      commentItem.appendChild(deleteButton);

      commentList.appendChild(commentItem);
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
}

async function deleteComment(commentId) {
  console.log(`Deleting comment with ID: ${commentId}`);
  try { userId ? `/Comments/${userId}` : "/Comments"
      const response = await fetch(`/deleteComments/${commentId}`, {method: 'DELETE',});

      if (response.ok) {
          console.log(`Comment with ID ${commentId} deleted successfully`);
          fetchComments(); // Re-fetch comments to update the list
      } else {
          console.error(`Failed to delete comment with ID ${commentId}:`, await response.text());
      }
  } catch (error) {
      console.error(`Error deleting comment with ID ${commentId}:`, error);
  }
}

async function updateComment(commentId) {
  console.log(`Updating comment with ID: ${commentId}`);
  try { userId ? `/Comments/${userId}` : "/Comments"
      const response = await fetch(`/updateComments/${commentId}`, {method: 'PUT',});
      if (response.ok) {
          console.log(`Comment with ID ${commentId} updated successfully`);
          fetchComments(); // Re-fetch comments to update the list
      } else {
          console.error(`Failed to update comment with ID ${commentId}:`, await response.text());
      }
  } catch (error) {
      console.error(`Error updating comment with ID ${commentId}:`, error);
  }
}


fetchComments();


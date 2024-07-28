document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = localStorage.getItem("userToken");
    const postId = urlParams.get('postId');
    document.getElementById("delete-button").addEventListener('click', () => deletePost(accessToken,postId));
})

async function deletePost(accessToken,postId){
    await fetch(`/deletePost/${postId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    })
    
    .then(response =>{
        if (!response.ok){
            if (response.status === 403 || response.status === 401) {
                return;
            }
            throw new Error('Failed to delete post');
        }
        return response.json();
    })
    .then(data =>{
        if (data.success){
            alert("Successfully deleted Post. Navigating back to Post");
            window.location.href = "post.html";
        }
        else{
            alert(data.message);
        }
    })
    .catch(err => {
        console.error(err);
        alert('Error occured while deleting post...');
    });
}
   
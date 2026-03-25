import {
  getPosts,
  getUsers,
  getComments,
  getCurrentUser,
  logoutUser
} from "./helperFuncs.js";

// prohibit access if not logged in
const currentUser = getCurrentUser();
if (!currentUser) {
  window.location.href = "login.html";
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  logoutUser();
  window.location.href = "login.html";
});

// Getting postId from URL
function getPostIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("postId");
}

// Render the selected post
function renderSinglePost() {
  const postId = getPostIdFromUrl();
  const posts = getPosts();
  const users = getUsers();

  const post = posts.find(p => p.id === postId);
  const postContainer = document.getElementById("singlePost");

  if (!post) {
    postContainer.innerHTML = `<p>Post not found.</p>`;
    return;
  }

  const author = users.find(u => u.id === post.userId);
  const likeCount = post.likes ? post.likes.length : 0;
  const commentCount = post.comments ? post.comments.length : 0;

  postContainer.innerHTML = `
    <div class="post">
      <h3>${author ? author.username : "Unknown User"}</h3>
      <p>${post.content}</p>
      <small>${post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}</small>
      <p><strong>Likes:</strong> ${likeCount}</p>
      <p><strong>Comments:</strong> ${commentCount}</p>
    </div>
  `;
}

// Render all comments for this post
function renderComments() {
  const postId = getPostIdFromUrl();
  const comments = getComments();
  const users = getUsers();
  const commentsList = document.getElementById("commentsList");

  const postComments = comments.filter(comment => comment.postId === postId);

  if (postComments.length === 0) {
    commentsList.innerHTML = `<p>No comments yet.</p>`;
    return;
  }

  commentsList.innerHTML = "";

  postComments.forEach(comment => {
    const author = users.find(u => u.id === comment.userId);

    const div = document.createElement("div");
    div.className = "comment";

    div.innerHTML = `
      <h4>${author ? author.username : "Unknown User"}</h4>
      <p>${comment.content}</p>
      <small>${comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ""}</small>
    `;

    commentsList.appendChild(div);
  });
}
renderSinglePost();
renderComments();
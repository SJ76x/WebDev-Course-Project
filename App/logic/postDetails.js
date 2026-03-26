import {
  getPosts,
  savePosts,
  getUsers,
  getComments,
  saveComments,
  getCurrentUser,
  logoutUser,
  generateId } from "./helperFuncs.js";

// Check if logged in
const currentUser = getCurrentUser();
if (!currentUser) {
  window.location.href = "login.html";
}

//Logout button functionality
document.getElementById("logoutBtn").addEventListener("click", () => {
  logoutUser();
  window.location.href = "login.html";
});

function getPostIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("postId");
}

// Show selected post:
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
      <small>${post.createdAt || ""}</small>
      <p><strong>Likes:</strong> ${likeCount}</p>
      <p><strong>Comments:</strong> ${commentCount}</p>
    </div>
  `;
}

// Show comments
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
      <small>${comment.createdAt || ""}</small>
    `;

    commentsList.appendChild(div);
  });
}

// Add new comment
function addComment() {
  const input = document.getElementById("commentInput");
  const content = input.value.trim();
  const postId = getPostIdFromUrl();

  if (content === "") {
    alert("Comment cannot be empty!");
    return;
  }

  let comments = getComments();
  let posts = getPosts();

  const post = posts.find(p => p.id === postId);

  if (!post) {
    alert("Post not found.");
    return;
  }

  const newComment = {
    id: generateId("comment"),
    postId: postId,
    userId: currentUser.id,
    content: content,
    createdAt: new Date().toLocaleString()
  };

  comments.push(newComment);
  saveComments(comments);

  if (!post.comments) {
    post.comments = [];
  }

  post.comments.push(newComment.id);
  savePosts(posts);

  input.value = "";

  renderSinglePost();
  renderComments();
}

//"Add comment" button functionality:
document.getElementById("addCommentBtn").addEventListener("click", addComment);

// Loadding the page~
renderSinglePost();
renderComments();
import {
  getPosts,
  savePosts,
  getUsers,
  getComments,
  saveComments,
  getCurrentUser,
  logoutUser,
  generateId } from "./helperFuncs.js";

import { toggleLike, deletePost } from "./post.js";


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

  const userLiked = post.likes.includes(currentUser.id);

  const author = users.find(u => u.id === post.userId);


  postContainer.innerHTML = `
    <div class="post" id="singlePost">
      <img src=${author.profilePicture} alt="Profile Picture" class="post-avatar">
  
      <h3 class="post-author">${author ? author.username : "Unknown User"}</h3>
      <p class="post-content">${post.content}</p>
      <small class="post-date">${post.createdAt}</small>
      <br><br>

      <button class="like-btn" data-id="${post.id}">
        ${userLiked ? "Unlike" : "Like"} (${post.likes.length})
      </button>

      <button class="details-btn" data-id="${post.id}">
        Comment (${post.comments.length})
      </button>

      ${
        post.userId === currentUser.id
          ? `<button class="delete-button" data-id="${post.id}">Delete</button>`
          : ""
      }

    </div>
  `;

  // Like button
  document.querySelectorAll(".like-btn").forEach(button => {
    button.addEventListener("click", () => {
      toggleLike(button.dataset.id);
      renderSinglePost();
    });
  });

  // View details button
  document.querySelectorAll(".details-btn").forEach(button => {
    button.addEventListener("click", () => {
      window.location.href = "post.html?postId=" + button.dataset.id;
    });
  });

  // Delete button
  document.querySelectorAll(".delete-button").forEach(button => {
    button.addEventListener("click", () => {
      deletePost(button.dataset.id);
      window.location.href = "feed.html";
    });
  });

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
      <img src=${author.profilePicture} alt="Profile Picture" class="post-avatar">
      <h3 class="comment-author">${author ? author.username : "Unknown User"}</h4>
      <p class="comment-content">${comment.content}</p>
      <small class="comment-date">${comment.createdAt || ""}</small>
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


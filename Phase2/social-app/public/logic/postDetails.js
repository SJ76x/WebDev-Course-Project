import { getCurrentUser, logoutUser, getPostById, getCommentsByPost, toggleLike, deletePost, addComment } from './helperFuncs.js';

function getPostIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("postId");
}

async function renderSinglePost() {
  const postId = getPostIdFromUrl();
  const currentUser = await getCurrentUser();
  const post = await getPostById(postId);
  const postContainer = document.getElementById("singlePost");

  if (!post) {
    postContainer.innerHTML = `<p>Post not found.</p>`;
    return;
  }

  const userLiked = post.likes.some(l => l.userId === currentUser.id);

  postContainer.innerHTML = `
    <div class="post">
      <img src="${post.author.profilePicture || '../images/default-avatar.jpeg'}" alt="Profile Picture" class="post-avatar">
      <h3 class="post-author">${post.author.username}</h3>
      <p class="post-content">${post.content}</p>
      <small class="post-date">${new Date(post.createdAt).toLocaleString()}</small>
      <br><br>
      <button class="like-btn" data-id="${post.id}">
        ${userLiked ? "Unlike" : "Like"} (${post._count.likes})
      </button>
      ${post.authorId === currentUser.id
        ? `<button class="delete-button" data-id="${post.id}">Delete</button>`
        : ""}
    </div>
  `;

  document.querySelector(".like-btn").addEventListener("click", async () => {
    await toggleLike(post.id, currentUser.id);
    await renderSinglePost();
  });

  const deleteBtn = document.querySelector(".delete-button");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", async () => {
      await deletePost(post.id);
      window.location.href = "feed.html";
    });
  }
}

async function renderComments() {
  const postId = getPostIdFromUrl();
  const comments = await getCommentsByPost(postId);
  const commentsList = document.getElementById("commentsList");

  if (comments.length === 0) {
    commentsList.innerHTML = `<p>No comments yet.</p>`;
    return;
  }

  commentsList.innerHTML = "";
  comments.forEach(comment => {
    const div = document.createElement("div");
    div.className = "comment";
    div.innerHTML = `
      <img src="${comment.author.profilePicture || '../images/default-avatar.jpeg'}" alt="Profile Picture" class="post-avatar">
      <h3 class="comment-author">${comment.author.username}</h3>
      <p class="comment-content">${comment.content}</p>
      <small class="comment-date">${new Date(comment.createdAt).toLocaleString()}</small>
    `;
    commentsList.appendChild(div);
  });
}

async function handleAddComment() {
  const input = document.getElementById("commentInput");
  const content = input.value.trim();
  const postId = getPostIdFromUrl();
  const currentUser = await getCurrentUser();

  if (content === "") {
    alert("Comment cannot be empty!");
    return;
  }

  await addComment(postId, content, currentUser.id);
  input.value = "";
  await renderComments();
}

async function init() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("logoutBtn").addEventListener("click", () => {
    logoutUser();
    window.location.href = "login.html";
  });

  document.getElementById("addCommentBtn").addEventListener("click", handleAddComment);

  await renderSinglePost();
  await renderComments();
}

init();
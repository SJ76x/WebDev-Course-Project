import { generateId, getPosts, savePosts, getCurrentUser, getUsers } from './helperFuncs.js';

// CREATE POST
export function createPost() {
  const input = document.getElementById("postInput");
  const content = input.value.trim();
  const user = getCurrentUser();

  if (content === "") {
    alert("Post cannot be empty!");
    return;
  }

  const newPost = {
    id: generateId("post"),
    userId: user.id,
    content: content,
    image: "",
    likes: [],
    comments: [],
    createdAt: new Date().toLocaleString()
  };

  let posts = getPosts();
  posts.unshift(newPost);
  savePosts(posts);

  input.value = "";
  renderPosts();
}

// DELETE POST
export function deletePost(id) {
  let posts = getPosts();
  posts = posts.filter(post => post.id !== id);
  savePosts(posts);
  renderPosts();
}

// like feature
function toggleLike(postId) {
  let posts = getPosts();
  const currentUser = getCurrentUser();

  const post = posts.find(p => p.id === postId);

  if (!post || !currentUser) return;

  if (!post.likes) post.likes = [];

  const alreadyLiked = post.likes.includes(currentUser.id);

  if (alreadyLiked) {
    post.likes = post.likes.filter(userId => userId !== currentUser.id);
  } else {
    post.likes.push(currentUser.id);
  }

  savePosts(posts);
  renderPosts();
}

// FILTER POSTS (FOLLOW SYSTEM)
function getFeedPosts() {
  let posts = getPosts();
  const user = getCurrentUser();

  if (!user.following) return posts;

  return posts.filter(post =>
    user.following.includes(post.userId) || post.userId === user.id
  );
}

// RENDER POSTS
export function renderPosts() {
  const feed = document.getElementById("feed");
  const currentUser = getCurrentUser();
  const posts = getFeedPosts();

  feed.innerHTML = "";

  posts.forEach(post => {
    const author = getUsers().find(u => u.id === post.userId);

    if (!post.likes) post.likes = [];
    if (!post.comments) post.comments = [];

    const userLiked = post.likes.includes(currentUser.id);

    const div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <h3>${author ? author.username : "Unknown User"}</h3>
      <p>${post.content}</p>
      <small>${post.createdAt}</small>
      <br><br>

      <button class="like-btn" data-id="${post.id}">
        ${userLiked ? "Unlike" : "Like"} (${post.likes.length})
      </button>

      <button class="details-btn" data-id="${post.id}">
        View Details (${post.comments.length})
      </button>

      ${
        post.userId === currentUser.id
          ? `<button class="delete-button" data-id="${post.id}">Delete</button>`
          : ""
      }
    `;

    feed.appendChild(div);
  });

  // Like button
  document.querySelectorAll(".like-btn").forEach(button => {
    button.addEventListener("click", () => {
      toggleLike(button.dataset.id);
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
    });
  });
}
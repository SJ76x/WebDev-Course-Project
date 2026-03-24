// CHECK LOGIN
const user = JSON.parse(localStorage.getItem("currentUser"));

if (!user) {
  window.location.href = "login.html";
}

// LOGOUT
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

// CREATE POST
function createPost() {
  const input = document.getElementById("postInput");
  const content = input.value.trim();

  if (content === "") {
    alert("Post cannot be empty!");
    return;
  }

  const newPost = {
    id: Date.now(),
    user: user.username,
    content: content,
    time: new Date().toLocaleString()
  };

  let posts = JSON.parse(localStorage.getItem("posts")) || [];

  posts.unshift(newPost);

  localStorage.setItem("posts", JSON.stringify(posts));

  input.value = "";

  renderPosts();
}
// DELETE POST
function deletePost(id) {
  let posts = JSON.parse(localStorage.getItem("posts")) || [];

  posts = posts.filter(post => post.id !== id);

  localStorage.setItem("posts", JSON.stringify(posts));

  renderPosts();
}
// FILTER POSTS (FOLLOW SYSTEM)
function getFeedPosts() {
  let posts = JSON.parse(localStorage.getItem("posts")) || [];

  
  if (!user.following) return posts;

  return posts.filter(post =>
    user.following.includes(post.user) || post.user === user.username
  );
}
// RENDER POSTS
function renderPosts() {
  const feed = document.getElementById("feed");
  feed.innerHTML = "";

  let posts = JSON.parse(localStorage.getItem("posts")) || [];

  posts.forEach(post => {
    const div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <h3>${post.user}</h3>
      <p>${post.content}</p>
      <small>${post.time}</small>

      <button>Like</button>
      <button>View Details</button>

      ${
        post.user === user.username
        ? `<button onclick="deletePost(${post.id})">Delete</button>`
        : ""
      }
    `;

    feed.appendChild(div);
  });
}

renderPosts();
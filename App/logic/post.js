import { generateId, getPosts, savePosts} from './helperFuncs.js';

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
    user: user.username,
    content: content,
    time: new Date().toLocaleString()
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
// FILTER POSTS (FOLLOW SYSTEM)
function getFeedPosts() {
  let posts = getPosts();
  const user = getCurrentUser();


  if (!user.following) return posts;

  return posts.filter(post =>
    user.following.includes(post.user) || post.user === user.username
  );
}
// RENDER POSTS
export function renderPosts() {
  const feed = document.getElementById("feed");
  feed.innerHTML = "";

  let posts = getPosts();
  posts = getFeedPosts();

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
        ? `<button class="delete-button" id="${post.id}">Delete</button>`
        : ""
      }
    `;

    feed.appendChild(div);
  });
}





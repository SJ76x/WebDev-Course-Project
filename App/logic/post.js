import { generateId, getPosts, savePosts, getCurrentUser, getUsers} from './helperFuncs.js';

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
  const user = getCurrentUser();

  let posts = getFeedPosts();
  
  feed.innerHTML = "";

  posts.forEach(post => {
    const postAuther = getUsers().find(u => u.id === post.userId);
    const div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <h3>${postAuther.username}</h3>
      <p>${post.content}</p>
      <small>${post.createdAt}</small>

      <button>Like</button>
      <button>View Details</button>

      ${
        post.userId === user.id
          ? `<button class="delete-button" data-id="${post.id}">Delete</button>`
          : ""
      }
    `;

    feed.appendChild(div);
  });
    document.querySelectorAll(".delete-button").forEach(button => {
      button.addEventListener("click", () => {
        deletePost(button.dataset.id);
    });
  });
}





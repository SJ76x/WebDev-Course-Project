import { getCurrentUser, createPost , deletePost, toggleLike, getFeedPosts} from './helperFuncs.js';

// CREATE POST
export async function postNewPost() {
  const input = document.getElementById("postInput");
  const content = input.value.trim();
  const user = await getCurrentUser();

  if (content === "") {
    alert("Post cannot be empty!");
    return;
  }

  await createPost(content, user.id);

  input.value = "";
  await renderPosts();
}


// RENDER POSTS
export async function renderPosts() {
  const feed = document.getElementById("feed");
  const currentUser = await getCurrentUser();
  const userFeedPosts = await getFeedPosts();

  feed.innerHTML = "";

  userFeedPosts.forEach(post => {
    const userLiked = post.likes.some(like => like.userId === currentUser.id);

    const div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <a href="profile.html?userId=${post.authorId}"><img src=${post.author.profilePicture} alt="Profile Picture" class="post-avatar"></a>

      <a href="profile.html?userId=${post.authorId}"><h3 class="post-author">${post.author.username ? post.author.username : "Unknown User"}</h3></a>
      
      <p class="post-content">${post.content}</p>
      <small class="post-date">${post.createdAt}</small>
      <br><br>

      <button class="like-btn" data-id="${post.id}">
        ${userLiked ? "Unlike" : "Like"} (${post._count.likes})
      </button>

      <button class="details-btn" data-id="${post.id}">
        Comment (${post._count.comments})
      </button>

      ${
        post.authorId === currentUser.id
          ? `<button class="delete-button" data-id="${post.id}">Delete</button>`
          : ""
      }
    `;

    feed.appendChild(div);
  });

  // Like button
  document.querySelectorAll(".like-btn").forEach(button => {
    button.addEventListener("click", async () => {
      await toggleLike(button.dataset.id, currentUser.id);
      await renderPosts();
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
    button.addEventListener("click", async () => {
      await deletePost(button.dataset.id);
      await renderPosts();
    });
  });
}
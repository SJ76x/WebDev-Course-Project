import {
  getCurrentUser,
  logoutUser,
  getUsers,
  getUserById,
  getPosts,
  toggleLike,
  deletePost,
  toggleFollow,
  updateProfile,
} from './helperFuncs.js';

let currentUser = null;

function getProfileUserId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("userId");
}

async function getProfileUser() {
  const profileId = getProfileUserId();
  if (!profileId) return currentUser;
  return await getUserById(profileId);
}

function isOwnProfile(profileUser) {
  return currentUser.id === profileUser.id;
}

function isFollowing(profileUser) {
  return profileUser.followers?.some(f => f.followerId === currentUser.id) || false;
}

async function getUserPosts(profileUser) {
  const allPosts = await getPosts();
  return allPosts.filter(p => p.authorId === profileUser.id);
}

async function renderProfileHeader(profileUser) {
  document.getElementById("profilePicture").src = profileUser.profilePicture || "../images/default-avatar.jpeg";
  document.getElementById("profileUsername").textContent = "@" + profileUser.username;
  document.getElementById("profileBio").textContent = profileUser.bio || "No bio yet.";

  document.getElementById("statPosts").innerHTML = `<strong>${profileUser._count.posts}</strong> Posts`;
  document.getElementById("statFollowers").innerHTML = `<strong>${profileUser._count.followers}</strong> Followers`;
  document.getElementById("statFollowing").innerHTML = `<strong>${profileUser._count.following}</strong> Following`;

  const actionsDiv = document.getElementById("profileActions");
  actionsDiv.innerHTML = "";

  if (isOwnProfile(profileUser)) {
    const editBtn = document.createElement("button");
    editBtn.className = "edit-profile-btn";
    editBtn.textContent = "Edit Profile";
    editBtn.addEventListener("click", openEditForm);
    actionsDiv.appendChild(editBtn);
    document.getElementById("postsSectionTitle").textContent = "Your Posts";
  } else {
    const following = isFollowing(profileUser);
    const btn = document.createElement("button");
    btn.className = following ? "unfollow-btn" : "follow-btn";
    btn.textContent = following ? "Following" : "Follow";

    if (following) {
      btn.addEventListener("mouseenter", () => { btn.textContent = "Unfollow"; });
      btn.addEventListener("mouseleave", () => { btn.textContent = "Following"; });
    }

    btn.addEventListener("click", async () => {
      await toggleFollow(currentUser.id, profileUser.id);
      await loadProfilePage();
    });
    actionsDiv.appendChild(btn);
    document.getElementById("postsSectionTitle").textContent = profileUser.username + "'s Posts";
  }
}

async function renderUserPosts(profileUser) {
  const posts = await getUserPosts(profileUser);
  const postsList = document.getElementById("userPostsList");
  const noPostsMsg = document.getElementById("noPostsMessage");

  if (posts.length === 0) {
    postsList.innerHTML = "";
    noPostsMsg.style.display = "block";
    return;
  }

  noPostsMsg.style.display = "none";
  postsList.innerHTML = "";

  posts.forEach(post => {
    const userLiked = post.likes.some(l => l.userId === currentUser.id);
    const isOwn = post.authorId === currentUser.id;

    const div = document.createElement("div");
    div.className = "user-post";
    div.innerHTML = `
      <h3>${post.author.username}</h3>
      <p>${post.content}</p>
      <small>${new Date(post.createdAt).toLocaleString()}</small>
      <button class="like-btn">${userLiked ? "Unlike" : "Like"} (${post._count.likes})</button>
      <button class="comment-btn">Comments (${post._count.comments})</button>
      ${isOwn ? `<button class="delete-btn" data-id="${post.id}">Delete</button>` : ""}
    `;

    div.querySelector(".like-btn").addEventListener("click", async () => {
      await toggleLike(post.id, currentUser.id);
      await loadProfilePage();
    });

    div.querySelector(".comment-btn").addEventListener("click", () => {
      window.location.href = "post.html?postId=" + post.id;
    });

    if (isOwn) {
      div.querySelector(".delete-btn").addEventListener("click", async () => {
        if (confirm("Delete this post?")) {
          await deletePost(post.id);
          await loadProfilePage();
        }
      });
    }

    div.querySelector("h3").style.cursor = "pointer";
    div.querySelector("h3").addEventListener("click", () => {
      window.location.href = "profile.html?userId=" + post.authorId;
    });

    postsList.appendChild(div);
  });
}

async function renderSuggestedUsers() {
  const allUsers = await getUsers();
  const suggestedList = document.getElementById("suggestedUsersList");

  // Get the IDs the current user follows
  const followingIds = currentUser.following?.map(f => f.followingId) || [];

  const suggested = allUsers.filter(u =>
    u.id !== currentUser.id && !followingIds.includes(u.id)
  );

  if (suggested.length === 0) {
    suggestedList.innerHTML = "<p>No suggestions right now.</p>";
    return;
  }

  suggestedList.innerHTML = "";
  suggested.forEach(user => {
    const div = document.createElement("div");
    div.className = "suggested-user";

    const infoDiv = document.createElement("div");
    infoDiv.className = "suggested-user-info";
    infoDiv.innerHTML = `
      <img src="${user.profilePicture || '../images/default-avatar.jpeg'}" class="suggested-user-avatar">
      <span class="suggested-user-name">${user.username}</span>
    `;
    infoDiv.addEventListener("click", () => {
      window.location.href = "profile.html?userId=" + user.id;
    });

    const followBtn = document.createElement("button");
    followBtn.className = "follow-btn";
    followBtn.textContent = "Follow";
    followBtn.addEventListener("click", async () => {
      await toggleFollow(currentUser.id, user.id);
      await loadProfilePage();
    });

    div.appendChild(infoDiv);
    div.appendChild(followBtn);
    suggestedList.appendChild(div);
  });
}

function openEditForm() {
  document.getElementById("editFormContainer").style.display = "block";
  document.getElementById("editUsername").value = currentUser.username;
  document.getElementById("editEmail").value = currentUser.email;
  document.getElementById("editBio").value = currentUser.bio || "";
  document.getElementById("bioCharCount").textContent = (currentUser.bio || "").length;
  document.getElementById("edit-error").innerText = "";
  document.getElementById("edit-success").innerText = "";
}

function closeEditForm() {
  document.getElementById("editFormContainer").style.display = "none";
}

async function handleEditSubmit(event) {
  event.preventDefault();

  const newUsername = document.getElementById("editUsername").value.trim();
  const newEmail = document.getElementById("editEmail").value.trim();
  const newBio = document.getElementById("editBio").value.trim();

  document.getElementById("editUsername-error").innerText = "";
  document.getElementById("editEmail-error").innerText = "";
  document.getElementById("edit-error").innerText = "";
  document.getElementById("edit-success").innerText = "";

  let hasErrors = false;

  if (newUsername.length < 3 || newUsername.length > 20) {
    document.getElementById("editUsername-error").innerText = "Username must be 3-20 characters";
    hasErrors = true;
  }
  if (newUsername.indexOf(" ") !== -1) {
    document.getElementById("editUsername-error").innerText = "Username cannot have spaces";
    hasErrors = true;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
    document.getElementById("editEmail-error").innerText = "Email not in the correct format";
    hasErrors = true;
  }

  if (hasErrors) return;

  const result = await updateProfile(currentUser.id, {
    username: newUsername,
    email: newEmail,
    bio: newBio,
  });

  if (result.message) {
    document.getElementById("edit-error").innerText = result.message;
    return;
  }

  document.getElementById("edit-success").innerText = "Profile updated!";
  setTimeout(() => {
    closeEditForm();
    window.location.reload();
  }, 800);
}

async function loadProfilePage() {
  currentUser = await getCurrentUser();
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  const profileUser = await getProfileUser();
  if (!profileUser) {
    document.getElementById("profileMain").innerHTML = "<p>User not found.</p>";
    return;
  }

  await renderProfileHeader(profileUser);
  await renderUserPosts(profileUser);
  await renderSuggestedUsers();
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  logoutUser();
  window.location.href = "login.html";
});

document.getElementById("editProfileForm").addEventListener("submit", handleEditSubmit);
document.getElementById("cancelEditBtn").addEventListener("click", closeEditForm);
document.getElementById("editBio").addEventListener("input", function () {
  document.getElementById("bioCharCount").textContent = this.value.length;
});

loadProfilePage();
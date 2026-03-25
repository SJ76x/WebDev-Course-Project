import { getUsers, saveUsers, getCurrentUser, getCurrentUserId, getPosts, savePosts, getComments, saveComments, logoutUser } from './helperFuncs.js';

const currentUser = getCurrentUser();
if (!currentUser) window.location.href = "login.html";

function getProfileUserId() {
  const queryString = window.location.search;
  if (!queryString) return null;
  const pairs = queryString.substring(1).split("&");
  for (let i = 0; i < pairs.length; i++) {
    const parts = pairs[i].split("=");
    if (parts[0] === "userId") {
      return parts[1] || null;
    }
  }
  return null;
}

function getProfileUser() {
  const profileId = getProfileUserId();
  if (!profileId) return currentUser;
  const users = getUsers();
  return users.find(u => u.id === profileId) || null;
}

function isOwnProfile(profileUser) {
  return currentUser.id === profileUser.id;
}

function getFollowerCount(profileUser) {
  return profileUser.followers ? profileUser.followers.length : 0;
}

function getFollowingCount(profileUser) {
  return profileUser.following ? profileUser.following.length : 0;
}

function getUserPosts(profileUser) {
  const posts = getPosts();
  return posts.filter(p => p.userId === profileUser.id);
}

function isFollowing(targetUserId) {
  return currentUser.following && currentUser.following.includes(targetUserId);
}

function followUser(targetUserId) {
  const users = getUsers();
  const me = users.find(u => u.id === currentUser.id);
  const target = users.find(u => u.id === targetUserId);
  if (!me || !target) return;

  if (!me.following) me.following = [];
  if (!target.followers) target.followers = [];

  if (!me.following.includes(targetUserId)) {
    me.following.push(targetUserId);
  }
  if (!target.followers.includes(currentUser.id)) {
    target.followers.push(currentUser.id);
  }

  saveUsers(users);
}

function unfollowUser(targetUserId) {
  const users = getUsers();
  const me = users.find(u => u.id === currentUser.id);
  const target = users.find(u => u.id === targetUserId);
  if (!me || !target) return;

  if (me.following) {
    me.following = me.following.filter(id => id !== targetUserId);
  }
  if (target.followers) {
    target.followers = target.followers.filter(id => id !== currentUser.id);
  }

  saveUsers(users);
}

function renderProfileHeader(profileUser) {
  document.getElementById("profilePicture").src = profileUser.profilePicture || "../images/default-avatar.jpeg";
  document.getElementById("profileUsername").textContent = "@" + profileUser.username;
  document.getElementById("profileBio").textContent = profileUser.bio || "No bio yet.";

  const userPosts = getUserPosts(profileUser);
  document.getElementById("statPosts").innerHTML = `<strong>${userPosts.length}</strong> Posts`;
  document.getElementById("statFollowers").innerHTML = `<strong>${getFollowerCount(profileUser)}</strong> Followers`;
  document.getElementById("statFollowing").innerHTML = `<strong>${getFollowingCount(profileUser)}</strong> Following`;

  const actionsDiv = document.getElementById("profileActions");
  actionsDiv.innerHTML = "";

  if (isOwnProfile(profileUser)) {
    const editBtn = document.createElement("button");
    editBtn.className = "edit-profile-btn";
    editBtn.textContent = "Edit Profile";
    editBtn.addEventListener("click", openEditForm);
    actionsDiv.appendChild(editBtn);
  } else {
    if (isFollowing(profileUser.id)) {
      const unfollowBtn = document.createElement("button");
      unfollowBtn.className = "unfollow-btn";
      unfollowBtn.textContent = "Following";
      unfollowBtn.addEventListener("mouseenter", () => { unfollowBtn.textContent = "Unfollow"; });
      unfollowBtn.addEventListener("mouseleave", () => { unfollowBtn.textContent = "Following"; });
      unfollowBtn.addEventListener("click", () => {
        unfollowUser(profileUser.id);
        loadProfilePage();
      });
      actionsDiv.appendChild(unfollowBtn);
    } else {
      const followBtn = document.createElement("button");
      followBtn.className = "follow-btn";
      followBtn.textContent = "Follow";
      followBtn.addEventListener("click", () => {
        followUser(profileUser.id);
        loadProfilePage();
      });
      actionsDiv.appendChild(followBtn);
    }
  }

  if (isOwnProfile(profileUser)) {
    document.getElementById("postsSectionTitle").textContent = "Your Posts";
  } else {
    document.getElementById("postsSectionTitle").textContent = profileUser.username + "'s Posts";
  }
}

function renderUserPosts(profileUser) {
  const posts = getUserPosts(profileUser);
  const postsList = document.getElementById("userPostsList");
  const noPostsMsg = document.getElementById("noPostsMessage");

  posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (posts.length === 0) {
    postsList.innerHTML = "";
    noPostsMsg.style.display = "block";
    return;
  }

  noPostsMsg.style.display = "none";
  postsList.innerHTML = "";

  posts.forEach(post => {
    const users = getUsers();
    const author = users.find(u => u.id === post.userId);
    const authorName = author ? author.username : "Unknown";

    const likeCount = post.likes ? post.likes.length : 0;
    const userLiked = post.likes && post.likes.includes(currentUser.id);
    const commentCount = post.comments ? post.comments.length : 0;
    const isOwn = currentUser.id === post.userId;

    const div = document.createElement("div");
    div.className = "user-post";

    div.innerHTML = `
      <h3>${authorName}</h3>
      <p>${post.content}</p>
      <small>${post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}</small>
      <button class="like-btn">${userLiked ? "Unlike" : "Like"} (${likeCount})</button>
      <button class="comment-btn">Comments (${commentCount})</button>
      ${isOwn ? `<button class="delete-btn" data-id="${post.id}">Delete</button>` : ""}
    `;

    const likeBtn = div.querySelector(".like-btn");
    likeBtn.addEventListener("click", () => {
      toggleLike(post.id);
    });

    const commentBtn = div.querySelector(".comment-btn");
    commentBtn.addEventListener("click", () => {
      window.location.href = "post.html?postId=" + post.id;
    });

    if (isOwn) {
      const deleteBtn = div.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", () => {
        deletePost(post.id);
      });
    }

    const authorH3 = div.querySelector("h3");
    authorH3.style.cursor = "pointer";
    authorH3.addEventListener("click", () => {
      window.location.href = "profile.html?userId=" + post.userId;
    });

    postsList.appendChild(div);
  });
}

function toggleLike(postId) {
  let posts = getPosts();
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  if (!post.likes) post.likes = [];

  const index = post.likes.indexOf(currentUser.id);
  if (index !== -1) {
    post.likes.splice(index, 1);
  } else {
    post.likes.push(currentUser.id);
  }

  savePosts(posts);
  const profileUser = getProfileUser();
  if (profileUser) renderUserPosts(profileUser);
}

function deletePost(postId) {
  const confirmed = confirm("Are you sure you want to delete this post?");
  if (!confirmed) return;

  let posts = getPosts();
  posts = posts.filter(p => p.id !== postId);
  savePosts(posts);

  let comments = getComments();
  comments = comments.filter(c => c.postId !== postId);
  saveComments(comments);

  loadProfilePage();
}

function renderSuggestedUsers() {
  const allUsers = getUsers();
  const suggestedList = document.getElementById("suggestedUsersList");

  const followingIds = currentUser.following || [];

  const suggested = allUsers.filter(u => u.id !== currentUser.id && !followingIds.includes(u.id));

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
      <img src="${user.profilePicture || '../images/default-avatar.jpeg'}" alt="Avatar" class="suggested-user-avatar">
      <span class="suggested-user-name">${user.username}</span>
    `;
    infoDiv.addEventListener("click", () => {
      window.location.href = "profile.html?userId=" + user.id;
    });

    const followBtn = document.createElement("button");
    followBtn.className = "follow-btn";
    followBtn.textContent = "Follow";
    followBtn.addEventListener("click", () => {
      followUser(user.id);
      loadProfilePage();
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

function handleEditSubmit(event) {
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

  const users = getUsers();

  if (users.some(u => u.id !== currentUser.id && u.username.toLowerCase() === newUsername.toLowerCase())) {
    document.getElementById("editUsername-error").innerText = "Username is already taken";
    hasErrors = true;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
    document.getElementById("editEmail-error").innerText = "Email not in the correct format";
    hasErrors = true;
  }

  if (users.some(u => u.id !== currentUser.id && u.email.toLowerCase() === newEmail.toLowerCase())) {
    document.getElementById("editEmail-error").innerText = "Email is already in use";
    hasErrors = true;
  }

  if (hasErrors) return;

  const userIndex = users.findIndex(u => u.id === currentUser.id);
  users[userIndex].username = newUsername;
  users[userIndex].email = newEmail;
  users[userIndex].bio = newBio;
  saveUsers(users);

  document.getElementById("edit-success").innerText = "Profile updated!";

  setTimeout(() => {
    closeEditForm();
    window.location.reload();
  }, 800);
}

function loadProfilePage() {
  const profileUser = getProfileUser();

  if (!profileUser) {
    document.getElementById("profileMain").innerHTML = "<p>User not found.</p>";
    return;
  }

  renderProfileHeader(profileUser);
  renderUserPosts(profileUser);
  renderSuggestedUsers();
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

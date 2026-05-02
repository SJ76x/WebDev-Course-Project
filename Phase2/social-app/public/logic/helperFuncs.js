
// LocalStorage helper functions 
export function getCurrentUserId() {
  return localStorage.getItem("currentUserId");
}

export function saveCurrentUserId(userId) {
  localStorage.setItem("currentUserId", userId);
}

export function logoutUser() {
  localStorage.removeItem("currentUserId");
}

// ===Functions that Fetch from the server api===
// Users
export async function getUsers(){
    const res = await fetch("/api/users");
    return res.json();
}
export async function getCurrentUser() {
  const res = await fetch(`/api/users/${localStorage.getItem("currentUserId")}`);
  return res.json();
}

export async function getUserById(id) {
    const res = await fetch(`/api/users/${id}`);
    return res.json();
}

export function saveCurrentUser(userId) {
  const res = fetch(`/api/users/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  return res.json();
}

// Posts
export async function getPosts() {
    const res = await fetch("/api/posts");
    return res.json();
}

export async function getPostById(id) {
    const res = await fetch(`/api/posts/${id}`);
    return res.json();
}

export async function getFeedPosts() {
  const res = await fetch(`/api/users/${localStorage.getItem("currentUserId")}/feed`);
  return res.json();
}

export async function createPost(content, authorId) {
  const res = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, authorId }),
  });
  return res.json();
}

export async function deletePost(postId) {
  await fetch(`/api/posts/${postId}`, { method: "DELETE" });
}



export async function toggleLike(postId, userId) {
  const res = await fetch(`/api/posts/${postId}/like`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  return res.json();
}

//comments
export async function getCommentsByPost(postId) {
  const res = await fetch(`/api/posts/${postId}/comments`);
  return res.json();
}

export async function addComment(postId, content, authorId) {
  const res = await fetch(`/api/posts/${postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, authorId }),
  });
  return res.json();
}

//follow
export async function toggleFollow(followerId, targetUserId) {
  const res = await fetch(`/api/users/${targetUserId}/follow`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ followerId }),
  });
  return res.json();
}

export async function updateProfile(userId, data) {
  const res = await fetch(`/api/users/${userId}/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}



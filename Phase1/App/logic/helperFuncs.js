/* 
//One "User" object Template:
const user = 
  {
    id: "user_001",
    username: "ahmed",
    email: "ahmed@example.com",
    password: "Abcd1234",
    profilePicture: "images/default-avatar.jpeg",
    bio: "",
    followers: [], //This stores user ids only, not the whole user objects
    following: [] //This stores user ids only, not the whole user objects
  }
============================================= 
//One "Post" object Template:
const post =
  {
    id: "post_001",
    userId: "user_001",
    content: "Hello everyone, this is my first post!",
    image: "",
    likes: ["user_002", "user_003"],
    comments: ["comment_001", "comment_002"],
    createdAt: "2026-03-24T11:00:00.000Z"
  }
=============================================
//One "Comment" object Template:
const comment = 
  {
    id: "comment_001",
    postId: "post_001",
    userId: "user_002",
    content: "Nice post!",
    createdAt: "2026-03-24T11:05:00.000Z"
  }
=============================================
//These are stores in localStorage using the following keys:
"users"
"posts"
"comments"
"currentUserId"

*/

export function getUsers(){
    const stored = localStorage.getItem("users");
    return stored ? JSON.parse(stored) : [];
}

export function saveUsers(users){
    localStorage.setItem("users", (JSON.stringify(users) ));
}

//Generate unique id for users,posts,comments...
export function generateId(prefix) {
  const users = getUsers();
  let id = `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  while(users.some(a => a.id === id)){
        id = `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    }
    return id;
}

export function getCurrentUserId() {
  return localStorage.getItem("currentUserId");
}

export function saveCurrentUserId(userId) {
  localStorage.setItem("currentUserId", userId);
}

export function getCurrentUser() {
  const users = getUsers();
  const currentUserId = getCurrentUserId();
  return users.find(user => user.id === currentUserId) || null;
}

export function getPosts() {
  return JSON.parse(localStorage.getItem("posts")) || [];
}

export function savePosts(posts) {
  localStorage.setItem("posts", JSON.stringify(posts));
}

export function getComments() {
  return JSON.parse(localStorage.getItem("comments")) || [];
}

export function saveComments(comments) {
  localStorage.setItem("comments", JSON.stringify(comments));
}

export function logoutUser() {
  localStorage.removeItem("currentUserId");
}
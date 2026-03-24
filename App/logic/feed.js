
import { logoutUser, getCurrentUser} from './helperFuncs.js';
import { createPost, renderPosts, deletePost } from './post.js';


//Dont allow acecss to feed if not logged in
const currentUser = getCurrentUser();
if (!currentUser) window.location.href = "login.html";

document.getElementById("feedTitle").textContent = currentUser.username;

//document.getElementById("userPfp").src = currentUser.profilePicture;

//delete login id from localStorage to reder logged out
document.getElementById("logoutBtn").addEventListener("click", () => {
  console.log("clicked");
  logoutUser();
  window.location.href = "login.html";
});

document.getElementById("postBtn").addEventListener("click", () => {
  console.log("clicked");
  createPost();
});


renderPosts();


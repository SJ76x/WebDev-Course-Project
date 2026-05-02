
import { logoutUser, getCurrentUser} from './helperFuncs.js';
import { renderPosts, postNewPost } from './post.js';


//Dont allow acecss to feed if not logged in
async function init(){
  const currentUser = await getCurrentUser();
  if (!currentUser) window.location.href = "login.html";

  document.getElementById("feedTitle").textContent = currentUser.username;

  //delete login id from localStorage to reder logged out
  document.getElementById("logoutBtn").addEventListener("click", () => {
    logoutUser();
    window.location.href = "login.html";
  });

  document.getElementById("postBtn").addEventListener("click", async () => {
    await postNewPost();
  });

  await renderPosts();
}
init();



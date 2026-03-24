
import { logoutUser, getCurrentUser} from './helperFuncs.js';

//Dont allow acecss to login page if not logget in
const currentUser = getCurrentUser();
if (!currentUser) window.location.href = "login.html";
else{
  document.getElementById("feedTitle").textContent = currentUser.username;
  document.getElementById("userPfp").src = currentUser.profilePicture;
}

//delete login id from localStorage to reder logged out
document.getElementById("logoutBtn").addEventListener("click", () => {
  logoutUser();
  window.location.href = "login.html";
});
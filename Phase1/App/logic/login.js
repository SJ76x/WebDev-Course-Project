import { getUsers, saveCurrentUserId } from './helperFuncs.js';


//load users from localStorage
const users = getUsers();


//Handel the Login Button
const form = document.querySelector(".loginForm");

form.addEventListener("submit", function(event) {
    event.preventDefault();
    
    const email = form.email.value.trim();
    const password = form.password.value;

    // Clear previous errors
    document.getElementById("email-error").innerText = "";
    document.getElementById("password-error").innerText = "";
    
    //Find User with matching credentials
    const user = users.find(u => u.email === email && u.password === password);


    if(user === undefined){
        document.getElementById("password-error").innerText = "Worng Email or Password";
    }
    else{
        saveCurrentUserId(user.id); //Mark user as active
        window.location.href = "feed.html"; //Correct Creds => redirect to feed page
    } 

});
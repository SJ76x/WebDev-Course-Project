import { getUsers, saveCurrentUserId } from './helperFuncs.js';


//Handel the Login Button
const form = document.querySelector(".loginForm");

form.addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const email = form.email.value.trim();
    const password = form.password.value;

    // Clear previous errors
    document.getElementById("email-error").innerText = "";
    document.getElementById("password-error").innerText = "";
    
    //Find User with matching credentials
    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if(!res.ok){
        document.getElementById("password-error").innerText = "Worng Email or Password";
    }
    else{
        saveCurrentUserId(data.id); //Mark user as active
        window.location.href = "feed.html"; //Correct Creds => redirect to feed page
    } 

});
import { saveUsers, getUsers, generateId} from './helperFuncs.js';


//load users from localStorage
const users = getUsers();


//Handel the Register Button
const form = document.querySelector(".regForm");

form.addEventListener("submit", function(event) {
    event.preventDefault();
    
    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value.trim();

    // Clear previous errors
    document.getElementById("username-error").innerText = "";
    document.getElementById("email-error").innerText = "";
    document.getElementById("password-error").innerText = "";
    document.getElementById("confirmPassword-error").innerText = "";

    let hasErrors = false;

    if (username.length < 3) {
        document.getElementById("username-error").innerText = "Username ≥ 3 chars";
        hasErrors = true;
    }

    //Make sure email has @ and . and and no space
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById("email-error").innerText = "Email not in the correct format";
        hasErrors = true;
    }

    //Make sure email is not already in the database
    if (users.some(u => u.email === email)) {
        document.getElementById("email-error").innerText = "An account with this email already exists";
        hasErrors = true;
    }

    //Makes sure password is more than 7 chars long and has uppercase and numbers.
    if (!/(?=.*[A-Z])(?=.*[0-9]).{8,}/.test(password)) {
        document.getElementById("password-error").innerText = "Password 8+ chars with uppercase + number";
        hasErrors = true;
    }

    //Make sure the Password matches with the conformation
    if(password !== confirmPassword) {
        document.getElementById("confirmPassword-error").innerText = "Password and Confirm Password Dont match";
        hasErrors = true;
    }

    if(!hasErrors){
        //If information valid: 
        // (1) add new user
        users.push(
            {
                id: generateId("user"),
                username: username,
                email: email,
                password: password,
                profilePicture: "../images/default-avatar.jpeg",
                bio: "",
                followers: [],
                following: []
            }
        )

        saveUsers(users);

        // (2) redirect to Login page:
        window.location.href = "login.html";
    }

});
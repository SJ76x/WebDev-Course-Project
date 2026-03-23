/* One User Informaiton Template:
{
    id: "user_001",
    username: "ahmed",
    email: "ahmed@example.com",
    password: "Abcd1234",
    profilePicture: "images/default-avatar.jpeg",
    bio: "",
    followers: [],
    following: [],
}
*/

function getUsers(){
    const stored = localStorage.getItem("users");
    return stored ? JSON.parse(stored) : [];
}

function saveUsers(users){
    localStorage.setItem("users", (JSON.stringify(users) ));
}

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
        localStorage.setItem("currentUsers", JSON.stringify(user)); //Mark user as active
        window.location.href = "feed.html"; //Correct Creds => redirect to feed page
    } 

});
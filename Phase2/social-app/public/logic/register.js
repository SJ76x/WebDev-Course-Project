const form = document.querySelector(".regForm");

form.addEventListener("submit", async function(event) {
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

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById("email-error").innerText = "Email not in the correct format";
        hasErrors = true;
    }

    if (!/(?=.*[A-Z])(?=.*[0-9]).{8,}/.test(password)) {
        document.getElementById("password-error").innerText = "Password 8+ chars with uppercase + number";
        hasErrors = true;
    }

    if (password !== confirmPassword) {
        document.getElementById("confirmPassword-error").innerText = "Password and Confirm Password Dont match";
        hasErrors = true;
    }

    if (hasErrors) return;

    // Send to API
    const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
        // Server returned a duplicate email/username error
        if (data.message?.includes("Email")) {
            document.getElementById("email-error").innerText = data.message;
        } else if (data.message?.includes("Username")) {
            document.getElementById("username-error").innerText = data.message;
        } else {
            document.getElementById("email-error").innerText = data.message || "Registration failed";
        }
        return;
    }

    // Success = redirect to login
    window.location.href = "login.html";
});
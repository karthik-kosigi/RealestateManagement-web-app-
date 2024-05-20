document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");
    const usernameInput = document.getElementById("username");
    const phoneInput = document.getElementById("phone");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const memberTypeInput = document.getElementById("member-type");

    signupForm.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const username = usernameInput.value.trim();
        const phone = phoneInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const memberType = memberTypeInput.value;

        // Validate password match
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        // AJAX request to check if username already exists and register user
        fetch(`/api/check-username`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                phone: phone,
                password: password,
                memberType: memberType
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.exists) {
                alert(data.message);
            } else {
                alert("Registration successful!");
                // Redirect to login page or do something else
                window.location.href = "/login.html";
            }
        })
        .catch(error => {
            console.error("Error registering user:", error);
        });
    });
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Clear previous errors
  emailError.textContent = "";
  passwordError.textContent = "";

  let valid = true;
  const emailPattern = /^[^\s@]+@[^\s@]+\.(com|net|org|edu|gov|io|co)$/i;

  if (email.value.trim() === "") {
    emailError.textContent = "Email is required.";
    valid = false;
  } else if (
    !emailPattern.test(email.value.trim()) ||
    email.value.includes("\\") ||
    email.value.includes("//") ||
    /@[0-9]/.test(email.value)
  ) {
    emailError.textContent = "Email is invalid.";
    valid = false;
  }

  if (password.value.trim() === "") {
    passwordError.textContent = "Password is required.";
    valid = false;
  } else if (password.value.length < 8) {
    passwordError.textContent = "Password must be at least 8 characters.";
    valid = false;
  }

  if (!valid) return;

  const credentials = {
    email: email.value.trim(),
    password: password.value.trim(),
  };



  try {
    const res = await fetch("http://localhost:8081/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const responseText = await res.text();

    if (res.ok) {
      const user = JSON.parse(responseText); // 👈 Convert string to JSON
      console.log(user);
      

      // ✅ Save the user UUID and username
      localStorage.setItem("login", "true");
      localStorage.setItem("userId", user.user_id); // 👈 this is key!
      localStorage.setItem("username", user.username); // Optional
      localStorage.setItem("fullname", user.full_name);

      console.log("User logged in. UUID:", user.user_id);
      console.log(user.username);

      const loginMsg = document.getElementById("loginMsg")
      loginMsg.textContent = "Login successfully"
      loginMsg.style.padding = "10px 10px 10px 10px"


      setTimeout(() => {
        window.location.href = "../../pages/dashboard.html";
      }, 1000);
    } else {
      document.getElementById("loginMsg").innerText = responseText;
    }
  } catch (error) {
    console.error("Login request failed:", error);
    document.getElementById("loginMsg").innerText = "Login failed. Please try again.";
  }
});

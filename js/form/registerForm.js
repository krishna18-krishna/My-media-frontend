document.addEventListener("DOMContentLoaded", () => {
  const registrationForm = document.getElementById("registerForm");
  const email = document.getElementById("email");
  const fullname = document.getElementById("fullName");
  const username = document.getElementById("username");
  const password = document.getElementById("password");

  const emailError = document.getElementById("emailError");
  const fullnameError = document.getElementById("fullnameError");
  const passwordError = document.getElementById("passwordError");
  const usernameError = document.getElementById("usernameError");

  registrationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    let valid = true


    const emailValue = email.value.trim();
    const fullNameValue = fullname.value.trim();
    const usernameValue = username.value.trim();
    const passwordValue = password.value.trim();

    emailError.textContent = "";
    fullnameError.textContent = "";
    usernameError.textContent = "";
    passwordError.textContent = "";

    const emailPattern = /^[^\s@]+@[^0-9][^\s@]+\.[a-z]{2,}$/i;
    const emailPattern1 = /^[^\s@]+@[^\s@]+\.(com|net|org|edu|gov|io|co)$/i;
    const passwordPattern =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/;
    const usernamePattern = /^[a-z0-9_]+$/; // Only allows lowercase letters, numbers, and underscore
    const hasSpace = /\s/; // Check for whitespace characters
    const fullNamePattern = /^[a-zA-Z\s]+$/;

    // Full name validation
    if (fullname.value.trim() === "") {
      fullnameError.textContent = "Full name is required.";
      valid = false;
    } else if (fullname.value.trim().length < 3) {
      fullnameError.textContent = "Full name must have at least 3 characters.";
      valid = false;
    } else if (!fullNamePattern.test(fullname.value.trim())) {
      fullnameError.textContent =
        "Full name cannot contain special characters or numbers.";
      valid = false;
    }
    if (hasSpace.test(fullname.value.trim())) {
      fullnameError.textContent = "Full name cannot contain spaces.";
      valid = false;
    }

    // Email validation
    if (email.value.trim() === "") {
      emailError.textContent = "Email is required.";
      valid = false;
    } else if (!emailPattern1.test(email.value.trim())) {
      emailError.textContent = "Email is invalid.";
      valid = false;
    } else if (!emailPattern1.test(email.value.trim())) {
      emailError.textContent = "Please enter a valid email.";
      valid = false;
    } else if (!emailPattern1.test(email.value.trim())) {
      if (/@[0-9]/.test(email.value.trim())) {
        emailError.textContent = "Email is invalid.";
        valid = false;
      }
    }

    if (email.value.trim() === "") {
      emailError.textContent = "Email is required.";
      valid = false;
    } else if (!emailPattern1.test(email.value.trim())) {
      emailError.textContent = "Email is invalid.";
      valid = false;
    } else if (email.value.includes("\\")) {
      // Check for backslash
      emailError.textContent = "Email is invalid.";
      valid = false;
    } else if (email.value.includes("//")) {
      emailError.textContent = "Email is invalid.";
      valid = false;
    } else if (!emailPattern1.test(email.value.trim())) {
      emailError.textContent = "Please enter a valid email.";
      valid = false;
    } else if (/@[0-9]/.test(email.value.trim())) {
      // Ensure domain doesn't start with a number
      emailError.textContent = "Email is invalid.";
      valid = false;
    }

    // Username validation
    if (username.value.trim() === "") {
      usernameError.textContent = "Username is required.";
      valid = false;
    } else if (!usernamePattern.test(username.value.trim())) {
      usernameError.textContent =
        "Username can only contain lowercase letters, numbers, and underscores.";
      valid = false;
    } else if (/\s/.test(username.value)) {
      // Checks for any spaces within the username
      usernameError.textContent = "Username cannot contain spaces.";
      valid = false;
    } else if (username.value.trim().length < 4) {
      usernameError.textContent = "Username must have at least 4 characters.";
      valid = false;
    }
    // } else if (!(await isUsernameAvailable(username.value.trim()))) {
    //   usernameError.textContent = "Username is already taken.";
    //   valid = false;
    // }

    // Password validation
    if (password.value.trim() === "") {
      passwordError.textContent = "Password is required.";
      valid = false;
    } else if (!passwordPattern.test(password.value.trim())) {
      passwordError.textContent =
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
      valid = false;
    }

    if (valid) {
      const user = {
        full_name: fullNameValue,
        user_name: usernameValue,
        email: emailValue,
        password: passwordValue,
      };

      try {
        const res = await fetch("http://localhost:8080/user/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });

        if (res.ok) {
          setTimeout(() => {
            window.location.href = "../../index.html";
          }, 1000);
        } else {
          const msg = await res.text();
          alert("Registration failed: " + msg);
        }
      } catch (error) {
        console.error("Registration error:", error);
        alert("An error occurred. Please try again.");
      }
    }
  });

  // Function to check if the username is available
  // async function isUsernameAvailable(username) {
  //   try {
  //     const res = await fetch(
  //       `http://localhost:8080/user/username/${username}`,
  //       {
  //         method: "GET",
  //       }
  //     );

  //     if (res.status === 200) {
  //       return true; // Username is available
  //     } else if (res.status === 409) {
  //       return false; // Username is taken
  //     }
  //   } catch (error) {
  //     console.error("Error checking username availability:", error);
  //   }
  //   return false; // Default to false in case of an error
  // }
});

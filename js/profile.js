const postBaseUrl = "https://krishna0718-mymedia-java-backend.hf.space/posts";

const backButton = document.getElementById("back-button");

if (backButton) {
  backButton.addEventListener("click", () => {
    window.location.href = "../pages/dashboard.html"; // Replace with your actual home page path
  });
} else {
  console.error("Back button not found in DOM.");
}

let currentUsername = localStorage.getItem("username");
let currentFullname = localStorage.getItem("fullname");

const userName = document.getElementById("username");
userName.textContent = currentUsername;

const fullname = document.getElementById("fullname");
fullname.textContent = currentFullname;

const imageContainer = document.querySelector(".image-container");

// Create an image element
const imageElement1 = document.createElement("img");
imageElement1.classList.add("profile-image");

// Set default image first
imageElement1.src = "../assets/images/profile-pic.jpg";
imageElement1.alt = "Profile Picture";
imageContainer.appendChild(imageElement1);

fetchUserPosts();

async function fetchUserPosts() {
  const post_Count = document.querySelector(".post-count");
  let postCount = 0;
  const authorsPostsDiv = document.querySelector(".authors-posts");

  const response = await fetch(`${postBaseUrl}`);
  let posts = await response.json();

  if (posts.length > 0) {
    posts.forEach((post) => {
      if (post.image_url && currentUsername === post.user_model.user_name) {
        const postImg = document.createElement("img");
        postImg.classList.add("post-img");
        postImg.src = `${post.image_url}`;
        authorsPostsDiv.appendChild(postImg);
        postCount++;
      }
    });
  }
  else{
    authorsPostsDiv.textContent = "No Post Added"
  }
  post_Count.textContent = postCount;
}

const settings = document.querySelector(".settings-icon");
const logout = document.getElementById("drop-down");

settings.addEventListener("click", (event) => {
  event.stopPropagation(); // Prevent triggering document click
  logout.style.display = logout.style.display === "block" ? "none" : "block";
});

// Optional: hide dropdown if clicked outside
document.addEventListener("click", () => {
  logout.style.display = "none";
});

logout.addEventListener("click", ()=>{
    window.location.href = "../index.html"
})
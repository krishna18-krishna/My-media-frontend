const postBaseUrl = "https://krishna0718-mymedia-java-backend.hf.space/posts";

let currentUserId = localStorage.getItem("userId");
let currentUsername = localStorage.getItem("username");
// console.log(currentUsername);
// console.log(currentUserId);

// DOM content loaded eventf
document.addEventListener("DOMContentLoaded", () => {
  // Setting menu
  const userIcon = document.getElementById("userIcon");
  if (userIcon) {
    userIcon.addEventListener("click", toggleMenu);
  }

  function toggleMenu() {
    const settingsMenu = document.getElementById("settings-menu");
    if (settingsMenu) {
      settingsMenu.style.display =
        settingsMenu.style.display === "block" ? "none" : "block";
    } else {
      console.error("Element with ID 'settings-menu' not found.");
    }
  }

  // Close settings menu when clicking outside
  document.addEventListener("click", function (event) {
    const settingsMenu = document.getElementById("settings-menu");
    const profileIcon = document.querySelector(".nav-user-icon img");

    if (
      settingsMenu &&
      profileIcon &&
      !settingsMenu.contains(event.target) &&
      event.target !== profileIcon
    ) {
      settingsMenu.style.display = "none";
    }
  });

  document.addEventListener("scroll", () => {
    const settingsMenu = document.getElementById("settings-menu");
    const profileIcon = document.querySelector(".nav-user-icon img");
    settingsMenu.style.display = "none";
  });

  window.showLogoutAlert = function () {
    const logoutAlert = document.getElementById("logout-alert");
    const overlay = document.getElementById("overlay");
    if (logoutAlert && overlay) {
      logoutAlert.style.display = "block";
      overlay.style.display = "block";
    } else {
      console.error("Logout alert element not found.");
    }
  };

  window.hideLogoutAlert = function () {
    const overlay = document.getElementById("overlay");
    const logoutAlert = document.getElementById("logout-alert");
    if (logoutAlert && overlay) {
      overlay.style.display = "none";
      logoutAlert.style.display = "none";
    } else {
      console.error("Logout alert element not found.");
    }
  };

  window.logout = function () {
    console.log("User logged out!");
    hideLogoutAlert();
    localStorage.setItem("logIn", "false");
    window.location.href = "/index.html";
  };
});

// Clear form
function clearForm() {
  document.getElementById("post-content").value = "";
  document.getElementById("post-media").value = "";
  document.getElementById("imagePreview").src = "#";
  document.getElementById("imagePreview").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

// Show form
function showPostForm() {
  const postForm = document.getElementById("post-form");
  const overlay = document.getElementById("overlay");
  postForm.style.display = "block";
  overlay.style.display = "block";
}

// Hide form
function hidePostForm() {
  const postForm = document.getElementById("post-form");
  const overlay = document.getElementById("overlay");
  postForm.style.display = "none";
  overlay.style.display = "none";
  clearForm();
}

// Image preview
const mediaInput = document.getElementById("post-media");
const imagePreview = document.getElementById("imagePreview");
mediaInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image")) {
    const reader = new FileReader();
    reader.onloadend = () => {
      imagePreview.src = reader.result;
      console.log(imagePreview.src);
      imagePreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    alert("Please upload a valid image file.");
    imagePreview.src = "";
    imagePreview.style.display = "none";
  }
});

// POST CREATION FUNCTION
async function submitPost() {
  const contentInput = document.getElementById("post-content");
  const postImageSrc = document.getElementById("imagePreview").src;

  if (!contentInput || !postImageSrc) {
    console.error("Form fields not found in the DOM.");
    return;
  }

  const content = contentInput.value;
  const imageUrl = postImageSrc;

  if (!currentUserId) {
    console.error("User ID not set. Cannot submit post.");
    return;
  }

  const postPayload = {
    userId: currentUserId,
    content: content,
    imageUrl: imageUrl,
  };

  console.log("Submitting post with payload:", postPayload);

  try {
    const response = await fetch(`https://krishna0718-mymedia-java-backend.hf.space/posts/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postPayload),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Post created successfully:", data);
      clearForm();
      hidePostForm();
      fetchAllPosts();
    } else {
      const errorText = await response.text(); // safer than trying .json()
      console.error("Post creation failed:", errorText);
    }
  } catch (err) {
    console.error("Network or server error:", err.message);
  }
}

// Attach listeners
document
  .getElementById("add-post-button")
  .addEventListener("click", showPostForm);
document.getElementById("submit-post").addEventListener("click", submitPost);
document.getElementById("cancel-post").addEventListener("click", hidePostForm);
document.getElementById("close-btn").addEventListener("click", hidePostForm);

document.addEventListener("DOMContentLoaded", () => {
  fetchAllPosts();
});
// Placeholder: Fetch all posts (optional)
async function fetchAllPosts() {
  const postsContainer = document.getElementById("posts-container");
  postsContainer.innerHTML = "";

  function sortPostsByCreatedAt(posts, order = "desc") {
    return posts.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });
  }

  try {
    const response = await fetch(`${postBaseUrl}`);
    let posts = await response.json();

    posts = sortPostsByCreatedAt(posts); // Sort latest first

    posts.forEach((post) => {
      // console.log(post);
      
      const postElement = document.createElement("div");
      postElement.classList.add("post");

      const dateTime = formatDateTime(post.created_at);

      postElement.innerHTML = `
          <div class="post-header">
            <div class="post-header-userInfo">
              <div>
                <img src="../assets/images/profile-pic.jpg" class="image-container" style="width: 40px; height: 40px; border-radius: 50%; cursor: pointer; margin-right: 10px;" draggable="false">
              </div>
              <div class="postDetails">
                <strong>${post.user_model.user_name}</strong>
                <span class="text-muted">${dateTime.date} ${dateTime.time}</span>
              </div>
            </div>
            <div class="post-options" style="margin-left: auto; position: relative;">
              <button class="options-button" style="background: none; border: none; cursor: pointer; font-size: 20px;">⋮</button>
              <div class="options-menu" style="display: none; position: absolute; right: 0; background: white; border: 1px solid #ccc; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
                <button class="delete-post" style="padding: 10px; width: 100%; border: none; background: none; cursor: pointer;">Delete</button>
              </div>
            </div>
          </div>
          <div class="post-body mt-2">
            <div class="content">
              <text>${post.content}</text>
            </div>
            <img src="${post.image_url}" alt="Post Image" style="width: 600px;">
          </div>
        `;

      postsContainer.appendChild(postElement);

      // Button container
      const buttonContainer = document.createElement("div");
      buttonContainer.style.display = "flex";
      buttonContainer.style.justifyContent = "start";
      buttonContainer.style.gap = "100px";
      buttonContainer.style.marginLeft = "10px";
      buttonContainer.style.marginTop = "10px";
      buttonContainer.style.marginBottom = "10px";

      // Like button
      const likeDiv = document.createElement("div");
      likeDiv.classList.add("like-button");
      likeDiv.innerHTML = `
  <img class="like-img" src="/assets/images/like.png" alt="Like" draggable="false">
  <span class="like-count">0</span>
`;

      // Append likeDiv to the post card or wherever needed
      // Example: postContainer.appendChild(likeDiv);

      let liked = false;
      let likeCount = 0;
      let postId  = post.id; // Replace with your post ID
      let userId = currentUserId;
      // console.log(postId);
      // console.log(userId);
      
      // Fetch initial like count and user like status
      async function fetchLikes() {
        try {
          const [resCount, resStatus] = await Promise.all([
            fetch(`https://krishna0718-mymedia-java-backend.hf.space/likes/count/${postId}`),
            fetch(
              `https://krishna0718-mymedia-java-backend.hf.space/likes/status?userId=${userId}&postId=${postId}`
            ),
          ]);

          likeCount = await resCount.json();
          // console.log(likeCount);
          liked = await resStatus.json();
          // console.log(liked);


          updateLikeUI();
        } catch (err) {
          console.error("Error fetching like data", err);
        }
      }

      // Toggle like/unlike
      async function toggleLike() {
        try {
          const res = await fetch(
            `https://krishna0718-mymedia-java-backend.hf.space/likes/toggle?userId=${userId}&postId=${postId}`,
            { method: "POST" }
          );
          const result = await res.text();
          // console.log(result);

          if (result.includes("liked")) {
            likeCount++;
            liked = true;
          }
          if (result.includes("unliked")) {
            likeCount--; // prevent going below 0
            liked = false;
          }
          fetchLikes();
          updateLikeUI();
        } catch (err) {
          console.error("Toggle like failed", err);
        }
      }

      // Update like button UI
      function updateLikeUI() {
        likeDiv.querySelector(".like-count").textContent = likeCount;
        likeDiv.querySelector(".like-img").src = liked
          ? "/assets/images/like-blue.png"
          : "/assets/images/like.png";
      }

      // Add click event to toggle like
      likeDiv.addEventListener("click", async () => {
        await toggleLike();
      });

      // Fetch initial state on load
      fetchLikes();

      const commentDiv = document.createElement("div");
      commentDiv.classList.add("comment-button");
      commentDiv.innerHTML = `
        <img class="comment-img" src="../assets/images/comments.png" alt="Comments" draggable="false">
        <span class="comment-count">0</span>
      `;

      const commentBox = document.createElement("div");
      commentBox.classList.add("comment-box");
      commentBox.innerHTML = `
        <div class="comment-container">
          <div class="comment-header">
            <div>Comments</div>
            <div class="close-button" id="closeOverlayButton">×</div>
          </div>
          <div class="comments"></div>
          <div class="comment-footer">
            <input class="comment-input" id="commentInput" type="text" placeholder="Write your comment..." maxlength="500" />
            <div class="send-button" id="sendButton">➤</div>
          </div>
        </div>
      `;

      commentDiv.addEventListener("click", () => {
        const overlay = document.getElementById("overlay");
        overlay.style.display = "block";
        commentBox.style.display = "block";
        buttonContainer.appendChild(commentBox);
        fetchComments(); // Fetch and display comments
      });

      // Close the comment box
      commentBox.addEventListener("click", (event) => {
        const overlay = document.getElementById("overlay");
        if (event.target.id === "closeOverlayButton") {
          commentBox.style.display = "none";
          overlay.style.display = "none";
        }
      });

      let commentCount = 0;
      const commentCountSpan = commentDiv.querySelector(".comment-count");

      // Fetch comments
      async function fetchComments() {
        try {
          const response = await fetch(
            `https://krishna0718-mymedia-java-backend.hf.space/comments/post/${postId}`
          );
          if (!response.ok) throw new Error("Failed to fetch comments");

          const comments = await response.json();
          commentCount = comments.length;
          commentCountSpan.textContent = commentCount;

          const commentsContainer = commentBox.querySelector(".comments");
          commentsContainer.innerHTML = "";

          if (comments.length > 0) {
            comments.forEach((comment) => {
              const isOwnComment = comment.user.user_name === currentUsername;

              const commentItem = document.createElement("div");
              commentItem.classList.add("comment-item");

              commentItem.innerHTML = `
              <div class="userDetail">
                <p><strong>${comment.user.user_name}</strong></p>
                <p>${comment.content}</p>
              </div>
              ${
                isOwnComment
                  ? `
                <div class="comment-actions">
                  <button class="menu-button">⋮</button>
                  <div class="dropdown-menu" style="display: none;">
                    <button class="delete-comment" data-comment-id="${comment.id}">Delete</button>
                  </div>
                </div>
              `
                  : ""
              }
            `;

              if (isOwnComment) {
                const menuButton = commentItem.querySelector(".menu-button");
                const dropdownMenu =
                  commentItem.querySelector(".dropdown-menu");

                menuButton.addEventListener("click", () => {
                  dropdownMenu.style.display =
                    dropdownMenu.style.display === "none" ? "block" : "none";
                });

                const deleteButton =
                  dropdownMenu.querySelector(".delete-comment");

                deleteButton.addEventListener("click", async () => {
                  const commentId =
                    deleteButton.getAttribute("data-comment-id");
                  try {
                    const response = await fetch(
                      `https://krishna0718-mymedia-java-backend.hf.space/comments/${commentId}`,
                      {
                        method: "DELETE",
                      }
                    );
                    if (!response.ok)
                      throw new Error("Failed to delete comment");

                    // Refresh comments
                    fetchComments();
                  } catch (error) {
                    console.error("Error deleting comment:", error);
                  }
                });
              }

              commentsContainer.appendChild(commentItem);
            });
          }
          else{
            commentsContainer.textContent = "No Comment"
          }
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
      }

      // Send comment
      commentBox
        .querySelector("#sendButton")
        .addEventListener("click", async () => {
          const input = commentBox.querySelector("#commentInput");
          const content = input.value.trim();

          if (content === "") return;

          const commentData = {
            userId: userId,
            postId: postId,
            content: content,
          };

          try {
            const response = await fetch("https://krishna0718-mymedia-java-backend.hf.space/comments/add", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(commentData),
            });
            // console.log("Sending comment data:", JSON.stringify(commentData));

            if (!response.ok) throw new Error("Failed to send comment");

            input.value = "";
            fetchComments(); // Refresh after sending
          } catch (error) {
            console.error("Error sending comment:", error);
          }
        });
      fetchComments();

      // // Share button
      // const shareDiv = document.createElement("div");
      // shareDiv.classList.add("share-button");
      // shareDiv.innerHTML = `
      //   <img class="share-img" src="/assets/images/share.png" alt="Share" draggable="false">
      //   <span class="share-count">0</span>
      //   `;

      // Append buttons to the button container
      buttonContainer.appendChild(likeDiv);
      buttonContainer.appendChild(commentDiv);
      // buttonContainer.appendChild(shareDiv);

      postElement.appendChild(buttonContainer);

      const optionsButton = postElement.querySelector(".options-button");
      const optionsMenu = postElement.querySelector(".options-menu");
      const deleteBtn = postElement.querySelector(".delete-post");

      // 👇 Handle delete button
      deleteBtn.addEventListener("click", () => {
        const postId = post.id;
        console.log("Deleting post:", postId);

        fetch(`${postBaseUrl}/${postId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to delete post");
            }
            return response.text();
          })
          .then((data) => {
            console.log("Post deleted successfully:", data);
            fetchAllPosts(); // Refresh post list
          })
          .catch((error) => {
            console.error("Error deleting post:", error);
          });
      });

      // 👇 Handle options visibility toggle
      if (post.user_model.user_name !== localStorage.getItem("username")) {
        optionsButton.style.display = "none";
      } else {
        optionsButton.addEventListener("click", (event) => {
          const isVisible = optionsMenu.style.display === "block";
          optionsMenu.style.display = isVisible ? "none" : "block";
          event.stopPropagation();
        });

        document.addEventListener("click", (event) => {
          if (
            !optionsMenu.contains(event.target) &&
            event.target !== optionsButton
          ) {
            optionsMenu.style.display = "none";
          }
        });

        document.addEventListener("scroll", () => {
          optionsMenu.style.display = "none";
        });
      }

    });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }
}

function formatDateTime(inputDatetime) {
  const date = new Date(inputDatetime);

  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    timeZone: "Asia/Kolkata",
  });

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });

  return { date: formattedDate, time: formattedTime };
}
const searchInput = document.getElementById("searchInput");
const overlay = document.getElementById("overlay1");
const crossButton = document.getElementById("crossButton");
const searchResults = document.getElementById("searchResults");

searchInput.addEventListener("click", () => {
  overlay.style.display = "block";
  crossButton.style.display = "block";
});
crossButton.addEventListener("click", (e) => {
  overlay.style.display = "none";
  searchResults.style.display = "none";
  crossButton.style.display = "none";
});

searchInput.addEventListener("input", async (e) => {
  const query = e.target.value.trim();
  const resultDiv = document.getElementById("searchResults");

  if (query.length === 0) {
    resultDiv.innerHTML = "";
    resultDiv.style.display = "none";
    return;
  }

  try {
    const response = await fetch(
      `https://krishna0718-mymedia-java-backend.hf.space/user/search?query=${encodeURIComponent(query)}`
    );
    const users = await response.json();

    if (users.length > 0) {
      resultDiv.style.display = "block";
      resultDiv.innerHTML = users
        .map(
          (user) => `
            <div class="user-result">
              <div class="image-container">
                <img src="../assets/images/profile-pic.jpg" alt="Search User" id="search-user-img">
              </div>
              <div class="search-user-details">
                <h2>${user.user_name}</h2>
                <h3>${user.full_name}</h3>
              </div>
            </div>
          `
        )
        .join("");
    } else {
      resultDiv.style.display = "block";
      resultDiv.innerHTML = `<p class = "user-result">No users found.</p>`;
    }
  } catch (error) {
    console.error("Search error:", error);
    resultDiv.innerHTML = `<p>Error while searching. Please try again.</p>`;
  }
});

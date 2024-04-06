const getInitials = (fullName) => {
  const nameParts = fullName.split(" ");
  const firstInitial = nameParts[0].charAt(0).toUpperCase();

  if (nameParts.length === 1) {
    return `<span class="text-white text-lg  font-bold ">${firstInitial}</span>`;
  }

  const secondInitial = nameParts[1].charAt(0).toUpperCase();

  return `<div class="flex rounded ">
      <span class="text-gray text-sm  font-bold">${firstInitial}</span>
      <span class="text-white text-sm  font-bold">${secondInitial}</span>
  </div>`;
};

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours() > 12 ? (date.getHours() - 12).toString().padStart(2, '0') : date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const period = date.getHours() >= 12 ? 'PM' : 'AM';

  return `${year}-${month}-${day} ${hour}:${minute} ${period}`;
}

function validateEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
}
function showToast(message) {
  let snackbar = document.getElementById("snackbar");

  // If snackbar element doesn't exist, create it dynamically
  if (!snackbar) {
    snackbar = document.createElement('div');
    snackbar.id = 'snackbar';
    document.body.appendChild(snackbar);
  }

  snackbar.className = 'show';
  snackbar.innerText = message;

  setTimeout(function () {
    snackbar.classList.remove('show');
    snackbar.innerText = '';
  }, 3000);
}

function createLoader() {
  const loaderContainer = document.createElement('div');
  loaderContainer.classList.add('loader-container');
  const loaderSpan = document.createElement('span');
  loaderSpan.classList.add('loader');
  loaderContainer.appendChild(loaderSpan);
  return loaderContainer;
}
// Function to append loader span
function appendLoader() {
  const loaderContainer = createLoader();
  document.body.appendChild(loaderContainer);
}

// Function to remove loader span
function removeLoader() {
  const loaderContainer = document.querySelector('.loader-container');
  if (loaderContainer) {
    loaderContainer.parentNode.removeChild(loaderContainer);
  }
}


function getBearerToken() {
  // Retrieve token from local storage
  const token = localStorage.getItem('token');

  // Check if token exists
  if (token) {
    return token;
  } else {
    return null;
  }
}

// Example usage:
const bearerToken = getBearerToken();

const getNav = document.getElementById("navItems");
const button = document.getElementById("navButton");
if (button) {
  button.addEventListener('click', () => {
    getNav.classList.toggle("hidden")
  });
}

// Modal
let popups = document.querySelectorAll(".comment-division");
let btns = document.querySelectorAll(".openModalBtn");
let closeBtns = document.querySelectorAll(".close");
if (popups && btns && closeBtns) {
  btns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      popups[index].classList.toggle("hidden");
    });
  });

  closeBtns.forEach((closeBtn, index) => {
    closeBtn.addEventListener('click', () => {
      popups[index].classList.toggle("hidden");
    });
  });

  window.addEventListener('click', (event) => {
    popups.forEach(popup => {
      if (!popup.contains(event.target)) {
        popup.classList.add("hidden");
      }
    });
  });
}

document.addEventListener("change", () => {
  const fileInput = document.getElementById("file");
});
function addBlog() {
  let titleInput = document.getElementById("blogTitle");
  let fileInput = document.getElementById("file");
  let bodyInput = document.getElementById("blogBody");
  let blogIdInput = document.getElementById("blogId"); // Assuming you have an input field for blog ID

  let title = titleInput.value;
  let file = fileInput ? fileInput.files[0] : null;
  let body = bodyInput.value;
  let blogId = blogIdInput.value;

  if (!title || !body) {
    showToast('Incomplete blog details.');
    return;
  }

  appendLoader(document.body);

  let formData = new FormData();
  formData.append('blogTitle', title);
  formData.append('blogImage', file);
  formData.append('blogBody', body);


  let url = 'https://my-brand-backend-vq8n.onrender.com/blog';
  let method;

  if (blogId) {
    url += `/update/${blogId}`;
    method = 'PUT';
  } else {
    url += `/create`;
    method = 'POST';

  }

  fetch(url, {
    method: method,
    body: formData,
    headers: {
      'Authorization': `Bearer ${bearerToken}`
    }
  })
    .then(response => response.json())
    .then(data => {
      showToast(data.message);
      refreshTable();

      titleInput.value = "";
      fileInput = "";
      bodyInput.value = "";
      blogIdInput.value = "";

      removeLoader(document.body);
    })
    .catch(error => {

      showToast(error.message);
      removeLoader(document.body);
    });
}



function deleteBlog(blog) {
  appendLoader(document.body);
  fetch(`https://my-brand-backend-vq8n.onrender.com/blog/delete/${blog}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${bearerToken}`
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      showToast(data.message);
      refreshTable();
      removeLoader(document.body);
    })
    .catch(error => {
      showToast(error.message);
      removeLoader(document.body);
    });
}


function updateBlog(blogId) {
  // Fetch the blog details using its ID 
  appendLoader(document.body);
  fetch(`https://my-brand-backend-vq8n.onrender.com/blog/byid/${blogId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${bearerToken}`
    }
  })
    .then(response => {
      showToast(response.message);
      removeLoader(document.body);
      return response.json();
    })
    .then(blog => {
      let title = blog.data.blogTitle;
      let fileSrc = blog.data.blogImage;
      let body = blog.data.blogBody;

      // Set form fields with the retrieved data
      document.getElementById('blogTitle').value = title;
      document.getElementById('blogBody').value = body;
      document.getElementById('blogId').value = blogId;
    })
    .catch(error => {
      showToast(error.message);
      removeLoader(document.body);
    });
}

function refreshTable() {
  
  const isDashboardPage = document.getElementById("DASHBOARD") !== null;

  // If it's not the dashboard page, return without refreshing the table
  if (!isDashboardPage) {
    return;
  }
  appendLoader(document.body);
  fetch('https://my-brand-backend-vq8n.onrender.com/blog/all', {
    headers: {
      'Authorization': `Bearer ${bearerToken}`
    }
  })
    .then(response => {
      if (!response.ok) {

        showToast('Network response was not ok');
        removeLoader(document.body);
        throw new Error('Network response was not ok');

      }
      removeLoader(document.body);
      return response.json();
    })
    .then(blogs => {
      let table = document?.getElementById("blogTable")?.getElementsByTagName('tbody')[0] || '';
      if (table) table.innerHTML = ''; // Clear table
      if (blogs && table) {
        blogs.data.forEach(blog => {
          let newRow = table.insertRow(table.rows.length);
          newRow.dataset.blogId = blog._id;
          let titleCell = newRow.insertCell(0);
          let fileCell = newRow.insertCell(1);
          let bodyCell = newRow.insertCell(2);
          let commentCell = newRow.insertCell(3);
          let likeCell = newRow.insertCell(4);
          let actionCell = newRow.insertCell(5);

          titleCell.innerHTML = blog.blogTitle.slice(0, 6) + "...";
          fileCell.innerHTML = `<img src="${blog.blogImage}" alt="Uploaded Image" style="max-width: 100px; max-height: 100px;margin:3px;cursor:pointer" onclick="showImagePreview('${blog.blogImage}')">`;
          bodyCell.innerHTML = blog.blogBody.slice(0, 6) + "...";
          commentCell.innerHTML = blog.comments.length;
          likeCell.innerHTML = blog.likes;
          actionCell.innerHTML = `<button onclick="deleteBlog('${blog._id}')" class="bg-red m-2">Delete</button>
                            <button onclick="updateBlog('${blog._id}')" class="bg-primary m-2">Update</button>
                            <button onclick="viewBlog('${blog._id}')" class="bg-primary m-2">View</button>`;

        });
      }
    })
    .catch(error => {
      showToast(error.message);
      removeLoader(document.body);
    });
}
function viewBlog(blogId) {
  appendLoader(document.body);

  fetch(`https://my-brand-backend-vq8n.onrender.com/blog/byid/${blogId}`, {
    headers: {
      'Authorization': `Bearer ${bearerToken}`
    }
  })
    .then(response => {
      if (!response.ok) {
        showToast('Network response was not ok');
        throw new Error('Network response was not ok');
      }

      removeLoader(document.body);

      return response.json();
    })
    .then(data => {
      showToast(data.message);
      const blog = data.data; // Extract blog data from response
      // Create a popup to display the blog details
      const popup = document.createElement('div');
      popup.classList.add('popup', 'bg-white', 'pad', 'rounded', 'w-grid');

      // Blog container
      const blogContainer = document.createElement('div');
      blogContainer.classList.add('flex', 'flex-col', 'bg-white', 'w-grid', 'rounded');
      popup.appendChild(blogContainer);

      // Blog title
      const span = document.createElement('span');
      span.classList.add('flex', 'items-center', 'justify-between', 'pad-x')
      const title = document.createElement('h1');
      title.textContent = blog.blogTitle;
      title.classList.add('text-lg', 'text-end', 'pad');

      const likes = document.createElement('p');
      likes.textContent = `Likes: ${blog.likes}`;
      likes.classList.add('text-start');

      span.appendChild(title)
      span.appendChild(likes)



      blogContainer.appendChild(span);

      // Blog image and body container
      const imageAndBodyContainer = document.createElement('div');
      imageAndBodyContainer.classList.add('gap-8', 'rounded', 'w-full', 'pad', 'flex', 'items-center', 'flex-row');
      blogContainer.appendChild(imageAndBodyContainer);

      // Blog image
      const image = document.createElement('img');
      image.src = blog.blogImage;
      image.alt = 'Blog Image';
      image.classList.add('blog_image');
      imageAndBodyContainer.appendChild(image);

      // Blog body
      const body = document.createElement('p');
      body.textContent = blog.blogBody;
      imageAndBodyContainer.appendChild(body);


      // Comments
      if (blog.comments.length > 0) {
        const commentsContainer = document.createElement('div');
        commentsContainer.classList.add('flex', 'items-start', 'gap-8', 'flex-col', 'pad');
        const commentsTitle = document.createElement('h3');
        commentsTitle.textContent = 'Comments:';
        commentsContainer.appendChild(commentsTitle);

        blog.comments.forEach(comment => {
          const commentWrapper = document.createElement('div');
          commentWrapper.classList.add('comment-wrapper', 'flex', 'items-center', 'gap-8', 'text-white');

          const profileText = document.createElement('div');
          profileText.classList.add('profile-text', 'text-center', 'flex', 'items-center', 'justify-center', 'rounded');
          profileText.setAttribute('title', comment.name);
          profileText.innerHTML = getInitials(comment.name);
          commentWrapper.appendChild(profileText);

          const commentContent = document.createElement('div');
          commentContent.classList.add('comment-content', 'flex', 'flex-col');

          const commenterName = document.createElement('span');
          commenterName.classList.add('text-xs');
          commenterName.textContent = comment.name;
          commentContent.appendChild(commenterName);

          const commentText = document.createElement('p');
          commentText.textContent = comment.comment;
          commentContent.appendChild(commentText);

          const commentTimestamp = document.createElement('small');
          commentTimestamp.classList.add('text-xs');
          commentTimestamp.innerHTML = formatTimestamp(comment.createdAt);
          commentContent.appendChild(commentTimestamp);

          commentWrapper.appendChild(commentContent);

          commentsContainer.appendChild(commentWrapper);
        });

        popup.appendChild(commentsContainer);
      }



      // Close button
      const closeButton = document.createElement('button');
      closeButton.textContent = 'Close';
      closeButton.classList.add('close-button', 'text-center');
      closeButton.addEventListener('click', () => {
        document.body.removeChild(popup);
      });
      popup.appendChild(closeButton);

      // Add the popup to the body
      document.body.appendChild(popup);
    })
    .catch(error => {
      showToast(error.message);
      removeLoader(document.body);
    });
}



function showImagePreview(imageUrl) {
  
  let popup = document.createElement('div');
  popup.classList.add('popup');

  
  let closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.classList.add('close-button');
  closeButton.addEventListener('click', () => {
    document.body.removeChild(popup); 
  });

  
  popup.style.backgroundImage = `url(${imageUrl})`;

  
  popup.appendChild(closeButton);
  document.body.appendChild(popup);
}



const popupStyle = `
.popup {
  position: fixed;
  top: 0;
  right:0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 1);
  
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  overflow-y: scroll;
  z-index: 9999;
}
img:hover{
  cursor: zoom-out; /* Change cursor to zoom-out when hovering over the image */

}
`;



const styleElement = document.createElement('style');
styleElement.innerHTML = popupStyle;
document.head.appendChild(styleElement);


refreshTable();




document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const email = document.getElementById('email') ? document.getElementById('email').value : null;
      const password = document.getElementById('password') ? document.getElementById('password').value : null;

      if (!email || !password) {
        showToast('Incomplete login details.');
        return;
      }

      document.getElementById('email-error').textContent = '';
      document.getElementById('password-error').textContent = '';

      if (!validateEmail(email)) {
        document.getElementById('email-error').textContent = 'Please enter a valid email address.';
        return;
      }

      if (password.length < 6) {
        document.getElementById('password-error').textContent = 'Password must be at least 6 characters long.';
        return;
      }

      const loginData = {
        email: email,
        password: password
      };
      fetch('https://my-brand-backend-vq8n.onrender.com/admin/access/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          showToast(data.message);
          localStorage.setItem('token', data.token);
          window.location.href = "./dashboard.html";
        })
        .catch(error => {
          showToast(error.message);
          console.log(error)
          document.getElementById('email-error').textContent = 'Invalid email or password';
        });
    });

    function validateEmail(email) {
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return re.test(String(email).toLowerCase());
    }
  }
});

function logout() {
  localStorage.removeItem('token');
  window.location.href = "./login.html";
}
document.addEventListener('DOMContentLoaded', function () {
  const dashboardPage = document.getElementById('DASHBOARD');

  if (dashboardPage) {

    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = "./login.html";

    }
  }
});


document.addEventListener('DOMContentLoaded', function () {
  const openModalIcons = document.querySelectorAll('.openModalBtn');

  openModalIcons.forEach(icon => {
    icon.addEventListener('click', function () {
      const modalId = this.dataset.modal;
      const modal = document.getElementById(modalId);
      modal.classList.toggle('hidden');
    });
  });
});

function sendEmail() {
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const bodyInput = document.getElementById('body');

  const email = emailInput.value;
  const subject = subjectInput.value;
  const body = bodyInput.value;

  // Validate email
  if (!validateEmail(email)) {
    document.getElementById('email-error').textContent = 'Please enter a valid email address.';
    return;
  }

  // Validate subject
  if (subject.trim() === '') {
    document.getElementById('subject-error').textContent = 'Subject cannot be empty.';
    return;
  }

  // Validate body
  if (body.length < 1) {
    document.getElementById('body-error').textContent = 'Body cannot be empty.';
    return;
  }

  // Clear error messages
  document.getElementById('email-error').textContent = '';
  document.getElementById('subject-error').textContent = '';
  document.getElementById('body-error').textContent = '';

  // Append loader before sending the request
  appendLoader();

  // Form payload
  const formData = {
    from: email,
    subject,
    text: body
  };

  // Send request to the server
  fetch('https://my-brand-backend-vq8n.onrender.com/admin/mail/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      showToast(data.message); // Show success message
      // Clear form fields
      emailInput.value = '';
      subjectInput.value = '';
      bodyInput.value = '';
    })
    .catch(error => {
      showToast(error.message); // Show error message
    })
    .finally(() => {
      removeLoader(); // Remove loader after fetch request completes
    });
}



// Add event listener to form submission
document.getElementById('contactForm').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent default form submission behavior

  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const email = document.getElementById('email') ? document.getElementById('email').value : null;
      const subject = document.getElementById('subject') ? document.getElementById('subject').value : null; // Check if subject input exists
      const body = document.getElementById('body') ? document.getElementById('body').value : null; // Check if body input exists

      if (!email || !subject || !body) {
        showToast('Incomplete form details.');
        return;
      }

      // Reset error messages
      document.getElementById('email-error').textContent = '';
      document.getElementById('subject-error').textContent = '';
      document.getElementById('body-error').textContent = '';

      // Email validation
      if (!validateEmail(email)) {
        document.getElementById('email-error').textContent = 'Please enter a valid email address.';
        return;
      }

      // Subject validation
      if (subject.trim() === '') {
        document.getElementById('subject-error').textContent = 'Subject cannot be empty.';
        return;
      }

      // Body validation
      if (body.length < 30) {
        document.getElementById('body-error').textContent = 'Body must be at least 30 characters.';
        return;
      }

      sendEmail(); // Call sendEmail function to handle form submission
      showToast('Form submitted successfully!');
    });
  }


});

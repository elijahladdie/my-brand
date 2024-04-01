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
console.log(closeBtns,"***************")
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
  console.log(fileInput.files)
});

// add blog
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
    console.log('Incomplete blog details.');
    return;
  }

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
      console.log('Blog', blogId ? 'updated' : 'added', 'successfully:', data);
      refreshTable();
    })
    .catch(error => {
      console.error('Error', blogId ? 'updating' : 'adding', 'blog:', error);
    });
}



function deleteBlog(blog) {
  console.log("***************************************")
  console.log(blog)
  console.log("***************************************")
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
      console.log('Blog deleted successfully:', data);
      refreshTable();
    })
    .catch(error => {
      console.error('Error deleting blog:', error);
    });
}


function updateBlog(blogId) {
  // Fetch the blog details using its ID
  fetch(`https://my-brand-backend-vq8n.onrender.com/blog/byid/${blogId}`, {
    method: 'GET',
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
      console.error('Error fetching blog details:', error);
    });
}

function refreshTable() {
  fetch('https://my-brand-backend-vq8n.onrender.com/blog/all', {
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
          let actionCell = newRow.insertCell(3);

          titleCell.innerHTML = blog.blogTitle;
          fileCell.innerHTML = `<img src="${blog.blogImage}" alt="Uploaded Image" style="max-width: 100px; max-height: 100px;margin:3px;cursor:pointer" onclick="showImagePreview('${blog.blogImage}')">`;
          bodyCell.innerHTML = blog.blogBody;
          actionCell.innerHTML = `<button onclick="deleteBlog('${blog._id}')" class="bg-red m-2">Delete</button> <button onclick="updateBlog('${blog._id}')" class="bg-primary m-2">Update</button>`;
        });
      }
    })
    .catch(error => {
      console.error('Error fetching blogs:', error);
    });
}

// Function to show image preview popup
function showImagePreview(imageUrl) {
  // Create a popup division
  let popup = document.createElement('div');
  popup.classList.add('popup');
  
  // Create a close button
  let closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.classList.add('close-button');
  closeButton.addEventListener('click', () => {
    document.body.removeChild(popup); // Remove the popup from the DOM when the close button is clicked
  });
  
  // Set the background image of the popup division
  popup.style.backgroundImage = `url(${imageUrl})`;
  
  // Append the close button and popup division to the body
  popup.appendChild(closeButton);
  document.body.appendChild(popup);
}


// CSS styles for the popup division
const popupStyle = `
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 9999;
  cursor: zoom-out; /* Change cursor to zoom-out when hovering over the image */
}`;

// Add the CSS styles to the document head
const styleElement = document.createElement('style');
styleElement.innerHTML = popupStyle;
document.head.appendChild(styleElement);


refreshTable();



document.addEventListener('DOMContentLoaded', function () {
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const email = document.getElementById('email') ? document.getElementById('email').value : null; // Check if email input exists
      const subject = document.getElementById('subject') ? document.getElementById('subject').value : null; // Check if subject input exists
      const body = document.getElementById('body') ? document.getElementById('body').value : null; // Check if body input exists

      if (!email || !subject || !body) {
        console.log('Incomplete form details.');
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
      if (body.length < 40) {
        document.getElementById('body-error').textContent = 'Body must be at least 40 characters.';
        return;
      }

      // If all validations pass, you can submit the form or perform any other actions here
      console.log('Form submitted successfully!');
    });
  }

  function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  }
});

// Login form validation
document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const email = document.getElementById('email') ? document.getElementById('email').value : null; // Check if email input exists
      const password = document.getElementById('password') ? document.getElementById('password').value : null; // Check if password input exists

      if (!email || !password) {
        console.log('Incomplete login details.');
        return;
      }

      // Reset error messages
      document.getElementById('email-error').textContent = '';
      document.getElementById('password-error').textContent = '';

      // Email validation
      if (!validateEmail(email)) {
        document.getElementById('email-error').textContent = 'Please enter a valid email address.';
        return;
      }

      // Password validation
      if (password.length < 6) {
        document.getElementById('password-error').textContent = 'Password must be at least 6 characters long.';
        return;
      }

      // Prepare login data
      const loginData = {
        email: email,
        password: password
      };

      // Send login request to the backend
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
          // Handle successful login
          console.log('Login successful:', data);

          // Store token in local storage
          localStorage.setItem('token', data.token);

          // Redirect to dashboard or perform other actions
          window.location.href = "./dashboard.html";
        })
        .catch(error => {
          // Handle login error
          console.error('Login failed:', error);
          // Display error message to the user
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
  // Clear token from local storage
  localStorage.removeItem('token');
  // Redirect to login page or perform other actions
  window.location.href = "./login.html"; // Redirect to the login page
}
document.addEventListener('DOMContentLoaded', function () {
  const dashboardPage = document.getElementById('DASHBOARD');

  // Check if token is present in local storage\
  if (dashboardPage) {

    const token = localStorage.getItem('token');
    if (!token) {
      // If no token found, redirect to login page or display error message
      window.location.href = "./login.html"; // Redirect to login page
      // Or display an error message
      // dashboardPage.innerHTML = '<p>You are not authorized to view this page. Please log in.</p>';
    }
  }
});


document.addEventListener('DOMContentLoaded', function () {
  const openModalIcons = document.querySelectorAll('.openModalBtn');

  openModalIcons.forEach(icon => {
    icon.addEventListener('click', function () {
      const modalId = this.dataset.modal; // Get the modal ID from the data attribute
      const modal = document.getElementById(modalId); // Find the modal by its ID
      modal.classList.toggle('hidden'); // Toggle the 'hidden' class to show/hide the modal
    });
  });
});

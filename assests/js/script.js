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
    showToast('Incomplete blog details.');
    return;
  }

  appendLoader(document.body); // Append loader span before performing action

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
      removeLoader(document.body); 
    })
    .catch(error => {
      showToast(error.message);
      removeLoader(document.body); 
    });
}



function deleteBlog(blog) {
  
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
    })
    .catch(error => {
      showToast(error.message);
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
          let commentCell = newRow.insertCell(3);
          let likeCell = newRow.insertCell(4);
          let actionCell = newRow.insertCell(5);

          titleCell.innerHTML = blog.blogTitle.slice(0, 6) + "...";
          fileCell.innerHTML = `<img src="${blog.blogImage}" alt="Uploaded Image" style="max-width: 100px; max-height: 100px;margin:3px;cursor:pointer" onclick="showImagePreview('${blog.blogImage}')">`;
          bodyCell.innerHTML = blog.blogBody.slice(0, 6) + "...";
          commentCell.innerHTML = blog.comments.length;
          likeCell.innerHTML = blog.likes;
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
      if (body.length < 40) {
        document.getElementById('body-error').textContent = 'Body must be at least 40 characters.';
        return;
      }

      showToast('Form submitted successfully!');
    });
  }

  function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  }
});

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

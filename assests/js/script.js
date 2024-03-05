// Toggle navigation visibility
const getNav = document.getElementById("navItems");
const button = document.getElementById("navButton");
if (button) {
  button.addEventListener('click', () => {
    getNav.classList.toggle("hidden")
  });
}

// Modal
let modal = document.getElementById("myModal");
let btn = document.querySelectorAll(".openModalBtn"); // Use querySelector for single element
let span = document.querySelectorAll(".close"); // Use querySelector for single element

// Check if modal and buttons exist before adding event listeners
if (modal && btn && span) {
  btn.onclick = function () {
    modal.style.display = "block";
  }

  span.onclick = function () {
    modal.style.display = "none";
  }

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}
document.addEventListener("change", () => {
  const fileInput = document.getElementById("file");
  console.log(fileInput.files)
})

console.log(modal,"---1----",
  btn,"---2----",
  span)
// add blog
function addBlog() {
  let title = document.getElementById("blogTitle").value;
  let fileInput = document.getElementById("file");
  let file = fileInput ? fileInput.files[0] : null;
  let body = document.getElementById("blogBody").value;

  if (!title || !body) {
    console.log('Incomplete blog details.');
    return;
  }

  let reader = new FileReader();
  reader.onload = function (event) {
    let imageUrl = event.target.result;

    let blog = {
      title: title,
      fileSrc: imageUrl, // Keep the same image source by default
      body: body
    };
    console.log(imageUrl, "*********************")

    let blogs = JSON.parse(localStorage.getItem('blogs')) || [];

    // Check if the blog with the same title already exists
    let existingBlogIndex = -1;
    for (let i = 0; i < blogs.length; i++) {
      if (blogs[i].title === title) {
        existingBlogIndex = i;
        break;
      }
    }

    if (existingBlogIndex !== -1) {
      // Update the existing blog entry with the new title and body
      blogs[existingBlogIndex] = blog;
    } else {
      // Add the new blog entry
      blogs.push(blog);
    }

    localStorage.setItem('blogs', JSON.stringify(blogs));

    refreshTable();

    document.getElementById("blogTitle").value = "";
    if (fileInput) fileInput.value = ""; // Check if fileInput exists
    document.getElementById("blogBody").value = "";
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    reader.onload({ target: { result: '' } }); // Trigger onload with an empty result if file is not provided
  }
}



function deleteBlog(button) {
  let row = button.parentNode.parentNode;
  let index = row.rowIndex;

  let blogs = JSON.parse(localStorage.getItem('blogs')) || [];
  blogs.splice(index - 1, 1);
  localStorage.setItem('blogs', JSON.stringify(blogs));

  refreshTable();
}

function updateBlog(button) {
  let row = button.parentNode.parentNode;
  let cells = row.getElementsByTagName("td");
  let title = cells[0].textContent; // Use textContent instead of innerHTML to get the plain text
  let fileSrcElement = cells[1].getElementsByTagName("img")[0]; // Get the image element
  let fileSrc = fileSrcElement ? fileSrcElement.src : ''; // Check if the image exists before accessing its src
  let body = cells[2].textContent; // Use textContent instead of innerHTML to get the plain text
  document.getElementById("blogTitle").value = title;
  // You may want to reset the file input only if the fileSrc is not empty

  document.getElementById("blogBody").value = body;
  if (fileSrc) {
    const fileInput = document.getElementById("file");

    // Create a new File object with the file source and name
    const file = new File([fileSrcElement], fileSrc, { type: 'image/*' });
    console.log(file.name, "__________________")
    // Create a new FileList containing the File object
    const fileList = new DataTransfer();
    fileList.items.add(file);
    console.log(fileInput.files, "________1__________")
    // Set the files property of the file input to the new FileList
    fileInput.files = fileList.files;
    console.log(fileInput.files, "________2__________")

  }
}


// Refresh table function (commented out for now)
function refreshTable() {
  let blogs = JSON.parse(localStorage.getItem('blogs')) || [];
  let table = document?.getElementById("blogTable")?.getElementsByTagName('tbody')[0] || '';
  if (table) table.innerHTML = ''; // Clear table
  if (blogs && table) {

    for (let i = 0; i < blogs?.length; i++) {
      let newRow = table.insertRow(table.rows.length);
      let titleCell = newRow.insertCell(0);
      let fileCell = newRow.insertCell(1);
      let bodyCell = newRow.insertCell(2);
      let actionCell = newRow.insertCell(3);

      titleCell.innerHTML = blogs[i].title;
      fileCell.innerHTML = '<img src="' + blogs[i].fileSrc + '" alt="Uploaded Image" style="max-width: 100px; max-height: 100px;">';
      bodyCell.innerHTML = blogs[i].body;
      actionCell.innerHTML = '<button onclick="deleteBlog(this)" class="bg-red">Delete</button> <button onclick="updateBlog(this)" class="bg-primary">Update</button>';
    }
  }
}

refreshTable();
// Contact form validation
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

      // If all validations pass, you can submit the form or redirect to dashboard
      // For now, let's just log the success message
      window.location.href = "./dashboard.html"
    });

    function validateEmail(email) {
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return re.test(String(email).toLowerCase());
    }
  }
});

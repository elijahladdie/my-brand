const getNav = document.getElementById("navItems");
const button = document.getElementById("navButton");
button.addEventListener('click', () => {
    getNav.classList.toggle("hidden")
});


// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("openModalBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function () {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
// document.addEventListener("DOMContentLoaded", function() {
    // Place your JavaScript code here
function addBlog() {
    var title = document.getElementById("blogTitle").value;
    var fileInput = document.getElementById("file");
    var file = fileInput.files[0];
    var body = document.getElementById("blogBody").value;
  
    var reader = new FileReader();
    reader.onload = function(event) {
      var imageUrl = event.target.result;
  
      // Create a new blog object
      var blog = {
        title: title,
        fileSrc: imageUrl,
        body: body
      };
  
      // Store the blog object in localStorage
      var blogs = JSON.parse(localStorage.getItem('blogs')) || [];
      blogs.push(blog);
      localStorage.setItem('blogs', JSON.stringify(blogs));
  
      // Refresh the table
      refreshTable();
  
      // Clear form fields after adding to table
      document.getElementById("blogTitle").value = "";
      fileInput.value = "";
      document.getElementById("blogBody").value = "";
    };
  
    reader.readAsDataURL(file);
  }
  
  function deleteBlog(button) {
    var row = button.parentNode.parentNode;
    var index = row.rowIndex;
  
    // Remove the blog from localStorage
    var blogs = JSON.parse(localStorage.getItem('blogs')) || [];
    blogs.splice(index - 1, 1);
    localStorage.setItem('blogs', JSON.stringify(blogs));
  
    // Refresh the table
    refreshTable();
  }
  
  function updateBlog(button) {
    var row = button.parentNode.parentNode;
    var index = row.rowIndex;
    var cells = row.getElementsByTagName("td");
    var title = cells[0].innerHTML;
    var fileSrc = cells[1].getElementsByTagName("img")[0].src;
    var body = cells[2].innerHTML;
  
    // Populate form fields with selected blog data
    document.getElementById("blogTitle").value = title;
    // You may want to handle file input and setting image source differently
    // For simplicity, I'll just set the file input value to an empty string
    document.getElementById("file").value = "";
    document.getElementById("blogBody").value = body;
  }
  
  function refreshTable() {
    var blogs = JSON.parse(localStorage.getItem('blogs')) || [];
    var table = document.getElementById("blogTable").getElementsByTagName('tbody')[0];
    table.innerHTML = ''; // Clear table body
  
    // Populate table with blogs from localStorage
    for (var i = 0; i < blogs.length; i++) {
      var newRow = table.insertRow(table.rows.length);
      var titleCell = newRow.insertCell(0);
      var fileCell = newRow.insertCell(1);
      var bodyCell = newRow.insertCell(2);
      var actionCell = newRow.insertCell(3);
  
      titleCell.innerHTML = blogs[i].title;
      fileCell.innerHTML = '<img src="' + blogs[i].fileSrc + '" alt="Uploaded Image" style="max-width: 100px; max-height: 100px;">';
      bodyCell.innerHTML = blogs[i].body;
      actionCell.innerHTML = '<button onclick="deleteBlog(this)" class="bg-red">Delete</button> <button onclick="updateBlog(this)" class="bg-primary">Update</button>';
    }
  }
  
  // Load blogs from localStorage on page load
  refreshTable();
// })
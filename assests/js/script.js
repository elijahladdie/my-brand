const getNav = document.getElementById("navItems");
const button = document.getElementById("navButton");
button.addEventListener('click', () => {
  getNav.classList.toggle("hidden")
});


//*************** */
var modal = document.getElementById("myModal");

//*************** */
var btn = document.getElementById("openModalBtn");

//*************** */
var span = document.getElementsByClassName("close")[0];

//*************** */
btn.onclick = function () {
  modal.style.display = "block";
}

//*************** */
span.onclick = function () {
  modal.style.display = "none";
}

//*************** */
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
//*************** */
//*************** */
function addBlog() {
  var title = document.getElementById("blogTitle").value;
  var fileInput = document.getElementById("file");
  var file = fileInput.files[0];
  var body = document.getElementById("blogBody").value;

  var reader = new FileReader();
  reader.onload = function (event) {
    var imageUrl = event.target.result;

    //*************** */
    var blog = {
      title: title,
      fileSrc: imageUrl,
      body: body
    };

    //*************** */
    var blogs = JSON.parse(localStorage.getItem('blogs')) || [];
    blogs.push(blog);
    localStorage.setItem('blogs', JSON.stringify(blogs));

    //*************** */
    refreshTable();

    //*************** */
    document.getElementById("blogTitle").value = "";
    fileInput.value = "";
    document.getElementById("blogBody").value = "";
  };

  reader.readAsDataURL(file);
}

function deleteBlog(button) {
  var row = button.parentNode.parentNode;
  var index = row.rowIndex;

  //*************** */
  var blogs = JSON.parse(localStorage.getItem('blogs')) || [];
  blogs.splice(index - 1, 1);
  localStorage.setItem('blogs', JSON.stringify(blogs));

  //*************** */
  refreshTable();
}

function updateBlog(button) {
  var row = button.parentNode.parentNode;
  var index = row.rowIndex;
  var cells = row.getElementsByTagName("td");
  var title = cells[0].innerHTML;
  var fileSrc = cells[1].getElementsByTagName("img")[0].src;
  var body = cells[2].innerHTML;

  //*************** */
  document.getElementById("blogTitle").value = title;
  //*************** */
  //*************** */
  document.getElementById("file").value = "";
  document.getElementById("blogBody").value = body;
}

function refreshTable() {
  var blogs = JSON.parse(localStorage.getItem('blogs')) || [];
  var table = document.getElementById("blogTable").getElementsByTagName('tbody')[0];
  table.innerHTML = ''; //*************** */

  //*************** */
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

//*************** */
refreshTable();
//*************** */




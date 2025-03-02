'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// // page navigation variables
// const navigationLinks = document.querySelectorAll("[data-nav-link]");
// const pages = document.querySelectorAll("[data-page]");

// // add event to all nav link
// for (let i = 0; i < navigationLinks.length; i++) {
//   navigationLinks[i].addEventListener("click", function () {

//     for (let i = 0; i < pages.length; i++) {
//       if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
//         pages[i].classList.add("active");
//         navigationLinks[i].classList.add("active");
//         window.scrollTo(0, 0);
//       } else {
//         pages[i].classList.remove("active");
//         navigationLinks[i].classList.remove("active");
//       }
//     }

//   });
// }

const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav links
navigationLinks.forEach((navLink) => {
  navLink.addEventListener("click", function () {
    const targetPage = this.innerHTML.toLowerCase();

    // Remove "active" class from all navigation links
    navigationLinks.forEach((link) => link.classList.remove("active"));

    // Remove "active" class from all pages
    pages.forEach((page) => {
      if (page.dataset.page === targetPage) {
        page.classList.add("active");
        navLink.classList.add("active"); // Correctly adds "active" class to the clicked nav item
        window.scrollTo(0, 0);
      } else {
        page.classList.remove("active");
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  fetch("/blog.html") // Fetch blog page
    .then((response) => response.text())
    .then((html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const posts = doc.querySelectorAll("ul li a");
      const blogList = document.getElementById("blog-posts");

      const filterList = document.querySelector(".filter-list");
      const selectList = document.querySelector(".select-list");
      const selectValue = document.querySelector("[data-selecct-value]");

      let categoriesSet = new Set();
      blogList.innerHTML = ""; // Clear loading text

      posts.forEach((post) => {
        const urlParts = post.getAttribute("href").split("/").filter(Boolean);
        const day = urlParts[urlParts.length - 4];
        const month = urlParts[urlParts.length - 3];
        const year = urlParts[urlParts.length - 2];
        const categories = urlParts.slice(0, -4); // Array of categories

        categories.forEach((cat) => categoriesSet.add(cat)); // Collect unique categories

        const listItem = document.createElement("li");
        listItem.classList.add("blog-post-item");
        listItem.setAttribute("data-category", categories.join(" ")); // Add categories as data attribute

        listItem.innerHTML = `
          <a href="${post.href}" class="blog-link">
            
            <h3 class="h3 blog-item-title">${post.textContent}</h3>
            <div class="blog-meta">
              <span class="arrow">||</span> 
              <time datetime="${year}-${month}-${day}">${day} ${month}, ${year}</time>
              <span class="dot"></span>
              <p class="blog-category">${categories.join(" / ")}</p>
            </div>
          </a>
        `;
        blogList.appendChild(listItem);
      });

      // Clear existing filter items except "All"
      filterList.innerHTML = `<li class="filter-item">
        <button class="active" data-filter-btn>All</button>
      </li>`;

      selectList.innerHTML = `<li class="select-item">
        <button data-select-item>All</button>
      </li>`;

      // Add categories to the filter buttons and dropdown list
      categoriesSet.forEach((category) => {
        const filterItem = document.createElement("li");
        filterItem.classList.add("filter-item");
        filterItem.innerHTML = `<button data-filter-btn>${category}</button>`;
        filterList.appendChild(filterItem);

        const selectItem = document.createElement("li");
        selectItem.classList.add("select-item");
        selectItem.innerHTML = `<button data-select-item>${category}</button>`;
        selectList.appendChild(selectItem);
      });

      // Filtering logic for buttons
      document.querySelectorAll("[data-filter-btn]").forEach((btn) => {
        btn.addEventListener("click", function () {
          const selectedCategory = this.textContent.trim();

          document.querySelectorAll("[data-filter-btn]").forEach((b) => b.classList.remove("active"));
          this.classList.add("active");

          filterPosts(selectedCategory);
        });
      });

      // Filtering logic for dropdown
      document.querySelectorAll("[data-select-item]").forEach((item) => {
        item.addEventListener("click", function () {
          const selectedCategory = this.textContent.trim();
          selectValue.textContent = selectedCategory;

          filterPosts(selectedCategory);
        });
      });

      // Function to filter posts
      function filterPosts(category) {
        document.querySelectorAll(".blog-post-item").forEach((post) => {
          const postCategories = post.getAttribute("data-category").split(" ");
          if (category === "All" || postCategories.includes(category)) {
            post.style.display = "block";
          } else {
            post.style.display = "none";
          }
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching blog posts:", error);
      document.getElementById("blog-posts").innerHTML = "<li>Failed to load posts.</li>";
    });
});

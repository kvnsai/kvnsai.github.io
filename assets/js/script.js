"use strict";

// ---------------- Page-specific JS ----------------
window.initPageScripts = function () {
  // Exclude blog logic here

  // Testimonials modal
  const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
  const modalContainer = document.querySelector("[data-modal-container]");
  const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
  const overlay = document.querySelector("[data-overlay]");
  const modalImg = document.querySelector("[data-modal-img]");
  const modalTitle = document.querySelector("[data-modal-title]");
  const modalText = document.querySelector("[data-modal-text]");

  const toggleModal = () => {
    modalContainer?.classList.toggle("active");
    overlay?.classList.toggle("active");
  };

  testimonialsItem.forEach(item => {
    item.addEventListener("click", () => {
      modalImg.src = item.querySelector("[data-testimonials-avatar]")?.src;
      modalTitle.innerHTML = item.querySelector("[data-testimonials-title]")?.innerHTML;
      modalText.innerHTML = item.querySelector("[data-testimonials-text]")?.innerHTML;
      toggleModal();
    });
  });

  modalCloseBtn?.addEventListener("click", toggleModal);
  overlay?.addEventListener("click", toggleModal);

  // Forms
  const form = document.querySelector("[data-form]");
  const formInputs = document.querySelectorAll("[data-form-input]");
  const formBtn = document.querySelector("[data-form-btn]");

  formInputs.forEach(input => {
    input.addEventListener("input", () => {
      if (form?.checkValidity()) formBtn?.removeAttribute("disabled");
      else formBtn?.setAttribute("disabled", "");
    });
  });
};

// ---------------- Blog loader ----------------
window.initBlog = function () {
  const blogPage = document.querySelector('[data-page="blog"]');
  if (!blogPage) return;

  const blogList = blogPage.querySelector("#blog-posts");
  const filterList = blogPage.querySelector(".filter-list");
  const selectList = blogPage.querySelector(".select-list");
  const selectValue = blogPage.querySelector("[data-selecct-value]");

  if (!blogList) return;

  fetch("/blog.html")
    .then(res => res.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Get posts from Jekyll-generated blog.html (only from #blog-posts ul)
      const posts = doc.querySelectorAll("#blog-posts li a");
      
      const categoriesSet = new Set();
      blogList.innerHTML = ""; // Clear loading text

      posts.forEach(post => {
        const urlParts = post.getAttribute("href").split("/").filter(Boolean);
        // URL structure: /category1/category2/.../year/month/day/article-name
        const day = urlParts[urlParts.length - 2];
        const month = urlParts[urlParts.length - 3];
        const year = urlParts[urlParts.length - 4];
        const categories = urlParts.slice(0, -4); // Array of categories (everything before year)

        categories.forEach(cat => categoriesSet.add(cat)); // Collect unique categories

        const listItem = document.createElement("li");
        listItem.classList.add("blog-post-item");
        listItem.setAttribute("data-category", categories.join(" ")); // Add categories as data attribute

        listItem.innerHTML = `
          <a href="${post.getAttribute("href")}" class="blog-link">
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

      // Clear existing filter items and reset with "All"
      filterList.innerHTML = `<li class="filter-item">
        <button class="active" data-filter-btn>All</button>
      </li>`;

      selectList.innerHTML = `<li class="select-item">
        <button data-select-item>All</button>
      </li>`;

      // Add categories to the filter buttons and dropdown list
      categoriesSet.forEach(category => {
        const filterItem = document.createElement("li");
        filterItem.classList.add("filter-item");
        filterItem.innerHTML = `<button data-filter-btn>${category}</button>`;
        filterList.appendChild(filterItem);

        const selectItem = document.createElement("li");
        selectItem.classList.add("select-item");
        selectItem.innerHTML = `<button data-select-item>${category}</button>`;
        selectList.appendChild(selectItem);
      });

      // Function to filter posts
      function filterPosts(category) {
        document.querySelectorAll(".blog-post-item").forEach(post => {
          const postCategories = post.getAttribute("data-category").split(" ");
          if (category === "All" || postCategories.includes(category)) {
            post.style.display = "block";
          } else {
            post.style.display = "none";
          }
        });
      }

      // Filtering logic for buttons
      document.querySelectorAll("[data-filter-btn]").forEach(btn => {
        btn.addEventListener("click", function () {
          const selectedCategory = this.textContent.trim();

          document.querySelectorAll("[data-filter-btn]").forEach(b => b.classList.remove("active"));
          this.classList.add("active");

          filterPosts(selectedCategory);
        });
      });

      // Filtering logic for dropdown
      document.querySelectorAll("[data-select-item]").forEach(item => {
        item.addEventListener("click", function () {
          const selectedCategory = this.textContent.trim();
          selectValue.textContent = selectedCategory;

          filterPosts(selectedCategory);
        });
      });
    })
    .catch(err => {
      console.error("Error fetching blog posts:", err);
      blogList.innerHTML = "<li>Failed to load posts.</li>";
    });
};

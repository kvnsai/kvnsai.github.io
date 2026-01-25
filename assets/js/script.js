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

  fetch("/blog.html") // Always fetch Jekyll-generated blog page
    .then(res => res.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Jekyll-generated blog posts
      const posts = doc.querySelectorAll("ul li a");
      blogList.innerHTML = "";
      filterList.innerHTML = `<li class="filter-item"><button class="active" data-filter-btn>All</button></li>`;
      selectList.innerHTML = `<li class="select-item"><button data-select-item>All</button></li>`;
      selectValue.textContent = "All";

      const categoriesSet = new Set();

      posts.forEach(post => {
        const url = post.getAttribute("href");
        const title = post.textContent;

        // Extract categories and date from the URL
        const parts = url.split("/").filter(Boolean);
        // const article = parts[parts.length - 1]; // filename
        const day = parts[parts.length - 2];
        const month = parts[parts.length - 3];
        const year = parts[parts.length - 4];
        const categories = parts.slice(0, -4);
        categories.forEach(cat => categoriesSet.add(cat));

        const li = document.createElement("li");
        li.classList.add("blog-post-item");
        li.dataset.category = categories.join(" ");
        li.innerHTML = `
          <a href="${url}" class="blog-link">
            <h3 class="h3 blog-item-title">${title}</h3>
            <div class="blog-meta">
              <span class="arrow">||</span> 
              <time datetime="${year}-${month}-${day}">${day} ${month}, ${year}</time>
              <span class="dot"></span>
              <p class="blog-category">${categories.join(" / ")}</p>
            </div>
          </a>
        `;
        blogList.appendChild(li);
      });

      // Add category filters
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

      const filterPosts = category => {
        blogPage.querySelectorAll(".blog-post-item").forEach(post => {
          const postCategories = post.dataset.category.split(" ");
          post.style.display = category === "All" || postCategories.includes(category) ? "block" : "none";
        });
      };

      // Filter button click
      blogPage.querySelectorAll("[data-filter-btn]").forEach(btn => {
        btn.addEventListener("click", () => {
          const category = btn.textContent.trim();
          blogPage.querySelectorAll("[data-filter-btn]").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          filterPosts(category);
        });
      });

      // Dropdown select click
      blogPage.querySelectorAll("[data-select-item]").forEach(item => {
        item.addEventListener("click", () => {
          const category = item.textContent.trim();
          selectValue.textContent = category;
          filterPosts(category);
        });
      });
    })
    .catch(err => {
      console.error("Error loading blog posts:", err);
      blogList.innerHTML = `<li>Failed to load posts.</li>`;
    });
};

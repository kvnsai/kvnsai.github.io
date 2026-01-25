document.addEventListener("includes-loaded", () => {
  const content = document.getElementById("page-content");

  function loadPage(page, updateHash = true, blogSlug = null) {
    const url =
      page === "blog"
        ? "/pages/blog/blog.html"
        : `/pages/${page}/${page}.html`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load page: ${page}`);
        return res.text();
      })
      .then(html => {
        content.innerHTML = html;

        // Activate page element
        const pageEl = content.querySelector(`[data-page="${page}"]`);
        if (pageEl) pageEl.classList.add("active");

        // Run joinHTML on newly loaded content
        if (window.joinHTML) joinHTML(content);

        // Init scripts
        if (page !== "blog" && window.initPageScripts) {
          window.initPageScripts();
        }

        if (page === "blog" && window.initBlog) {
          window.initBlog(blogSlug); // 👈 pass slug
        }

        // Update hash
        if (updateHash) {
          history.pushState(
            null,
            "",
            blogSlug ? `#blog/${blogSlug}` : `#${page}`
          );
        }
      })
      .catch(err => console.error(err));

    // Navbar active state
    document.querySelectorAll(".navbar-link").forEach(btn => {
      btn.classList.toggle(
        "active",
        btn.textContent.toLowerCase() === page
      );
    });
  }

  // Navbar click handlers
  function attachNavHandlers() {
    document.querySelectorAll(".navbar-link").forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        const page = btn.textContent.toLowerCase();
        loadPage(page);
      });
    });
  }

  attachNavHandlers();

  // Hash router
  function loadFromHash() {
    const hash = location.hash.replace("#", "");

    // blog post route → #blog/my-post
    if (hash.startsWith("blog/")) {
      const slug = hash.split("/")[1];
      loadPage("blog", false, slug);
      return;
    }

    // blog index
    if (hash === "blog") {
      loadPage("blog", false);
      return;
    }

    // normal pages
    const page = hash || "about";
    loadPage(page, false);
  }

  // Back / forward support
  window.addEventListener("popstate", loadFromHash);

  // Initial load
  loadFromHash();
});

document.addEventListener("includes-loaded", () => {
  const content = document.getElementById("page-content");

  function loadPage(page) {
    // Blog special case
    const url = page === "blog" ? "/pages/blog/blog.html" : `./pages/${page}/${page}.html`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load page: ${page}`);
        return res.text();
      })
      .then(html => {
        content.innerHTML = html;

        const pageEl = content.querySelector(`[data-page="${page}"]`);
        if (pageEl) pageEl.classList.add("active");

        if (page !== "blog" && window.initPageScripts) window.initPageScripts();
        if (page === "blog" && window.initBlog) window.initBlog();
      })
      .catch(err => console.error(err));

    // Update navbar active
    document.querySelectorAll(".navbar-link").forEach(btn => {
      btn.classList.toggle("active", btn.textContent.toLowerCase() === page);
    });
  }

  // Navbar click handlers
  const attachNavHandlers = () => {
    document.querySelectorAll(".navbar-link").forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        loadPage(btn.textContent.toLowerCase());
      });
    });
  };

  setTimeout(attachNavHandlers, 0);

  // Default page
  loadPage("about");
});

document.addEventListener("DOMContentLoaded", () => {
  const includes = document.querySelectorAll("[data-include]");

  if (includes.length === 0) {
    document.dispatchEvent(new Event("includes-loaded"));
    return;
  }

  let loadedCount = 0;

  includes.forEach(el => {
    const src = el.getAttribute("data-include");
    fetch(src)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load include: ${src}`);
        return res.text();
      })
      .then(html => {
        el.innerHTML = html;
        loadedCount++;
        if (loadedCount === includes.length) {
          // All includes loaded
          document.dispatchEvent(new Event("includes-loaded"));
        }
      })
      .catch(err => {
        console.error(err);
        loadedCount++;
        if (loadedCount === includes.length) {
          document.dispatchEvent(new Event("includes-loaded"));
        }
      });
  });
});

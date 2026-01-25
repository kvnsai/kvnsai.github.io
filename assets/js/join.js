// Generic function to replace [data-join] placeholders
async function joinHTML(root = document) {
  const joinElements = root.querySelectorAll("[data-join]");

  for (const el of joinElements) {
    const file = el.getAttribute("data-join");
    if (!file) continue;

    try {
      const resp = await fetch(file);
      if (!resp.ok) throw new Error(`Failed to load ${file}`);

      const html = await resp.text();

      // Use a temporary container to parse HTML
      const temp = document.createElement("div");
      temp.innerHTML = html;

      // Insert each child node of the snippet before the placeholder
      while (temp.firstChild) {
        el.parentNode.insertBefore(temp.firstChild, el);
      }

      // Remove the placeholder
      el.remove();
    } catch (err) {
      console.error(err);
      el.outerHTML = `<li style="color:red;">Error loading ${file}</li>`;
    }
  }
}

// Expose globally so router.js can call it
window.joinHTML = joinHTML;

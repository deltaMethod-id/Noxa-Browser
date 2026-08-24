/* home.js — logika halaman index.html */

(function setupHome() {
  const form = document.getElementById('homeForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    search(document.getElementById('mainInput').value);
  });

  const count = document.getElementById('tabCount');
  if (count) {
    const total = loadTabs().length;
    count.textContent = total ? String(total) : '0';
  }
})();

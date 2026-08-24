/* tab.js — logika halaman tab.html (tab baru & ganti tab) */

(function setupTabs() {
  const strip = document.getElementById('tabStrip');
  if (!strip) return;

  const frame = document.getElementById('mainFrame');
  const newView = document.getElementById('newTabView');
  const urlInput = document.getElementById('webviewUrl');

  let tabs = loadTabs();
  if (!tabs.length) tabs = [{ id: newId(), title: 'Tab Baru', url: '' }];

  const params = new URLSearchParams(location.search);
  let activeId = params.get('tab');
  if (!tabs.some((t) => t.id === activeId)) activeId = tabs[tabs.length - 1].id;
  let current = tabs.find((t) => t.id === activeId);

  function syncURL() {
    history.replaceState(null, '', 'tab.html?tab=' + encodeURIComponent(activeId));
  }

  function render() {
    strip.innerHTML = '';
    tabs.forEach((tab) => {
      const el = document.createElement('div');
      el.className = 'browser-tab ' + (tab.id === activeId ? 'active' : '');
      el.title = tab.url || 'Tab Baru';
      el.innerHTML =
        '<span class="tab-label">' + escapeHTML(tab.title || 'Tab Baru') + '</span>' +
        '<button class="tab-close" aria-label="Tutup tab">×</button>';
      el.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-close')) {
          closeTab(tab.id);
          return;
        }
        switchTab(tab.id);
      });
      strip.appendChild(el);
    });

    const add = document.createElement('button');
    add.className = 'tab-add';
    add.type = 'button';
    add.setAttribute('aria-label', 'Tab baru');
    add.textContent = '+';
    add.addEventListener('click', createTab);
    strip.appendChild(add);
  }

  function loadCurrent() {
    urlInput.value = current.url || '';
    if (current.url) {
      newView.hidden = true;
      frame.hidden = false;
      frame.src = current.url;
    } else {
      frame.hidden = true;
      frame.src = '';
      newView.hidden = false;
      const input = document.getElementById('newTabInput');
      if (input) input.focus();
    }
  }

  function switchTab(id) {
    activeId = id;
    current = tabs.find((t) => t.id === id);
    syncURL();
    render();
    loadCurrent();
  }

  function createTab() {
    const tab = { id: newId(), title: 'Tab Baru', url: '' };
    tabs.push(tab);
    saveTabs(tabs);
    switchTab(tab.id);
  }

  function openURL(raw) {
    if (!String(raw).trim()) return;
    current.url = normalizeURL(raw);
    current.title = safeHost(current.url);
    saveTabs(tabs);
    render();
    loadCurrent();
  }

  function closeTab(id) {
    const index = tabs.findIndex((t) => t.id === id);
    tabs = tabs.filter((t) => t.id !== id);
    if (!tabs.length) tabs = [{ id: newId(), title: 'Tab Baru', url: '' }];
    saveTabs(tabs);
    if (id === activeId) switchTab(tabs[Math.max(0, index - 1)].id);
    else render();
  }

  document.getElementById('newTab').addEventListener('click', createTab);
  document.getElementById('tabHome').addEventListener('click', goHome);
  document.getElementById('tabBack').addEventListener('click', () => (history.length > 1 ? history.back() : goHome()));
  document.getElementById('goUrl').addEventListener('click', () => openURL(urlInput.value));
  document.getElementById('externalUrl').addEventListener('click', () => {
    if (current.url) window.open(current.url, '_blank', 'noopener');
  });
  document.getElementById('copyUrl').addEventListener('click', async () => {
    if (!current.url) return;
    try {
      await navigator.clipboard.writeText(current.url);
    } catch {}
  });
  document.getElementById('newTabForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const value = document.getElementById('newTabInput').value.trim();
    if (!value) return;
    if (isURL(value)) openURL(value);
    else location.href = 'result.html?q=' + encodeURIComponent(value);
  });
  urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') openURL(urlInput.value);
  });

  saveTabs(tabs);
  syncURL();
  render();
  loadCurrent();

  const initialURL = params.get('url');
  if (initialURL && !current.url) openURL(initialURL);
})();

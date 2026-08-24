/* result.js — logika halaman result.html (hasil pencarian) */

const rainAIKnowledge = {
  microsoft: 'Microsoft Corporation adalah perusahaan teknologi multinasional Amerika Serikat yang memproduksi Windows, Microsoft Office, perangkat keras, dan layanan cloud.',
  apple: 'Apple Inc. adalah perusahaan teknologi yang merancang dan menjual perangkat elektronik, perangkat lunak, dan layanan digital.',
  android: 'Android adalah sistem operasi berbasis kernel Linux yang dirancang terutama untuk perangkat seluler.',
  roblox: 'Roblox adalah platform permainan daring dan sistem pembuatan permainan.',
  github: 'GitHub adalah platform untuk menyimpan, mengelola, dan melacak perubahan kode menggunakan Git.',
  gitlab: 'GitLab adalah platform berbasis Git untuk pengelolaan siklus hidup DevOps.',
  minecraft: 'Minecraft adalah permainan sandbox 3D tempat pemain mengeksplorasi dunia dan mengumpulkan sumber daya.'
};

function appendResult(title, url, desc) {
  const container = document.getElementById('results-container');
  const div = document.createElement('article');
  div.className = 'result-item';
  const domain = safeHost(url);
  div.innerHTML =
    '<div class="result-url"><b>' + escapeHTML(domain) + '</b> › ' +
    escapeHTML(String(url).replace(/^https?:\/\//, '').slice(0, 45)) + '...</div>' +
    '<a class="result-title">' + escapeHTML(title || 'Tanpa Judul') + '</a>' +
    '<div class="result-desc">' + escapeHTML(desc) + '</div>';
  div.querySelector('.result-title').addEventListener('click', () => openTab(url));
  container.appendChild(div);
}

async function performSearch(query, category) {
  const box = document.getElementById('results-container');
  const images = document.getElementById('images-container');

  if (category === 'image') {
    box.style.display = 'none';
    images.style.display = 'grid';
    images.innerHTML = '<div class="loading" style="grid-column:1/-1">Pencarian gambar saat ini belum aktif.</div>';
    return;
  }

  box.style.display = 'block';
  images.style.display = 'none';
  box.innerHTML = '<div class="loading">Mencari via Exa AI Search API...</div>';

  try {
    const res = await fetch('/api/search?q=' + encodeURIComponent(query) + '&type=web');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'API error');
    const results = (data.web && data.web.results) || [];
    box.innerHTML = '';
    if (!results.length) {
      box.innerHTML = '<p>Tidak menemukan dokumen untuk <b>' + escapeHTML(query) + '</b>.</p>';
      return;
    }
    results.forEach((item) => appendResult(item.title, item.url, item.description || 'Tidak ada deskripsi.'));
  } catch {
    box.innerHTML = '<p style="color:#f28b82">Gagal terhubung ke backend Exa search API.</p>';
  }
}

(function setupResults() {
  const input = document.getElementById('resultInput');
  if (!input) return;

  let query = new URLSearchParams(location.search).get('q') || '';
  let category = 'web';
  input.value = query;

  const ai = document.getElementById('rainAIBox');
  const aiText = document.getElementById('rainAIText');

  const showAI = () => {
    const key = query.toLowerCase().trim();
    if (category === 'web' && rainAIKnowledge[key]) {
      aiText.textContent = rainAIKnowledge[key];
      ai.hidden = false;
    } else {
      ai.hidden = true;
    }
  };

  const run = () => {
    query = input.value.trim();
    if (!query) return;
    history.replaceState(null, '', 'result.html?q=' + encodeURIComponent(query));
    showAI();
    performSearch(query, category);
  };

  document.getElementById('resultForm').addEventListener('submit', (e) => {
    e.preventDefault();
    search(input.value);
  });
  document.getElementById('homeButton').addEventListener('click', goHome);

  document.querySelectorAll('.search-tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      category = btn.dataset.category;
      document.querySelectorAll('.search-tab').forEach((x) => x.classList.toggle('active', x === btn));
      run();
    });
  });

  showAI();
  if (query) performSearch(query, category);

  let timer;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(run, 600);
  });
})();

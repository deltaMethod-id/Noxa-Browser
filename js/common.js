/* common.js — util bersama untuk semua halaman Noxa Browser */

const TAB_KEY = 'noxa-browser-tabs-v1';

function isURL(str) {
  const v = String(str).trim();
  return /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}(\/.*)?$/i.test(v) && !v.includes(' ');
}

function normalizeURL(value) {
  const v = String(value).trim();
  return v.startsWith('http://') || v.startsWith('https://') ? v : 'https://' + v;
}

function escapeHTML(v) {
  return String(v).replace(/[&<>'"]/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[c]));
}

function goHome() {
  location.href = 'index.html';
}

function goTabs() {
  location.href = 'tab.html';
}

/* --- penyimpanan tab (dipakai lintas halaman) --- */
function newId() {
  return (crypto.randomUUID && crypto.randomUUID()) || 'tab-' + Date.now() + Math.random().toString(16).slice(2);
}

function loadTabs() {
  try {
    const tabs = JSON.parse(localStorage.getItem(TAB_KEY));
    return Array.isArray(tabs) ? tabs : [];
  } catch {
    return [];
  }
}

function saveTabs(tabs) {
  localStorage.setItem(TAB_KEY, JSON.stringify(tabs));
}

/* Membuka URL di halaman tab: dibuat sebagai tab baru agar tab lama tetap ada */
function openTab(url) {
  const tabs = loadTabs();
  const tab = { id: newId(), title: safeHost(url), url };
  tabs.push(tab);
  saveTabs(tabs);
  location.href = 'tab.html?tab=' + encodeURIComponent(tab.id);
}

function safeHost(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url || 'Tab Baru';
  }
}

function search(query) {
  const q = String(query || '').trim();
  if (!q) return;
  if (isURL(q)) {
    openTab(normalizeURL(q));
    return;
  }
  location.href = 'result.html?q=' + encodeURIComponent(q);
}

/* Tombol "Tab" di header halaman mana pun */
function setupTabShortcut() {
  document.querySelectorAll('[data-action="open-tabs"]').forEach((btn) => {
    btn.addEventListener('click', goTabs);
  });
}

setupTabShortcut();

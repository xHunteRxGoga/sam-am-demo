const STATE_KEY = "samam-state-v2";
const CART_KEY = "samam-cart-v2";
const ADMIN_KEY = "samam-admin-key";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isState(value) {
  return Boolean(value && value.settings && Array.isArray(value.categories));
}

async function loadState() {
  const fallback = buildDefaultState();
  let remote = null;
  try {
    const response = await Promise.race([
      fetch("data/menu.json", { cache: "no-store" }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 2000))
    ]);
    if (response && response.ok) remote = await response.json();
  } catch (error) {
    remote = null;
  }
  let local = null;
  try {
    local = JSON.parse(localStorage.getItem(STATE_KEY) || "null");
  } catch (error) {
    local = null;
  }
  const candidates = [fallback, remote, local].filter(isState);
  candidates.sort((a, b) => (a.savedAt || 0) - (b.savedAt || 0));
  return candidates[candidates.length - 1];
}

function saveLocal(state) {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

async function serverUp() {
  try {
    const response = await fetch("/api/health", { cache: "no-store" });
    return response.ok;
  } catch (error) {
    return false;
  }
}

function authHeaders() {
  const token = sessionStorage.getItem("samam-token") || "";
  return token ? { Authorization: "Bearer " + token } : {};
}

async function saveState(state) {
  state.savedAt = Date.now();
  saveLocal(state);
  const online = await serverUp();
  if (!online) return { ok: true, mode: "local" };
  const response = await fetch("/api/menu", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders()
    },
    body: JSON.stringify(state)
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    return { ok: false, mode: "server", error: payload.error || "Сервер не сохранил меню" };
  }
  return { ok: true, mode: "server" };
}

function loadCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || "{}");
    return cart && typeof cart === "object" ? cart : {};
  } catch (error) {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function findItem(state, id) {
  for (const category of state.categories) {
    const item = (category.items || []).find((entry) => entry.id === id);
    if (item) return { category, item };
  }
  return null;
}

function money(value) {
  if (value === null || value === undefined || value === "") return "уточняется";
  return new Intl.NumberFormat("ru-RU").format(Number(value)) + " ₽";
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

function safeSrc(src) {
  const value = String(src || "");
  if (value.startsWith("images/") || value.startsWith("data:image/") || value.startsWith("https://")) return value;
  return "images/hero.jpg";
}

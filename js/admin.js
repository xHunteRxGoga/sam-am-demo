let state = buildDefaultState();
let view = "home";
let categoryId = "shashlik";
let query = "";
let editorId = null;
let editorNew = false;
let pendingPhoto = null;
let online = false;
let cleanJson = "";
let bound = false;

const $ = (id) => document.getElementById(id);

function toast(text) {
  const node = $("toast");
  node.textContent = text;
  node.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { node.hidden = true; }, 2600);
}

function slug(text) {
  return String(text || "item").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 24) || "item";
}

function itemsOf(category) {
  return category.items || [];
}

function allItems() {
  return state.categories.flatMap((category) => itemsOf(category).map((item) => ({ category, item })));
}

function visibleCount() {
  return allItems().filter((entry) => !entry.item.hidden).length;
}

function markDirty() {
  $("save").classList.add("is-dirty");
  $("save-note").hidden = false;
}

function markClean() {
  cleanJson = JSON.stringify(state);
  $("save").classList.remove("is-dirty");
  $("save-note").hidden = true;
}

function parsePrice(raw) {
  const text = String(raw ?? "").trim();
  if (!text) return null;
  const price = Number(text.replace(",", "."));
  return Number.isNaN(price) ? null : price;
}

function readSettings() {
  const form = $("settings-form");
  if (!form) return;
  const phones = state.settings.phones;
  phones[0].label = $("phone1").value.trim();
  phones[0].tel = $("tel1").value.trim();
  phones[1].label = $("phone2").value.trim();
  phones[1].tel = $("tel2").value.trim();
  ["address", "mapUrl", "maxUrl", "hours", "legal"].forEach((key) => {
    state.settings[key] = $(key).value.trim();
  });
  state.settings.socials = [...form.querySelectorAll(".social-row")].map((row) => ({
    name: row.querySelector("[data-social-name]").value.trim() || "Ссылка",
    url: row.querySelector("[data-social-url]").value.trim()
  })).filter((item) => item.url);
}

function readLead() {
  const lead = $("lead");
  if (!lead) return;
  const category = state.categories.find((entry) => entry.id === lead.dataset.category);
  if (category) category.lead = lead.value.trim();
}

function readEditorFields() {
  return {
    name: $("editor-name").value.trim(),
    price: parsePrice($("editor-price").value),
    weight: $("editor-weight").value.trim(),
    description: $("editor-description").value.trim(),
    composition: $("editor-composition").value.trim(),
    hidden: $("editor-hidden").checked,
    categoryId: $("editor-cat").value
  };
}

function applyEditorToState() {
  if ($("editor").hidden || editorNew || !editorId) return;
  const found = findItem(state, editorId);
  if (!found) return;
  const data = readEditorFields();
  Object.assign(found.item, {
    name: data.name || found.item.name,
    price: data.price,
    weight: data.weight,
    description: data.description,
    composition: data.composition,
    hidden: data.hidden
  });
  if (pendingPhoto) found.item.image = pendingPhoto;
  if (data.categoryId && data.categoryId !== found.category.id) {
    found.category.items = found.category.items.filter((item) => item.id !== found.item.id);
    state.categories.find((category) => category.id === data.categoryId).items.push(found.item);
    categoryId = data.categoryId;
  }
  pendingPhoto = null;
}

function createFromEditor() {
  const data = readEditorFields();
  if (!data.name) return false;
  const item = {
    id: `${slug(data.name)}-${Date.now().toString(36)}`,
    name: data.name,
    description: data.description,
    composition: data.composition,
    weight: data.weight,
    price: data.price,
    hidden: data.hidden,
    image: pendingPhoto || "images/hero.jpg"
  };
  const target = state.categories.find((category) => category.id === data.categoryId) || state.categories[0];
  target.items.push(item);
  editorNew = false;
  editorId = item.id;
  categoryId = target.id;
  pendingPhoto = null;
  return true;
}

function syncFromDom() {
  readSettings();
  readLead();
  if ($("editor").hidden) return;
  if (editorNew) createFromEditor();
  else applyEditorToState();
}

function setView(next) {
  syncFromDom();
  view = next;
  render();
}

function renderCats() {
  $("side-cats").innerHTML = state.categories.map((category) => `
    <button class="cat-btn${category.id === categoryId && view === "menu" ? " is-active" : ""}" type="button" data-cat="${esc(category.id)}">
      ${esc(category.title)}<small>${itemsOf(category).length}</small>
    </button>`).join("");
}

function renderNav() {
  document.querySelectorAll(".nav-btn").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === view);
  });
  const titles = { home: ["Панель", "Обзор"], menu: ["Меню", "Блюда"], contacts: ["Сайт", "Контакты"], files: ["Меню", "Excel"] };
  $("crumb").textContent = titles[view][0];
  $("title").textContent = titles[view][1];
  if (view === "menu") {
    const category = state.categories.find((entry) => entry.id === categoryId);
    if (category && !query) $("title").textContent = category.title;
  }
}

function stat(label, value, note) {
  return `<article class="stat"><span>${esc(label)}</span><b>${esc(value)}</b><em>${esc(note)}</em></article>`;
}

function renderHome() {
  const hidden = allItems().filter((entry) => entry.item.hidden);
  const unpriced = allItems().filter((entry) => entry.item.price == null);
  const seen = new Set();
  const attention = [...unpriced, ...hidden].filter((entry) => {
    if (seen.has(entry.item.id)) return false;
    seen.add(entry.item.id);
    return true;
  }).slice(0, 6);
  return `<div class="home-grid"><section class="panel"><h2>Категории</h2><div class="cat-grid">${
      state.categories.map((category) => `<button class="cat-card" type="button" data-cat="${esc(category.id)}"><b>${esc(category.title)}</b><span>${itemsOf(category).length}</span></button>`).join("")
    }</div></section><section class="panel"><h2>Стоит проверить</h2>${
      attention.length ? attention.map((entry) => `<button class="attn" type="button" data-open="${esc(entry.item.id)}"><b>${esc(entry.item.name)}</b><span>${esc(entry.category.title)} · ${entry.item.hidden ? "скрыто" : money(entry.item.price)}</span></button>`).join("") : `<p class="empty">Все позиции с ценой и открыты для заказа.</p>`
    }</section></div>`;
}

function dishRow(category, item) {
  return `<div class="dish-wrap"><button class="dish" type="button" data-open="${esc(item.id)}">
      <img src="${esc(safeSrc(item.image))}" alt="">
      <span><h3>${esc(item.name)}</h3><span class="muted">${esc(item.weight || "вес не указан")}${item.hidden ? " · скрыто" : ""}</span></span>
      <span class="price">${esc(money(item.price))}</span>
    </button><button class="hide-btn${item.hidden ? " is-off" : ""}" type="button" data-hide="${esc(item.id)}">${item.hidden ? "Показать" : "Скрыть"}</button></div>`;
}

function renderMenu() {
  const q = query.trim().toLowerCase();
  if (q) {
    const found = allItems().filter((entry) => `${entry.item.name} ${entry.item.composition || ""}`.toLowerCase().includes(q));
    return `<div class="menu-head"><div><h2>Поиск</h2><p class="muted">Найдено: ${found.length}</p></div></div>
      <div class="dish-list">${found.map((entry) => dishRow(entry.category, entry.item)).join("") || `<p class="empty">Такого блюда нет. Проверьте название или добавьте позицию.</p>`}</div>`;
  }
  const category = state.categories.find((entry) => entry.id === categoryId) || state.categories[0];
  categoryId = category.id;
  const chips = state.categories.map((entry) => `<button class="cat-btn${entry.id === category.id ? " is-active" : ""}" type="button" data-cat="${esc(entry.id)}">${esc(entry.title)}</button>`).join("");
  return `<div class="menu-cats">${chips}</div><div class="menu-head"><div>
      <label class="field"><span>Текст под заголовком на сайте</span><textarea id="lead" data-category="${esc(category.id)}" rows="2">${esc(category.lead || "")}</textarea></label>
    </div><button class="btn" id="add-item" type="button">Новая позиция</button></div>
    <div class="dish-list">${itemsOf(category).map((item) => dishRow(category, item)).join("") || `<p class="empty">В этой категории пока пусто. Добавьте первую позицию.</p>`}</div>`;
}

function renderContacts() {
  const settings = state.settings;
  const socials = settings.socials || [];
  return `<form class="contacts" id="settings-form">
    <section class="panel"><h2>Телефоны</h2>
      <div class="split">
        <label class="field"><span>Первый номер на сайте</span><input id="phone1" value="${esc(settings.phones[0].label)}"></label>
        <label class="field"><span>Для звонка</span><input id="tel1" value="${esc(settings.phones[0].tel)}" placeholder="+79326011331"></label>
        <label class="field"><span>Второй номер на сайте</span><input id="phone2" value="${esc(settings.phones[1].label)}"></label>
        <label class="field"><span>Для звонка</span><input id="tel2" value="${esc(settings.phones[1].tel)}" placeholder="+73433613931"></label>
      </div>
    </section>
    <section class="panel"><h2>Адрес и мессенджеры</h2>
      <label class="field"><span>Адрес</span><input id="address" value="${esc(settings.address)}"></label>
      <label class="field"><span>Ссылка на карту</span><input id="mapUrl" value="${esc(settings.mapUrl)}"></label>
      <label class="field"><span>Ссылка на MAX</span><input id="maxUrl" value="${esc(settings.maxUrl)}" placeholder="https://max.ru/..."></label>
      <label class="field"><span>Режим работы</span><input id="hours" value="${esc(settings.hours)}" placeholder="Ежедневно 11:00–23:00"></label>
      <label class="field"><span>Юридическая строка в подвале</span><input id="legal" value="${esc(settings.legal || "")}"></label>
      <h2>Соцсети</h2>
      <div id="socials">${socials.map((item) => `<div class="social-row"><input data-social-name value="${esc(item.name)}" placeholder="ВК"><input data-social-url value="${esc(item.url)}" placeholder="https://"><button class="hide-btn" type="button" data-social-remove>Убрать</button></div>`).join("")}</div>
      <button class="btn line" id="add-social" type="button">Добавить ссылку</button>
    </section>
  </form>`;
}

function renderFiles() {
  return `<div class="files">
    <article><h2>Скачать меню</h2><p>Таблица Excel: категория, название, состав, вес и цена. Её можно править и загрузить обратно.</p><button class="btn line" id="export" type="button">Скачать Excel</button></article>
    <article><h2>Загрузить меню</h2><p>Обновляет блюда из таблицы и добавляет новые строки. На сайте изменения появятся после «Сохранить».</p><button class="btn line" id="import-btn" type="button">Загрузить Excel</button></article>
  </div>`;
}

function render() {
  const pages = { menu: renderMenu, contacts: renderContacts, files: renderFiles };
  if (view === "home") {
    const hidden = allItems().filter((entry) => entry.item.hidden).length;
    const unpriced = allItems().filter((entry) => entry.item.price == null).length;
    $("view").innerHTML = `<div class="stats">${stat("Позиции", allItems().length, "всего в меню")}${stat("На сайте", visibleCount(), "видят гости")}${stat("Скрыто", hidden, "не показываются")}${stat("Без цены", unpriced, "кнопка «Узнать цену»")}</div>${renderHome()}`;
  } else $("view").innerHTML = pages[view]();
  renderCats();
  renderNav();
  $("view").querySelectorAll("img").forEach((img) => { img.addEventListener("error", () => { img.src = "images/hero.jpg"; }); });
}

function fillEditor() {
  $("editor-cat").innerHTML = state.categories.map((category) => `<option value="${esc(category.id)}">${esc(category.title)}</option>`).join("");
  if (editorNew) {
    $("editor-title").textContent = "Новая позиция";
    $("editor-name").value = "";
    $("editor-price").value = "";
    $("editor-weight").value = "";
    $("editor-description").value = "";
    $("editor-composition").value = "";
    $("editor-hidden").checked = false;
    $("editor-cat").value = categoryId;
    $("editor-photo").src = "images/hero.jpg";
    $("editor-delete").hidden = true;
    return;
  }
  const found = findItem(state, editorId);
  if (!found) return;
  const item = found.item;
  $("editor-title").textContent = "Блюдо";
  $("editor-name").value = item.name || "";
  $("editor-price").value = item.price ?? "";
  $("editor-weight").value = item.weight || "";
  $("editor-description").value = item.description || "";
  $("editor-composition").value = item.composition || "";
  $("editor-hidden").checked = Boolean(item.hidden);
  $("editor-cat").value = found.category.id;
  $("editor-photo").src = safeSrc(item.image);
  $("editor-delete").hidden = false;
}

function openEditor(id) {
  if (!$("editor").hidden) applyEditorToState();
  editorNew = false;
  editorId = id;
  pendingPhoto = null;
  fillEditor();
  $("editor").hidden = false;
  $("editor-back").hidden = false;
  $("editor-name").focus();
}

function openNew() {
  if (!$("editor").hidden && !editorNew) applyEditorToState();
  editorNew = true;
  editorId = null;
  pendingPhoto = null;
  fillEditor();
  $("editor").hidden = false;
  $("editor-back").hidden = false;
  $("editor-name").focus();
}

function closeEditor() {
  editorNew = false;
  editorId = null;
  pendingPhoto = null;
  $("editor").hidden = true;
  $("editor-back").hidden = true;
}

function finishEditor(event) {
  if (event) event.preventDefault();
  if (editorNew) {
    if (!createFromEditor()) { toast("Введите название"); return; }
    toast("Позиция добавлена в список");
  } else {
    applyEditorToState();
  }
  closeEditor();
  markDirty();
  render();
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function storePhoto(file, id) {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const data = await fileToBase64(file);
  if (online) {
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ id: id || "photo", ext, data })
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Не удалось загрузить фото");
    return payload.url;
  }
  if (file.size > 700000) throw new Error("Фото больше 700 КБ. Запустите start.bat, чтобы загрузить его на диск.");
  return `data:${file.type};base64,${data}`;
}

function exportExcel() {
  syncFromDom();
  if (!window.XLSX) { toast("Excel сейчас недоступен. Проверьте интернет и обновите страницу."); return; }
  const rows = state.categories.flatMap((category) => itemsOf(category).map((item) => ({
    ID: item.id,
    Категория: category.title,
    Название: item.name,
    Описание: item.description || "",
    Состав: item.composition || "",
    Вес: item.weight || "",
    Цена: item.price ?? "",
    Скрыто: item.hidden ? "да" : "нет",
    Фото: item.image || ""
  })));
  const sheet = XLSX.utils.json_to_sheet(rows);
  sheet["!cols"] = [18, 24, 36, 42, 42, 14, 10, 10, 28].map((wch) => ({ wch }));
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Меню");
  XLSX.writeFile(book, "menu-samam.xlsx");
}

function importExcel(file) {
  if (!window.XLSX) { toast("Excel сейчас недоступен. Проверьте интернет и обновите страницу."); return; }
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const book = XLSX.read(reader.result, { type: "array" });
      const rows = XLSX.utils.sheet_to_json(book.Sheets[book.SheetNames[0]], { defval: "" });
      let updated = 0;
      let added = 0;
      rows.forEach((row) => {
        const name = String(row["Название"] || "").trim();
        if (!name) return;
        const title = String(row["Категория"] || "").trim().toLowerCase();
        const category = state.categories.find((entry) => entry.title.trim().toLowerCase() === title) || state.categories[0];
        const id = String(row.ID || "").trim();
        const found = id ? findItem(state, id) : null;
        const fields = {
          name,
          description: String(row["Описание"] || "").trim(),
          composition: String(row["Состав"] || "").trim(),
          weight: String(row["Вес"] || "").trim(),
          price: parsePrice(row["Цена"]),
          hidden: ["да", "yes", "1", "true"].includes(String(row["Скрыто"] || "").trim().toLowerCase())
        };
        const photo = String(row["Фото"] || "").trim();
        if (photo) fields.image = photo;
        if (found) {
          Object.assign(found.item, fields);
          if (found.category.id !== category.id) {
            found.category.items = found.category.items.filter((item) => item.id !== found.item.id);
            category.items.push(found.item);
          }
          updated += 1;
        } else {
          category.items.push({
            id: id || `${slug(name)}-${Date.now().toString(36)}-${added}`,
            image: photo || "images/hero.jpg",
            ...fields
          });
          added += 1;
        }
      });
      closeEditor();
      markDirty();
      render();
      toast(updated || added ? `Excel прочитан: обновлено ${updated}, добавлено ${added}. Нажмите «Сохранить».` : "В таблице нет блюд");
    } catch (error) {
      toast("Файл Excel не читается");
    }
  };
  reader.readAsArrayBuffer(file);
}

function bind() {
  document.addEventListener("click", (event) => {
    const nav = event.target.closest("[data-view]");
    if (nav) { setView(nav.dataset.view); return; }
    const cat = event.target.closest("[data-cat]");
    if (cat) {
      syncFromDom();
      categoryId = cat.dataset.cat;
      query = "";
      $("search").value = "";
      view = "menu";
      render();
      return;
    }
    const open = event.target.closest("[data-open]");
    if (open && !event.target.closest("[data-hide]")) { openEditor(open.dataset.open); return; }
    const hide = event.target.closest("[data-hide]");
    if (hide) {
      const found = findItem(state, hide.dataset.hide);
      if (found) { found.item.hidden = !found.item.hidden; markDirty(); render(); }
      return;
    }
    if (event.target.closest("#add-item")) { openNew(); return; }
    if (event.target.closest("#add-social")) {
      $("socials").insertAdjacentHTML("beforeend", `<div class="social-row"><input data-social-name placeholder="ВК"><input data-social-url placeholder="https://"><button class="hide-btn" type="button" data-social-remove>Убрать</button></div>`);
      markDirty();
      return;
    }
    if (event.target.closest("[data-social-remove]")) {
      event.target.closest(".social-row").remove();
      markDirty();
    }
  });
  $("search").addEventListener("input", () => {
    syncFromDom();
    query = $("search").value;
    if (view !== "menu") view = "menu";
    render();
  });
  $("editor-form").addEventListener("submit", finishEditor);
  $("editor-close").addEventListener("click", closeEditor);
  $("editor-back").addEventListener("click", closeEditor);
  $("editor-delete").addEventListener("click", () => {
    const found = findItem(state, editorId);
    if (!found || !confirm(`Убрать «${found.item.name}» из меню?`)) return;
    found.category.items = found.category.items.filter((item) => item.id !== found.item.id);
    closeEditor();
    markDirty();
    render();
    toast("Позиция убрана из списка");
  });
  $("photo-pick").addEventListener("click", () => $("editor-file").click());
  $("editor-file").addEventListener("change", async () => {
    const file = $("editor-file").files[0];
    if (!file) return;
    try {
      pendingPhoto = await storePhoto(file, editorId || "new");
      $("editor-photo").src = pendingPhoto;
      markDirty();
    } catch (error) {
      toast(error.message || "Не удалось загрузить фото");
    }
  });
  $("view").addEventListener("input", markDirty);
  $("editor-form").addEventListener("input", markDirty);
  $("save").addEventListener("click", async () => {
    try {
      syncFromDom();
      const result = await saveState(state);
      if (!result.ok) { toast(result.error); return; }
      markClean();
      toast(result.mode === "server" ? "Меню сохранено. Гости уже видят правки." : "Сохранено в этом браузере");
      render();
    } catch (error) {
      toast(error.message || "Не удалось сохранить");
    }
  });
  document.addEventListener("click", (event) => {
    if (event.target.closest("#export")) exportExcel();
    if (event.target.closest("#import-btn")) $("import").click();
  });
  $("import").addEventListener("change", () => {
    const file = $("import").files[0];
    if (file) importExcel(file);
    $("import").value = "";
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !$("editor").hidden) closeEditor();
  });
}

function showGate(message) {
  $("dash").hidden = true;
  $("gate").hidden = false;
  $("login-error").hidden = !message;
  if (message) $("login-error").textContent = message;
}

async function openApp() {
  $("gate").hidden = true;
  $("dash").hidden = false;
  state = await loadState();
  if (!state.settings.phones || state.settings.phones.length < 2) state.settings.phones = buildDefaultState().settings.phones;
  categoryId = state.categories[0]?.id || "shashlik";
  online = await serverUp();
  $("mode").textContent = online ? "Правки после сохранения видны всем гостям." : "Сервер выключен. Сохранение останется только в этом браузере. Запустите start.bat.";
  $("mode").classList.toggle("is-off", !online);
  $("mode-copy").textContent = online ? "Сохраняется на сайт" : "Сохраняется только в этом браузере";
  $("mode-copy").classList.toggle("is-off", !online);
  cleanJson = JSON.stringify(state);
  if (!bound) { bind(); bound = true; }
  render();
}

async function start() {
  $("login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    $("login-error").hidden = true;
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: $("login-phone").value, password: $("login-password").value })
      });
      const payload = await response.json();
      if (!response.ok) {
        showGate(payload.error || "Неверный номер или пароль");
        return;
      }
      sessionStorage.setItem("samam-token", payload.token);
      await openApp();
    } catch (error) {
      showGate("Сервер панели не запущен. Откройте сайт через start.bat.");
    }
  });
  $("logout").addEventListener("click", () => {
    sessionStorage.removeItem("samam-token");
    showGate();
  });
  const token = sessionStorage.getItem("samam-token");
  if (!token) { showGate(); return; }
  try {
    const response = await fetch("/api/me", { headers: authHeaders() });
    if (!response.ok) { showGate(); return; }
  } catch (error) {
    showGate("Сервер панели не запущен. Откройте сайт через start.bat.");
    return;
  }
  await openApp();
}

start();

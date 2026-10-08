const NAV = [
  { id: "shashlik", title: "Шашлыки", children: [
    { id: "group-shashlik-lamb", title: "Баранина" },
    { id: "group-shashlik-beef", title: "Говядина" },
    { id: "group-shashlik-pork", title: "Свинина" },
    { id: "group-shashlik-chicken", title: "Курица" }
  ]},
  { id: "lyulya", title: "Люля-кебаб" },
  { id: "shawarma", title: "Шаурма" },
  { id: "grill", title: "На гриле" },
  { id: "boxes", title: "Боксы" },
  { id: "hot", title: "Горячее" },
  { id: "sides", title: "Гарниры" },
  { id: "sauces", title: "Соусы" },
  { id: "salads", title: "Салаты" },
  { id: "cold", title: "Закуски" }
];

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let state = buildDefaultState();
let cart = {};
let toastTimer = 0;

const $ = (id) => document.getElementById(id);

function paintOverlay() {
  const any = $("drawer").classList.contains("is-open") || !$("cart").hidden || !$("sheet").hidden;
  const backdrop = $("backdrop");
  if (any) backdrop.hidden = false;
  requestAnimationFrame(() => backdrop.classList.toggle("is-open", any));
  if (!any) {
    const hide = () => { if (!backdrop.classList.contains("is-open")) backdrop.hidden = true; };
    backdrop.addEventListener("transitionend", hide, { once: true });
    setTimeout(hide, 480);
  }
  document.body.classList.toggle("lock", any);
}

function toast(text) {
  const node = $("toast");
  node.textContent = text;
  node.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { node.hidden = true; }, 2400);
}

function scrollToId(id) {
  const node = document.getElementById(id);
  if (!node) return;
  const top = node.getBoundingClientRect().top + window.scrollY - ($("header").offsetHeight + ($("rail").offsetHeight || 0) + 8);
  window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
}

function visibleItems(category) {
  return (category.items || []).filter((item) => !item.hidden);
}

function groupsOf(items) {
  const groups = [];
  items.forEach((item) => {
    const id = item.group || "";
    const last = groups[groups.length - 1];
    if (!last || last.id !== id) groups.push({ id, title: item.groupTitle || "", items: [item] });
    else last.items.push(item);
  });
  return groups;
}

function priced(item) {
  return typeof item.price === "number" && !Number.isNaN(item.price);
}

function actionHtml(item) {
  const qty = cart[item.id] || 0;
  if (!priced(item)) {
    return `<button class="btn line" type="button" data-call>Узнать цену</button>`;
  }
  if (!qty) return `<button class="btn" type="button" data-add="${esc(item.id)}">+ Добавить</button>`;
  return `<div class="stepper"><button type="button" data-dec="${esc(item.id)}" aria-label="Меньше">−</button><span>${qty}</span><button type="button" data-inc="${esc(item.id)}" aria-label="Больше">+</button></div>`;
}

function cardHtml(item) {
  return `<article class="card" id="item-${esc(item.id)}" data-open="${esc(item.id)}">
    <div class="card-photo"><img src="${esc(safeSrc(item.image))}" alt="${esc(item.name)}"></div>
    <div class="card-body">
      <h3>${esc(item.name)}</h3>
      <p class="desc">${esc(item.description || "")}</p>
      <p class="comp"><span>Состав: </span>${esc(item.composition || "")}</p>
      <div class="meta"><span>${esc(item.weight || "")}</span><b>${esc(money(item.price))}</b></div>
      <div class="card-action">${actionHtml(item)}</div>
    </div>
  </article>`;
}

function renderCatalog() {
  $("catalog").innerHTML = state.categories.map((category) => {
    const items = visibleItems(category);
    const groups = groupsOf(items);
    const body = items.length
      ? groups.map((group) => {
          const title = group.title ? `<h3 class="group-title" id="group-${esc(category.id)}-${esc(group.id)}">${esc(group.title)}</h3>` : "";
          return `${title}<div class="grid${category.highlight ? " boxes" : ""}">${group.items.map(cardHtml).join("")}</div>`;
        }).join("")
      : `<p class="note">Позиции этого раздела появятся здесь, когда их добавят в меню.</p>`;
    return `<section class="section${category.highlight ? " highlight" : ""}" id="${esc(category.id)}">
      <div class="wrap">
        <header class="section-head">
          ${category.script ? `<p class="script">${esc(category.script)}</p>` : ""}
          <h2>${esc(category.title)}</h2>
          ${category.lead ? `<p class="lead">${esc(category.lead)}</p>` : ""}
        </header>
        ${body}
      </div>
    </section>`;
  }).join("");
  $("catalog").querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => { img.src = "images/hero.jpg"; });
  });
}

function renderRail() {
  $("rail-inner").innerHTML = NAV.map((entry) => `<button type="button" data-jump="${esc(entry.id)}">${esc(entry.title)}</button>`).join("");
}

function renderDrawer() {
  const settings = state.settings;
  $("drawer-body").innerHTML = NAV.map((entry) => {
    const children = (entry.children || []).map((child) => `<button class="sub-link" type="button" data-jump="${esc(child.id)}">${esc(child.title)}</button>`).join("");
    return `<button class="nav-link" type="button" data-jump="${esc(entry.id)}">${esc(entry.title)}</button>${children}`;
  }).join("") + `<div class="drawer-foot"><p class="script">Готовим с душой</p><p>${esc(settings.address)}</p></div>`;
}

function renderPhones() {
  const phones = state.settings.phones || [];
  $("phones").innerHTML = phones.map((phone, index) => `<a class="${index ? "phone-landline" : ""}" href="tel:${esc(phone.tel)}">${esc(phone.label)}</a>`).join("");
  $("footer-phones").innerHTML = phones.map((phone) => `<p><a href="tel:${esc(phone.tel)}">${esc(phone.label)}</a></p>`).join("");
  $("phone-list").innerHTML = phones.map((phone) => `<a class="btn line" href="tel:${esc(phone.tel)}">${esc(phone.label)}</a>`).join("");
  $("footer-address").textContent = state.settings.address;
  $("footer-hours").textContent = state.settings.hours || "Режим работы уточняется";
  $("map-link").href = state.settings.mapUrl;
  if ($("map-card")) $("map-card").href = state.settings.mapUrl;
  const socials = state.settings.socials || [];
  $("socials").innerHTML = socials.filter((item) => item.url).map((item) => `<a href="${esc(item.url)}" target="_blank" rel="noopener">${esc(item.name)}</a>`).join(" · ");
  $("legal").textContent = state.settings.legal || "";
  const max = state.settings.maxUrl;
  document.querySelectorAll("[data-max]").forEach((node) => { node.hidden = !max; });
  if ($("footer-max") && max) $("footer-max").href = max;
}

function cartCount() {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function cartTotal() {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const found = findItem(state, id);
    if (!found || !priced(found.item)) return sum;
    return sum + found.item.price * qty;
  }, 0);
}

function renderCart() {
  const entries = Object.entries(cart).filter(([, qty]) => qty > 0);
  $("cart-count").textContent = String(cartCount());
  $("cart-body").innerHTML = entries.length ? entries.map(([id, qty]) => {
    const found = findItem(state, id);
    if (!found) return "";
    const item = found.item;
    return `<div class="cart-item">
      <img src="${esc(safeSrc(item.image))}" alt="">
      <div>
        <h3>${esc(item.name)}</h3>
        <p class="muted">${esc(item.weight || "")}</p>
        <div class="cart-row">
          <div class="stepper"><button type="button" data-dec="${esc(id)}" aria-label="Меньше">−</button><span>${qty}</span><button type="button" data-inc="${esc(id)}" aria-label="Больше">+</button></div>
          <b>${esc(money(priced(item) ? item.price * qty : null))}</b>
        </div>
        <button class="sub-link" type="button" data-remove="${esc(id)}">Удалить</button>
      </div>
    </div>`;
  }).join("") : `<p class="note">Корзина пуста. Выберите блюда в меню.</p>`;
  $("cart-total").textContent = money(cartTotal());
  $("cart-order").hidden = !entries.length;
  document.querySelectorAll(".card-action").forEach((slot) => {
    const card = slot.closest("[data-open]");
    if (!card) return;
    const found = findItem(state, card.dataset.open);
    if (found) slot.innerHTML = actionHtml(found.item);
  });
  const modal = document.getElementById("product-actions");
  if (modal && modal.dataset.id) {
    const found = findItem(state, modal.dataset.id);
    if (found) modal.innerHTML = actionHtml(found.item);
  }
}

function changeQty(id, delta) {
  const found = findItem(state, id);
  if (!found || !priced(found.item)) return;
  const next = Math.max(0, Math.min(99, (cart[id] || 0) + delta));
  if ((cart[id] || 0) === 0 && next > 0) toast("Добавили в корзину");
  if (next) cart[id] = next;
  else delete cart[id];
  saveCart(cart);
  renderCart();
}

function openDrawer(open) {
  const drawer = $("drawer");
  const panel = drawer.querySelector(".drawer-panel");
  $("nav-toggle").setAttribute("aria-expanded", open ? "true" : "false");
  if (open) {
    drawer.hidden = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        drawer.classList.add("is-open");
        paintOverlay();
      });
    });
    $("drawer-close").focus();
    return;
  }
  drawer.classList.remove("is-open");
  paintOverlay();
  const hide = (event) => {
    if (event && event.target !== panel) return;
    if (!drawer.classList.contains("is-open")) drawer.hidden = true;
  };
  panel.addEventListener("transitionend", hide, { once: true });
  setTimeout(() => hide(), 520);
}

function openCart(open) {
  $("cart").hidden = !open;
  if (open) {
    $("checkout").hidden = true;
    $("order-done").hidden = true;
    $("toast").hidden = true;
    renderCart();
  }
  paintOverlay();
}

function openSheet(open) {
  $("sheet").hidden = !open;
  paintOverlay();
}

function openProduct(id) {
  const found = findItem(state, id);
  if (!found) return;
  const item = found.item;
  $("product").innerHTML = `<img src="${esc(safeSrc(item.image))}" alt="${esc(item.name)}"><div>
    <p class="muted">${esc(found.category.title)}</p>
    <h3>${esc(item.name)}</h3>
    <p>${esc(item.description || "")}</p>
    <p><b>Состав.</b> ${esc(item.composition || "")}</p>
    <p class="muted">Порция: ${esc(item.weight || "—")}</p>
    <p class="price">${esc(money(item.price))}</p>
    <div id="product-actions" data-id="${esc(item.id)}">${actionHtml(item)}</div>
  </div>`;
  $("sheet-title").textContent = "О блюде";
  openSheet(true);
}

function orderLines() {
  return Object.entries(cart).filter(([, qty]) => qty > 0).map(([id, qty]) => {
    const found = findItem(state, id);
    if (!found) return null;
    const item = found.item;
    const cost = priced(item) ? money(item.price * qty) : "цена уточняется";
    return `${item.name} × ${qty} — ${cost}`;
  }).filter(Boolean);
}

function readForm() {
  const data = {};
  $("order-form").querySelectorAll("[name]").forEach((field) => { data[field.name] = field.value.trim(); });
  return data;
}

function orderText(withContacts) {
  const lines = [
    "Заказ САМ·АМ!",
    "Доставка по Екатеринбургу",
    ""
  ];
  if (withContacts) {
    const data = readForm();
    lines.push(
      `Имя: ${data.name || "—"}`,
      `Телефон: ${data.phone || "—"}`,
      `Адрес: ${data.street || "—"}, д. ${data.house || "—"}`,
      data.flat ? `Квартира / офис: ${data.flat}` : "",
      data.entrance ? `Подъезд: ${data.entrance}` : "",
      data.floor ? `Этаж: ${data.floor}` : "",
      `Время: ${data.time || "как можно скорее"}`,
      data.courier ? `Курьеру: ${data.courier}` : ""
    );
  }
  const comment = $("cart-comment").value.trim();
  if (comment) lines.push(`Комментарий: ${comment}`);
  lines.push("", ...orderLines(), "", `Итого: ${money(cartTotal())}`, "Стоимость доставки сообщит оператор.");
  return lines.filter((line) => line !== "").join("\n");
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    const area = document.createElement("textarea");
    area.value = text;
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

function openMax() {
  const url = state.settings.maxUrl;
  if (!url) return;
  window.open(url, "_blank", "noopener");
}

function closeAll() {
  if ($("drawer").classList.contains("is-open")) openDrawer(false);
  $("cart").hidden = true;
  $("sheet").hidden = true;
  $("phones-sheet").hidden = true;
  paintOverlay();
}

function spyRail() {
  const buttons = [...$("rail-inner").querySelectorAll("[data-jump]")];
  const marker = window.scrollY + $("header").offsetHeight + 80;
  let current = NAV[0].id;
  NAV.forEach((entry) => {
    const node = document.getElementById(entry.id);
    if (!node) return;
    const top = node.getBoundingClientRect().top + window.scrollY;
    if (top <= marker) current = entry.id;
  });
  buttons.forEach((button) => button.classList.toggle("is-active", button.dataset.jump === current));
}

function bind() {
  $("nav-toggle").addEventListener("click", () => openDrawer(!$("drawer").classList.contains("is-open")));
  $("drawer-close").addEventListener("click", () => openDrawer(false));
  $("cart-open").addEventListener("click", () => openCart(true));
  $("cart-close").addEventListener("click", () => openCart(false));
  $("sheet-close").addEventListener("click", () => openSheet(false));
  $("backdrop").addEventListener("click", closeAll);
  $("call-btn").addEventListener("click", () => { $("phones-sheet").hidden = false; });
  $("footer-call").addEventListener("click", () => { $("phones-sheet").hidden = false; });
  $("phones-close").addEventListener("click", () => { $("phones-sheet").hidden = true; });
  $("to-menu").addEventListener("click", () => scrollToId("catalog"));
  $("to-order").addEventListener("click", () => {
    if (cartCount()) openCart(true);
    else scrollToId("catalog");
  });
  document.addEventListener("click", (event) => {
    const jump = event.target.closest("[data-jump]");
    if (jump) {
      openDrawer(false);
      scrollToId(jump.dataset.jump);
      return;
    }
    const add = event.target.closest("[data-add]");
    if (add) { changeQty(add.dataset.add, 1); return; }
    const inc = event.target.closest("[data-inc]");
    if (inc) { changeQty(inc.dataset.inc, 1); return; }
    const dec = event.target.closest("[data-dec]");
    if (dec) { changeQty(dec.dataset.dec, -1); return; }
    const remove = event.target.closest("[data-remove]");
    if (remove) { changeQty(remove.dataset.remove, -99); return; }
    if (event.target.closest("[data-call]")) {
      $("phones-sheet").hidden = false;
      return;
    }
    const card = event.target.closest("[data-open]");
    if (card && !event.target.closest("button")) openProduct(card.dataset.open);
  });
  $("go-checkout").addEventListener("click", () => {
    $("checkout").hidden = false;
    $("order-done").hidden = true;
    $("checkout").scrollIntoView({ block: "nearest" });
  });
  $("call-order").addEventListener("click", async () => {
    await copyText(orderText(false));
    toast("Состав заказа скопирован — продиктуйте его по телефону");
    $("phones-sheet").hidden = false;
  });
  $("max-order").addEventListener("click", async () => {
    await copyText(orderText(false));
    toast("Текст заказа скопирован — вставьте его в чат MAX");
    openMax();
  });
  $("checkout").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = readForm();
    const digits = (data.phone || "").replace(/\D/g, "");
    if (digits.length < 10) { toast("Введите телефон, чтобы подтвердить доставку"); return; }
    const text = orderText(true);
    $("order-preview").textContent = text;
    $("checkout").hidden = true;
    $("order-done").hidden = false;
    const orders = JSON.parse(localStorage.getItem("samam-orders") || "[]");
    orders.unshift({ at: Date.now(), text });
    localStorage.setItem("samam-orders", JSON.stringify(orders.slice(0, 30)));
  });
  $("copy-order").addEventListener("click", async () => {
    await copyText($("order-preview").textContent);
    toast("Заказ скопирован");
  });
  $("max-done").addEventListener("click", async () => {
    await copyText($("order-preview").textContent);
    toast("Текст заказа скопирован — вставьте его в чат MAX");
    openMax();
  });
  $("call-done").addEventListener("click", () => { $("phones-sheet").hidden = false; });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAll();
  });
  window.addEventListener("scroll", () => {
    $("header").classList.toggle("is-solid", window.scrollY > 8);
    spyRail();
  }, { passive: true });
}

async function start() {
  state = await loadState();
  cart = loadCart();
  renderRail();
  renderDrawer();
  renderPhones();
  renderCatalog();
  renderCart();
  bind();
  spyRail();
}

start();

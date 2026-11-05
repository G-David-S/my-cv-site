// Plain ES2015 on purpose, so it also runs on old phones (iOS 12 / Android 5 era).
const root = document.documentElement;
const reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

function save(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }
function load(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }

// Light / dark switch. The choice is remembered on this device.
document.querySelector(".theme-toggle").addEventListener("click", () => {
  const isDark = root.dataset.theme
    ? root.dataset.theme === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = isDark ? "light" : "dark";
  save("theme", root.dataset.theme);
});

// Email links are put together here, so simple spam bots can't read the address.
// Not everyone has a mail app set up, so a small note also offers "Copy" and "Gmail".
let toastTimer = 0;
function showMailNote(address) {
  let note = document.querySelector(".mail-note");
  if (!note) {
    note = document.createElement("div");
    note.className = "mail-note";
    note.setAttribute("role", "status");
    document.body.appendChild(note);
  }
  const hu = lang === "hu";
  note.innerHTML = '<span class="mail-addr"></span><button type="button" class="mail-copy"></button>' +
    '<a class="mail-gmail" target="_blank" rel="noopener">Gmail</a><button type="button" class="mail-x" aria-label="' + (hu ? "Bezár" : "Close") + '">×</button>';
  note.querySelector(".mail-addr").textContent = address;
  const copy = note.querySelector(".mail-copy");
  copy.textContent = hu ? "Másol" : "Copy";
  note.querySelector(".mail-gmail").href = "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(address);
  copy.addEventListener("click", () => {
    const done = () => { copy.textContent = hu ? "Másolva ✓" : "Copied ✓"; };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(address).then(done, done);
    else {
      const t = document.createElement("textarea"); t.value = address; document.body.appendChild(t); t.select();
      try { document.execCommand("copy"); } catch (e) {} t.remove(); done();
    }
  });
  note.querySelector(".mail-x").addEventListener("click", () => note.classList.remove("show"));
  note.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => note.classList.remove("show"), 12000);
}
document.querySelectorAll(".js-email").forEach((link) => {
  const address = link.dataset.user + "@" + link.dataset.domain;
  link.href = "mailto:" + address;
  link.addEventListener("click", () => { showMailNote(address); });
});

// ---------- HU / EN ----------
// English lives in the HTML; Hungarian comes from i18n.js. Order of choice:
// ?lang= in the address (used for the PDFs), then the saved choice, then the browser language.
const english = {};
document.querySelectorAll("[data-i18n]").forEach((el) => { english[el.dataset.i18n] = el.innerHTML; });
document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
  el.dataset.i18nAttr.split(";").forEach((pair) => {
    const [attr, key] = pair.split(":");
    english[key] = el.getAttribute(attr);
  });
});
english.title = document.title;

let lang = "en";
function setLang(next) {
  lang = next;
  const hu = window.I18N_HU || {};
  const text = (key) => (lang === "hu" && hu[key] != null ? hu[key] : english[key]);
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.innerHTML = text(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
    el.dataset.i18nAttr.split(";").forEach((pair) => {
      const [attr, key] = pair.split(":");
      el.setAttribute(attr, text(key));
    });
  });
  document.title = text("title");
  root.lang = lang;
  document.querySelectorAll(".js-pdf").forEach((a) => {
    a.href = lang === "hu" ? "cv-gulyas-david-samuel-hu.pdf" : "cv-gulyas-david-samuel.pdf";
  });
  const toggle = document.querySelector(".lang-toggle");
  toggle.textContent = lang === "hu" ? "EN" : "HU";
  toggle.lang = lang === "hu" ? "en" : "hu";
  toggle.setAttribute("aria-label", lang === "hu" ? "English version" : "Magyar nyelvű változat");
  document.querySelectorAll(".count").forEach((el) => { el.textContent = formatNumber(+el.dataset.to); });
}
function formatNumber(n) {
  // 600,000 in English, 600 000 in Hungarian
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, lang === "hu" ? " " : ",");
}

const fromUrl = (location.search.match(/[?&]lang=(hu|en)/) || [])[1];
const browserHu = (navigator.language || "").toLowerCase().indexOf("hu") === 0;
setLang(fromUrl || load("lang") || (browserHu ? "hu" : "en"));

document.querySelector(".lang-toggle").addEventListener("click", () => {
  setLang(lang === "hu" ? "en" : "hu");
  save("lang", lang);
});

// ---------- Motion ----------
// The follower number counts up smoothly once, when it comes into view.
function countUp(el) {
  const target = +el.dataset.to;
  if (reduceMotion || !window.requestAnimationFrame) { el.textContent = formatNumber(target); return; }
  const start = Date.now();
  const duration = 1100;
  (function tick() {
    const t = Math.min(1, (Date.now() - start) / duration);
    const value = Math.round(target * (1 - Math.pow(1 - t, 3)));
    el.textContent = formatNumber(target >= 1000 ? Math.round(value / 1000) * 1000 : value);
    if (t < 1) requestAnimationFrame(tick);
  })();
}

// Stop-motion drawings (the flower and the painting frame): each one's frame follows the
// scroll position, so it draws itself when you scroll down to it and undraws when you scroll up.
// Work happens only on scroll, at most once per screen refresh, and only when a frame changes.
const drawings = Array.prototype.slice.call(document.querySelectorAll(".scrub")).map((el) => ({
  el: el,
  parts: Array.prototype.slice.call(el.querySelectorAll("[data-from]")),
  last: +el.getAttribute("data-frames"),
  shown: -1
}));
function drawFrame(d, frame) {
  if (frame === d.shown) return;
  d.shown = frame;
  d.parts.forEach((part) => {
    const from = +part.getAttribute("data-from");
    const to = +(part.getAttribute("data-to") || d.last);
    part.classList.toggle("on", frame >= from && frame <= to);
  });
}
let queued = false;
function updateDrawings() {
  queued = false;
  const h = window.innerHeight;
  const maxScroll = document.documentElement.scrollHeight - h;
  drawings.forEach((d) => {
    const top = d.el.getBoundingClientRect().top;
    // Starts when it enters at the bottom of the screen (or where it sits when the page opens,
    // if it's already on screen); finished when it reaches 40% from the top, or at the very
    // end of the page if it can't get that high. Always spread over at least a third of a screen.
    const topAtStart = top + window.pageYOffset;
    const topAtEnd = topAtStart - maxScroll;
    const startTop = Math.min(h, topAtStart);
    const endTop = Math.min(startTop - h * 0.35, Math.min(h * 0.85, Math.max(h * 0.4, topAtEnd)));
    const progress = Math.max(0, Math.min(1, (startTop - top) / (startTop - endTop)));
    drawFrame(d, Math.round(progress * d.last));
  });
}
if (reduceMotion) {
  drawings.forEach((d) => drawFrame(d, d.last));
} else if (drawings.length) {
  window.addEventListener("scroll", () => {
    if (!queued) { queued = true; (window.requestAnimationFrame || setTimeout)(updateDrawings); }
  }, { passive: true });
  window.addEventListener("resize", updateDrawings);
  updateDrawings();
}

// ---------- Little game ----------
// Four random digits are scattered faintly over the page, one per marked area, top to bottom.
// Set the four dials of the lock to them (tap = +1, arrow keys = up/down) and it opens;
// then a cookie draws itself in a few stop-motion frames.
const spots = document.querySelectorAll("[data-digit-spot]");
const lockCard = document.querySelector(".lock-card");
if (spots.length === 4 && lockCard) {
  const code = [1 + Math.floor(Math.random() * 9)]; // first digit never 0, so 0000 never opens it
  for (let i = 0; i < 3; i++) code.push(Math.floor(Math.random() * 10));
  for (let i = 0; i < 4; i++) {
    const digit = document.createElement("span");
    digit.className = "hidden-digit";
    digit.setAttribute("aria-hidden", "true");
    digit.textContent = code[i];
    digit.style.transform = "rotate(" + Math.round(Math.random() * 30 - 15) + "deg)";
    spots[i].appendChild(digit);
  }

  // Put each digit in the emptiest place of its area: it must not sit on a button, card, picture
  // or text, where it would be hidden or unreadable. Runs again when the area changes size
  // (phone turning, language switch).
  const OBSTACLES = "a, button, p, h1, h2, h3, h4, li, img, svg, span, strong, b, figcaption, .stat, .lock-card, .school-logo, .qr";
  const placeDigit = (digit, spot) => {
    digit.style.visibility = "visible";
    const s = spot.getBoundingClientRect();
    const w = digit.offsetWidth || 60, h = digit.offsetHeight || 90;
    const maxX = s.width - w - 8, maxY = s.height - h - 8;
    if (maxX < 8 || maxY < 8) return;
    const boxes = Array.prototype.slice.call(spot.querySelectorAll(OBSTACLES))
      .filter((el) => el !== digit && !el.contains(digit))
      .map((el) => el.getBoundingClientRect())
      .filter((b) => b.width > 1 && b.height > 1);
    let best = null;
    for (let n = 0; n < 300 && (!best || best.cost > 0); n++) {
      const x = 8 + Math.random() * maxX, y = 8 + Math.random() * maxY;
      let cost = 0;
      boxes.forEach((b) => {
        const ox = Math.min(x + w, b.right - s.left) - Math.max(x, b.left - s.left);
        const oy = Math.min(y + h, b.bottom - s.top) - Math.max(y, b.top - s.top);
        if (ox > 0 && oy > 0) cost += ox * oy;
      });
      if (!best || cost < best.cost) best = { x, y, cost };
    }
    digit.style.left = best.x + "px";
    digit.style.top = best.y + "px";
  };
  const placeAll = () => {
    spots.forEach((spot) => placeDigit(spot.querySelector(".hidden-digit"), spot));
  };
  // Placing reads the layout of the whole page, so do it rarely: once the page has settled
  // (after load and fonts), and again only when the width changes (rotating a phone, resizing).
  // Not on every height change, so the numbers never jump around while pictures load.
  let placeTimer = 0, placedWidth = 0;
  const placeSoon = () => {
    clearTimeout(placeTimer);
    placeTimer = setTimeout(() => {
      placedWidth = window.innerWidth;
      (window.requestAnimationFrame || setTimeout)(placeAll);
    }, 200);
  };
  window.addEventListener("resize", () => { if (window.innerWidth !== placedWidth) placeSoon(); });
  window.addEventListener("load", placeSoon);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeSoon);
  placeSoon();

  const lock = lockCard.querySelector(".lock");
  const dials = Array.prototype.slice.call(lockCard.querySelectorAll(".dial"));
  const cookieParts = Array.prototype.slice.call(lockCard.querySelectorAll(".cookie [data-from]"));
  let opened = false;
  const check = () => {
    if (opened || !dials.every((d, i) => +d.textContent === code[i])) return;
    opened = true;
    lock.setAttribute("data-state", "open");
    lockCard.classList.add("won");
    dials.forEach((d) => { d.disabled = true; });
    let frame = 0;
    const next = () => {
      frame++;
      cookieParts.forEach((p) => p.classList.toggle("on", +p.getAttribute("data-from") <= frame));
      if (frame < 7) setTimeout(next, reduceMotion ? 0 : 140);
    };
    setTimeout(next, reduceMotion ? 0 : 300);
  };
  const turn = (dial, step) => {
    dial.textContent = (+dial.textContent + step + 10) % 10;
    check();
  };
  dials.forEach((dial) => {
    dial.addEventListener("click", () => turn(dial, 1));
    dial.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp") { e.preventDefault(); turn(dial, 1); }
      if (e.key === "ArrowDown") { e.preventDefault(); turn(dial, -1); }
    });
  });
}

const blocks = document.querySelectorAll(".reveal");
function show(block) {
  block.classList.add("is-visible");
  block.querySelectorAll(".count").forEach(countUp);
}
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        show(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  blocks.forEach((block) => observer.observe(block));
} else {
  blocks.forEach((block) => block.classList.add("is-visible"));
}


// ---------- Code trail behind the mouse ----------
// A few small code characters appear behind the mouse and fade almost on the spot. Only with a real
// mouse (not on touch screens) and not when the visitor asked for less motion. The pointer itself stays normal.
if (window.matchMedia && matchMedia("(pointer: fine)").matches && !reduceMotion) {
  const GLYPHS = "01{}[]<>/;=+*#$&?~|()".split("");
  let lastX = -999, lastY = -999, alive = 0;
  window.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse" || alive > 6) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    if (dx * dx + dy * dy < 40 * 40) return;
    lastX = e.clientX; lastY = e.clientY;
    const bit = document.createElement("span");
    bit.className = "code-bit";
    bit.setAttribute("aria-hidden", "true");
    bit.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    bit.style.left = (e.clientX + 12) + "px";
    bit.style.top = (e.clientY + 6) + "px";
    alive++;
    bit.addEventListener("animationend", () => { bit.remove(); alive--; });
    document.body.appendChild(bit);
  }, { passive: true });
}

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
document.querySelectorAll(".js-email").forEach((link) => {
  link.href = "mailto:" + link.dataset.user + "@" + link.dataset.domain;
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

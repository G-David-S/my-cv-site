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

// ---------- Low-frame motion ----------
// Blocks pop in on a few steps (see style.css), and numbers count up at about
// 12 frames per second: a hand-made, stop-motion feel that costs almost nothing.
function countUp(el) {
  const target = +el.dataset.to;
  if (reduceMotion) { el.textContent = formatNumber(target); return; }
  const frames = 14;
  let frame = 0;
  const timer = setInterval(() => {
    frame++;
    const eased = 1 - Math.pow(1 - frame / frames, 3);
    const value = frame >= frames ? target : Math.round(target * eased);
    el.textContent = formatNumber(target >= 1000 ? Math.round(value / 1000) * 1000 : value);
    if (frame >= frames) clearInterval(timer);
  }, 83);
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

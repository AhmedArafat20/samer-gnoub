/* =========================
   Samer Aljanoub - App JS (FULL)
   - Mobile menu
   - Active nav
   - Reveal animations
   - FAQ accordion
   - Counters
   - WhatsApp form -> opens wa.me with formatted message
   - Projects grid auto-build for p01.jpg.. (or your pattern)
   - Lightbox for projects
   ========================= */

const WHATSAPP_NUMBER = "966545569798"; // International format (Saudi)

function qs(sel, ctx = document) { return ctx.querySelector(sel); }
function qsa(sel, ctx = document) { return Array.from(ctx.querySelectorAll(sel)); }

/* -------------------------
   Active nav link
------------------------- */
function setActiveNav() {
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  qsa(".nav a, .mobile-panel .links a").forEach(a => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    a.classList.toggle("active", href === path);
  });
}

/* -------------------------
   Mobile menu
------------------------- */
function initMobileMenu() {
  const burger = qs("#burger");
  const panel = qs("#mobilePanel");
  const closeBtn = qs("#mobileClose");

  if (!burger || !panel) return;

  function open() { panel.style.display = "block"; }
  function close() { panel.style.display = "none"; }

  burger.addEventListener("click", open);
  closeBtn?.addEventListener("click", close);

  panel.addEventListener("click", (e) => {
    if (e.target === panel) close();
  });

  qsa(".mobile-panel a").forEach(a => a.addEventListener("click", close));
}

/* -------------------------
   Reveal animation
------------------------- */
function initReveal() {
  const items = qsa(".reveal");
  if (!items.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if (ent.isIntersecting) ent.target.classList.add("in");
    });
  }, { threshold: 0.12 });

  items.forEach(el => io.observe(el));
}

/* -------------------------
   Accordion (FAQ)
------------------------- */
function initAccordion() {
  qsa(".accordion").forEach(acc => {
    const q = qs(".acc-q", acc);
    q?.addEventListener("click", () => {
      acc.classList.toggle("open");
    });
  });
}

/* -------------------------
   Counters
------------------------- */
function initCounters() {
  const nums = qsa("[data-count]");
  if (!nums.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if (!ent.isIntersecting) return;

      const el = ent.target;
      const target = Number(el.getAttribute("data-count") || "0");
      const suffix = el.getAttribute("data-suffix") || "";
      let cur = 0;
      const step = Math.max(1, Math.floor(target / 60));

      const t = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(t); }
        el.textContent = String(cur) + suffix;
      }, 16);

      io.unobserve(el);
    });
  }, { threshold: 0.35 });

  nums.forEach(n => io.observe(n));
}

/* -------------------------
   WhatsApp helpers
------------------------- */
function waLink(text) {
  const url = new URL(`https://wa.me/${WHATSAPP_NUMBER}`);
  url.searchParams.set("text", text);
  return url.toString();
}

function initQuickWAButtons() {
  // Any element with data-wa="text..." opens WhatsApp
  qsa("[data-wa]").forEach(btn => {
    btn.addEventListener("click", () => {
      const text = btn.getAttribute("data-wa") || "";
      window.open(waLink(text), "_blank", "noopener,noreferrer");
    });
  });
}

/* -------------------------
   WhatsApp form (contact page)
------------------------- */
function initWhatsAppForm() {
  const form = qs("#whatsappForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = (qs("#name")?.value || "").trim();
    const phone = (qs("#phone")?.value || "").trim();
    const city = (qs("#city")?.value || "").trim();
    const service = (qs("#service")?.value || "").trim();
    const details = (qs("#details")?.value || "").trim();

    const lines = [
      "السلام عليكم،",
      "أبغى عرض سعر من مؤسسة سامر الجنوب (ديكورات خارجية GRC).",
      "",
      `الاسم: ${name || "—"}`,
      `الجوال: ${phone || "—"}`,
      `المدينة: ${city || "—"}`,
      `الخدمة المطلوبة: ${service || "—"}`,
      "",
      "تفاصيل الطلب:",
      details || "—",
      "",
      "أبغى تواصل سريع + أقرب موعد معاينة."
    ];

    window.open(waLink(lines.join("\n")), "_blank", "noopener,noreferrer");
  });
}

/* -------------------------
   Projects grid auto-build (IMAGES ONLY)
   Works with multiple grids:
   <div class="js-projects-grid"
        data-path="assets/img/"
        data-prefix="p"
        data-pad="2"
        data-ext="jpg"
        data-start="1"
        data-total="27"></div>

   -> assets/img/p01.jpg, p02.jpg, ...
   No title / no description under images.
------------------------- */
function initProjectsAutoGrid() {
  const grids = document.querySelectorAll(".js-projects-grid");
  if (!grids.length) return;

  const padNum = (n, pad) => String(n).padStart(pad, "0");

  grids.forEach((grid) => {
    const basePath = grid.getAttribute("data-path") || "assets/img/";
    const prefix = grid.getAttribute("data-prefix") || "p";
    const pad = Number(grid.getAttribute("data-pad") || "2");
    const ext = grid.getAttribute("data-ext") || "jpg";
    const start = Number(grid.getAttribute("data-start") || "1");
    const total = Number(grid.getAttribute("data-total") || "28");

    // Clear first
    grid.innerHTML = "";

    for (let i = 0; i < total; i++) {
      const n = start + i;
      const src = `${basePath}${prefix}${padNum(n, pad)}.${ext}`; // assets/img/p01.jpg

      const card = document.createElement("div");
      card.className = "project reveal";
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("data-src", src);
      card.setAttribute("data-title", "مشروع");

      // ✅ صورة فقط بدون عنوان/وصف
      card.innerHTML = `
        <div class="thumb">
          <img src="${src}" alt="مشروع GRC" loading="lazy"
            onerror="this.closest('.project').style.display='none';" />
        </div>
      `;

      grid.appendChild(card);
    }
  });
}

/* -------------------------
   Lightbox for projects
   Needs:
   #lightbox, #lbImg, #lbTitle, #lbClose, #lbWA
------------------------- */
function initLightbox() {
  const lb = qs("#lightbox");
  if (!lb) return;

  const img = qs("#lbImg");
  const title = qs("#lbTitle");
  const closeBtn = qs("#lbClose");
  const waBtn = qs("#lbWA");

  function open(src, t) {
    if (img) img.src = src;
    if (title) title.textContent = t || "مشروع";
    lb.classList.add("open");
  }
  function close() {
    lb.classList.remove("open");
    if (img) img.src = "";
  }

  closeBtn?.addEventListener("click", close);
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

  // Click project cards (delegation)
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".project");
    if (!card) return;

    const src = card.getAttribute("data-src");
    const t = card.getAttribute("data-title");
    if (src) open(src, t);
  });

  // Keyboard open when focused
  document.addEventListener("keydown", (e) => {
    const el = document.activeElement;
    if (!el || !el.classList || !el.classList.contains("project")) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const src = el.getAttribute("data-src");
      const t = el.getAttribute("data-title");
      if (src) open(src, t);
    }
  });

  waBtn?.addEventListener("click", () => {
    const msg = `السلام عليكم، مهتم/ة بهذا المشروع.\nهل ممكن تعطوني تفاصيل + تكلفة تقريبية؟`;
    window.open(waLink(msg), "_blank", "noopener,noreferrer");
  });
}

/* -------------------------
   Footer year
------------------------- */
function initYear() {
  const el = qs("#year");
  if (el) el.textContent = String(new Date().getFullYear());
}

/* -------------------------
   Init
------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  initMobileMenu();

  // ✅ لازم الأول نولّد كروت المشاريع
  initProjectsAutoGrid();

  // ✅ بعد ما تتولّد، نفعّل الـ reveal عليها
  initReveal();

  initAccordion();
  initCounters();
  initWhatsAppForm();
  initLightbox();
  initQuickWAButtons();
  initYear();
});

/* =========================================================
   فانتاسي هاوس — interactions
   Libraries: GSAP + ScrollTrigger, Lenis, Swiper, GLightbox
   ========================================================= */
gsap.registerPlugin(ScrollTrigger);
document.body.classList.add("loading");
document.getElementById("year").textContent = new Date().getFullYear();

const WHATSAPP = "966543249360";
const isDesktop = window.matchMedia("(hover: hover) and (min-width: 992px)").matches;
const isMobile = window.matchMedia("(hover: none), (max-width: 767px)").matches;

// Mobile: stop re-calculating on address-bar show/hide (caused sections to jump)
ScrollTrigger.config({ ignoreMobileResize: true });

/* ---------- Projects (rendered from projects.js) ---------- */
const INITIAL_COUNT = 12;
const grid = document.getElementById("projectsGrid");
const imgPath = (n) => `img/projects/${n}.jpg`;

grid.innerHTML = PROJECTS.map((p, i) => {
  const gallery = `project-${i}`;
  const caption = `${p.title} — ${p.place}`;
  const extra = p.imgs.slice(1).map((n) =>
    `<a href="${imgPath(n)}" class="glightbox" data-gallery="${gallery}" data-title="${caption}" hidden></a>`
  ).join("");
  return `
    <div class="project ${p.size ? "project--" + p.size : ""}" data-cat="${p.cat}">
      <a href="${imgPath(p.imgs[0])}" class="glightbox project__link" data-gallery="${gallery}" data-title="${caption}">
        <img src="${imgPath(p.imgs[0])}" alt="${p.title}" loading="lazy" />
        ${p.imgs.length > 1 ? `<span class="project__count"><i class="ri-image-line"></i> ${p.imgs.length}</span>` : ""}
        <div class="project__info"><span>${p.label} · ${p.place}</span><h3>${p.title}</h3><i class="ri-arrow-left-up-line"></i></div>
      </a>
      ${extra}
    </div>`;
}).join("");

const projects = gsap.utils.toArray(".project");
const loadMore = document.getElementById("loadMore");
let currentFilter = "all";
let expanded = false;

function applyFilter() {
  let shown = 0;
  projects.forEach((p) => {
    const match = currentFilter === "all" || p.dataset.cat === currentFilter;
    const visible = match && (expanded || currentFilter !== "all" || shown < INITIAL_COUNT);
    if (visible) shown++;
    p.classList.toggle("is-hidden", !visible);
  });
  loadMore.parentElement.style.display = currentFilter === "all" && !expanded ? "" : "none";
  return projects.filter((p) => !p.classList.contains("is-hidden"));
}
applyFilter();

document.getElementById("filters").addEventListener("click", (e) => {
  const btn = e.target.closest(".filter");
  if (!btn || btn.classList.contains("active")) return;
  document.querySelectorAll(".filter").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  currentFilter = btn.dataset.filter;

  gsap.to(projects.filter((p) => !p.classList.contains("is-hidden")), {
    opacity: 0, scale: 0.92, duration: 0.25, stagger: 0.015,
    onComplete: () => {
      const visible = applyFilter();
      gsap.fromTo(visible, { opacity: 0, scale: 0.92, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power3.out", clearProps: "transform" });
      ScrollTrigger.refresh();
    },
  });
});

loadMore.addEventListener("click", () => {
  const before = new Set(projects.filter((p) => !p.classList.contains("is-hidden")));
  expanded = true;
  const added = applyFilter().filter((p) => !before.has(p));
  gsap.fromTo(added, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: "power3.out", clearProps: "transform" });
  ScrollTrigger.refresh();
});

/* ---------- Scrolling ----------
   Desktop: Lenis smooth scroll. Mobile: native scroll (phones already scroll smoothly,
   and hijacking it makes sections feel like they rush past). */
const lenis = isMobile ? createNativeScroller() : new Lenis({ duration: 1.2, smoothWheel: true });
if (!isMobile) {
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}
lenis.stop();

// Same API as the parts of Lenis this file uses, backed by the browser's own scrolling
function createNativeScroller() {
  const html = document.documentElement;
  const targetY = (t) => (typeof t === "number" ? t : t.getBoundingClientRect().top + window.scrollY);
  return {
    on(evt, cb) {
      window.addEventListener("scroll", () => cb({ scroll: window.scrollY, limit: html.scrollHeight - window.innerHeight }), { passive: true });
    },
    scrollTo(t, { offset = 0, immediate = false } = {}) {
      window.scrollTo({ top: targetY(t) + offset, behavior: immediate ? "auto" : "smooth" });
    },
    stop() { html.style.overflow = "hidden"; },
    start() { html.style.overflow = ""; },
  };
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("href");
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: id === "#home" ? 0 : -70 });
    closeMenu();
  });
});

/* ---------- Preloader ---------- */
const counter = { v: 0 };
gsap.timeline()
  .from(".preloader__logo", { scale: 0.8, opacity: 0, duration: 0.8, ease: "power3.out" })
  .to(counter, {
    v: 100, duration: 1.5, ease: "power2.inOut",
    onUpdate() {
      const v = Math.round(counter.v);
      document.getElementById("preloaderCount").textContent = v + "%";
      document.getElementById("preloaderBar").style.width = v + "%";
    },
  }, "<0.2")
  .to("#preloader", { yPercent: -100, duration: 1, ease: "power4.inOut" })
  .add(() => {
    document.getElementById("preloader").remove();
    document.body.classList.remove("loading");
    lenis.start();
    heroIntro();
  }, "-=0.4");

/* ---------- Hero ---------- */
function heroIntro() {
  gsap.timeline({ defaults: { ease: "power4.out" } })
    .from(".hero__title .word", { yPercent: 120, rotate: 4, duration: 1.2, stagger: 0.12 })
    .from(".reveal-hero", { y: 40, opacity: 0, duration: 1, stagger: 0.15 }, "-=0.8")
    .from(".nav__inner > *", { y: -30, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: "transform,opacity" }, "<");
}

new Swiper(".hero__slider", {
  effect: "fade",
  fadeEffect: { crossFade: true },
  loop: true,
  speed: 1500,
  allowTouchMove: false,
  autoplay: { delay: 6000, disableOnInteraction: false },
  pagination: { el: ".hero__pagination", clickable: true },
});

if (!isMobile) gsap.to(".hero__content", {
  yPercent: 35, opacity: 0, ease: "none",
  scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
});

/* ---------- Header behaviour ---------- */
const header = document.getElementById("header");
const toTop = document.getElementById("toTop");
const progress = document.getElementById("scrollProgress");
let lastY = 0;
lenis.on("scroll", ({ scroll, limit }) => {
  header.classList.toggle("scrolled", scroll > 60);
  header.classList.toggle("hidden", scroll > lastY && scroll > 600);
  toTop.classList.toggle("show", scroll > 700);
  progress.style.width = (scroll / limit) * 100 + "%";
  lastY = scroll;
});

document.querySelectorAll("section[id]").forEach((sec) => {
  ScrollTrigger.create({
    trigger: sec, start: "top center", end: "bottom center",
    onToggle: (self) => {
      if (!self.isActive) return;
      const links = document.querySelectorAll(".nav__menu a");
      if (![...links].some((a) => a.getAttribute("href") === "#" + sec.id)) return;
      links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + sec.id));
    },
  });
});

const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
navToggle.addEventListener("click", () => {
  navToggle.classList.toggle("open");
  navMenu.classList.toggle("open");
});
function closeMenu() {
  navToggle.classList.remove("open");
  navMenu.classList.remove("open");
}

/* ---------- Reveal animations ---------- */
gsap.utils.toArray(".fade-up").forEach((el) => {
  gsap.from(el, {
    y: isMobile ? 25 : 50, opacity: 0, duration: isMobile ? 0.7 : 1, ease: "power3.out", clearProps: "transform",
    scrollTrigger: { trigger: el, start: isMobile ? "top 92%" : "top 88%" },
  });
});

gsap.utils.toArray(".img-reveal").forEach((el) => {
  gsap.timeline({ scrollTrigger: { trigger: el, start: "top 80%" } })
    .from(el, { clipPath: "inset(0 0 100% 0)", duration: 1.4, ease: "power4.inOut" })
    .from(el.querySelector("img"), { scale: 1.4, duration: 1.8, ease: "power3.out" }, "<");
});

gsap.from(".about__exp", {
  scale: 0, rotate: -20, duration: 1, ease: "back.out(1.7)",
  scrollTrigger: { trigger: ".about__media", start: "top 60%" },
});

gsap.from(".service", {
  y: 70, opacity: 0, duration: 0.9, stagger: 0.07, ease: "power3.out",
  scrollTrigger: { trigger: ".services__grid", start: "top 80%" },
});

gsap.from(projects.filter((p) => !p.classList.contains("is-hidden")), {
  y: 60, opacity: 0, scale: 0.95, duration: 1, stagger: 0.06, ease: "power3.out", clearProps: "transform",
  scrollTrigger: { trigger: ".projects__grid", start: "top 80%" },
});

gsap.from(".doc", {
  y: 80, opacity: 0, rotate: (i) => (i % 2 ? 4 : -4), duration: 1, stagger: 0.1, ease: "power3.out", clearProps: "transform",
  scrollTrigger: { trigger: ".docs__grid", start: "top 80%" },
});

/* ---------- Counters ---------- */
document.querySelectorAll(".counter").forEach((el) => {
  const obj = { v: 0 };
  gsap.to(obj, {
    v: +el.dataset.target, duration: 2.2, ease: "power2.out",
    scrollTrigger: { trigger: el, start: "top 90%" },
    onUpdate: () => (el.textContent = Math.round(obj.v)),
  });
});

gsap.from(".stat", {
  y: 60, opacity: 0, duration: 1, stagger: 0.12, ease: "power3.out", clearProps: "transform",
  scrollTrigger: { trigger: ".stats", start: "top 75%" },
});

/* ---------- Parallax ---------- */
gsap.to(".stats__bg", {
  yPercent: 20, ease: "none",
  scrollTrigger: { trigger: ".stats", start: "top bottom", end: "bottom top", scrub: true },
});
gsap.to(".cta__bg", {
  backgroundPosition: "50% 100%", ease: "none",
  scrollTrigger: { trigger: ".cta", start: "top bottom", end: "bottom top", scrub: true },
});
if (!isMobile) gsap.to(".marquee", {
  rotate: 1.5, ease: "none",
  scrollTrigger: { trigger: ".marquee", start: "top bottom", end: "bottom top", scrub: true },
});

/* ---------- Horizontal values section ---------- */
const mm = gsap.matchMedia();
mm.add("(min-width: 768px)", () => {
  const track = document.getElementById("whyTrack");
  const getDistance = () => track.scrollWidth - window.innerWidth;
  gsap.to(track, {
    x: () => getDistance(), // RTL: move to the right
    ease: "none",
    scrollTrigger: {
      trigger: ".why", start: "top top", end: () => "+=" + getDistance(),
      pin: true, scrub: 1, invalidateOnRefresh: true,
    },
  });
});
mm.add("(max-width: 767px)", () => {
  document.getElementById("whyTrack").style.cssText = "overflow-x:auto;width:auto;scroll-snap-type:x mandatory;padding-bottom:10px";
});

/* ---------- Timeline ---------- */
const steps = gsap.utils.toArray(".step");
gsap.to("#timelineProgress", {
  width: "100%", ease: "none",
  scrollTrigger: {
    trigger: ".timeline", start: "top 70%", end: "bottom 60%", scrub: true,
    onUpdate: (self) => steps.forEach((s, i) => s.classList.toggle("active", self.progress >= i / (steps.length - 1) - 0.02)),
  },
});
gsap.from(".step", {
  y: 60, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out", clearProps: "transform",
  scrollTrigger: { trigger: ".timeline", start: "top 80%" },
});

/* ---------- Acoustic slider ---------- */
new Swiper(".acoustic__slider", {
  effect: "coverflow",
  centeredSlides: true,
  slidesPerView: 1.3,
  loop: true,
  speed: 900,
  grabCursor: true,
  coverflowEffect: { rotate: 0, stretch: 0, depth: 180, modifier: 1, slideShadows: false, scale: 0.85 },
  autoplay: { delay: 3000, disableOnInteraction: false },
  navigation: { nextEl: ".a-next", prevEl: ".a-prev" },
  pagination: { el: ".acoustic__pagination", type: "fraction" },
  breakpoints: { 640: { slidesPerView: 1.6 } },
});

/* ---------- Lightbox ---------- */
GLightbox({ selector: ".glightbox", touchNavigation: true, loop: true });

/* ---------- Cursor, magnetic buttons, tilt ---------- */
if (isDesktop) {
  const cursor = document.getElementById("cursor");
  const dot = document.getElementById("cursorDot");
  const xTo = gsap.quickTo(cursor, "x", { duration: 0.5, ease: "power3" });
  const yTo = gsap.quickTo(cursor, "y", { duration: 0.5, ease: "power3" });
  window.addEventListener("mousemove", (e) => {
    xTo(e.clientX); yTo(e.clientY);
    gsap.set(dot, { x: e.clientX, y: e.clientY });
  });
  document.querySelectorAll("a, button, .project, .service").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
  });

  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.4, duration: 0.4 });
    });
    btn.addEventListener("mouseleave", () => gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, .4)" }));
  });

  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(card, { rotateY: px * 10, rotateX: -py * 10, y: -8, transformPerspective: 900, duration: 0.5 });
    });
    card.addEventListener("mouseleave", () => gsap.to(card, { rotateY: 0, rotateX: 0, y: 0, duration: 0.8, ease: "power3.out" }));
  });
}

/* ---------- Contact form -> WhatsApp ---------- */
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const v = (id) => document.getElementById(id).value.trim();
  const lines = [
    "السلام عليكم، أرغب في طلب عرض سعر:",
    `الاسم: ${v("name")}`,
    `الجوال: ${v("phone")}`,
    v("city") && `الموقع: ${v("city")}`,
    `الخدمة: ${v("service")}`,
    v("msg") && `التفاصيل: ${v("msg")}`,
  ].filter(Boolean);
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
  const note = document.getElementById("formNote");
  note.textContent = "✓ تم تجهيز رسالتك في واتساب — اضغط إرسال لإتمام الطلب.";
  gsap.from(note, { y: 10, opacity: 0, duration: 0.5 });
  e.target.reset();
});

window.addEventListener("load", () => ScrollTrigger.refresh());

// Theme & navigation
const menu = document.querySelector("#menuBtn");
const nav = document.querySelector("#topbarNav");
const theme = document.querySelector("#themeToggle");

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "light") document.body.classList.add("light");

if (theme) {
  theme.addEventListener("click", () => {
    document.body.classList.toggle("light");
    localStorage.setItem("portfolio-theme", document.body.classList.contains("light") ? "light" : "dark");
  });
}

if (menu && nav) {
  menu.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

// Close mobile nav when jumping to an anchor
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", () => {
    if (window.innerWidth <= 850 && nav) nav.classList.remove("open");
  });
});

const pad = n => String(n).padStart(2, "0");

// Header clock (user local time)
function updateHeaderTime() {
  const now = new Date();
  const headerTime = document.querySelector("#headerTime");
  if (headerTime) {
    headerTime.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }
}

// Studio clock (Jakarta / WIB) & availability badge
const studioTime = document.querySelector("#studioTime");
const studioStatus = document.querySelector("#studioStatus");
const STUDIO_TIMEZONE = "Asia/Jakarta";

function updateStudioTime() {
  const now = new Date();
  
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: STUDIO_TIMEZONE,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  const parts = formatter.formatToParts(now);
  let sh = 0, sm = 0, ss = 0;
  parts.forEach(p => {
    if (p.type === "hour") sh = parseInt(p.value, 10) % 24;
    if (p.type === "minute") sm = parseInt(p.value, 10);
    if (p.type === "second") ss = parseInt(p.value, 10);
  });

  if (studioTime) studioTime.textContent = `${pad(sh)}:${pad(sm)}:${pad(ss)}`;

  if (studioStatus) {
    studioStatus.classList.remove("online", "away", "offline");
    if (sh >= 9 && sh < 18) {
      studioStatus.textContent = "ONLINE";
      studioStatus.classList.add("online");
    } else if (sh >= 18 && sh < 22) {
      studioStatus.textContent = "AWAY / TINKERING";
      studioStatus.classList.add("away");
    } else {
      studioStatus.textContent = "OFFLINE / ASLEEP";
      studioStatus.classList.add("offline");
    }
  }
}

updateHeaderTime();
updateStudioTime();
setInterval(() => {
  updateHeaderTime();
  updateStudioTime();
}, 1000);

// Reveal sections on scroll
const aboutSection = document.querySelector("#about");
if (aboutSection) {
  const aboutObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      aboutSection.classList.add("active");
      aboutObserver.disconnect();
    }
  }, { threshold: 0.2 });
  aboutObserver.observe(aboutSection);
}

const skillSection = document.querySelector("#skills");
if (skillSection) {
  const skillObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      skillSection.classList.add("active");
      document.querySelectorAll(".skill i").forEach(bar => {
        bar.style.setProperty("--skill-width", bar.dataset.width);
      });
      skillObserver.disconnect();
    }
  }, { threshold: 0.25 });
  skillObserver.observe(skillSection);
}

const contactSection = document.querySelector("#contact");
if (contactSection) {
  const contactObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      contactSection.classList.add("active");
      contactObserver.disconnect();
    }
  }, { threshold: 0.25 });
  contactObserver.observe(contactSection);
}

// Project modal & preview state
const modal = document.querySelector("#projectModal");
const modalBox = document.querySelector(".modal-box");
const modalTitle = document.querySelector("#modalTitle");
const modalCategory = document.querySelector("#modalCategory");
const modalDetail = document.querySelector("#modalDetail");
const modalImage = document.querySelector("#modalImage");
const modalPlaceholderText = document.querySelector("#modalPlaceholderText");

const specCanvas = document.querySelector("#specCanvas");
const specFrames = document.querySelector("#specFrames");
const specPalette = document.querySelector("#specPalette");
const specPipeline = document.querySelector("#specPipeline");
const modalExternalLink = document.querySelector("#modalExternalLink");

function openModal(card) {
  if (!modal) return;

  if (modalTitle) modalTitle.textContent = card.dataset.title || "PROJECT DETAILS";
  if (modalCategory) modalCategory.textContent = card.dataset.category || "01 // CASE STUDY";
  if (modalDetail) modalDetail.textContent = card.dataset.detail || "No technical breakdown provided.";

  if (specCanvas) specCanvas.textContent = card.dataset.canvas || "32 × 32 PX";
  if (specFrames) specFrames.textContent = card.dataset.frames || "6-FRAME / 8-WAY";
  if (specPalette) specPalette.textContent = card.dataset.palette || "16 COLORS";
  if (specPipeline) specPipeline.textContent = card.dataset.pipeline || "ASEPRITE → GODOT";

  if (card.dataset.image && modalImage) {
    modalImage.src = card.dataset.image;
    modalImage.style.display = "block";
    if (modalPlaceholderText) modalPlaceholderText.style.display = "none";
  } else {
    if (modalImage) {
      modalImage.src = "";
      modalImage.style.display = "none";
    }
    if (modalPlaceholderText) {
      modalPlaceholderText.textContent = card.dataset.title ? `${card.dataset.title} PREVIEW` : "PROJECT PREVIEW";
      modalPlaceholderText.style.display = "block";
    }
  }

  if (modalExternalLink) {
    if (card.dataset.link) {
      modalExternalLink.href = card.dataset.link;
      modalExternalLink.style.display = "inline-block";
    } else {
      modalExternalLink.style.display = "none";
    }
  }

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  if (modalBox) modalBox.scrollTop = 0;
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// 3D pointer tilt (desktop only)
document.querySelectorAll(".interactive-card").forEach(card => {
  card.addEventListener("pointermove", e => {
    if (window.innerWidth <= 850) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateX(${y * -5}deg) rotateY(${x * 7}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });

  card.addEventListener("click", () => openModal(card));
});

const backdrop = document.querySelector(".modal-backdrop");
const closeBtn = document.querySelector(".modal-close");
const closeActionBtn = document.querySelector(".modal-close-action");

[backdrop, closeBtn, closeActionBtn].forEach(el => {
  if (el) el.addEventListener("click", closeModal);
});

window.addEventListener("keydown", e => {
  if (e.key === "Escape" && modal && modal.classList.contains("open")) {
    closeModal();
  }
});
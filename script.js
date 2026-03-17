document.addEventListener("DOMContentLoaded", () => {
  // Mobile navigation toggle
  const siteHeader = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");

  if (siteHeader && menuToggle) {
    menuToggle.addEventListener("click", () => {
      const isOpen = siteHeader.classList.toggle("nav-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // Hero slideshow
  const heroSlides = document.querySelectorAll(".hero-slide");
  let activeSlideIndex = 0;

  function showNextSlide() {
    if (heroSlides.length <= 1) return;

    heroSlides[activeSlideIndex].classList.remove("is-active");
    activeSlideIndex = (activeSlideIndex + 1) % heroSlides.length;
    heroSlides[activeSlideIndex].classList.add("is-active");
  }

  if (heroSlides.length > 1) {
    setInterval(showNextSlide, 4500);
  }

  // Gallery lightbox
  const galleryImages = document.querySelectorAll(".gallery-card img");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxDownload = document.getElementById("lightboxDownload");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxBackdrop = document.querySelector(".lightbox-backdrop");

  function getFileName(path) {
    return path.split("/").pop();
  }

  function openLightbox(image) {
    if (!lightbox || !lightboxImage || !lightboxDownload) return;

    const imageSrc = image.getAttribute("src");
    const imageAlt = image.getAttribute("alt") || "Gallery photo";

    lightboxImage.src = imageSrc;
    lightboxImage.alt = imageAlt;
    lightboxDownload.href = imageSrc;
    lightboxDownload.setAttribute("download", getFileName(imageSrc));

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImage || !lightboxDownload) return;

    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");

    lightboxImage.src = "";
    lightboxImage.alt = "";
    lightboxDownload.href = "";
  }

  galleryImages.forEach((image) => {
    image.addEventListener("click", () => openLightbox(image));
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightboxBackdrop) {
    lightboxBackdrop.addEventListener("click", closeLightbox);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
});
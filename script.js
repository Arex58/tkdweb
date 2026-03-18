document.addEventListener("DOMContentLoaded", () => {
  const siteHeader = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const heroSlides = document.querySelectorAll(".hero-slide");
  const galleryGrid = document.getElementById("galleryGrid");
  const newsGrid = document.getElementById("newsGrid");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxDownload = document.getElementById("lightboxDownload");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxBackdrop = document.querySelector(".lightbox-backdrop");
  let activeSlideIndex = 0;

  if (siteHeader && menuToggle) {
    menuToggle.addEventListener("click", () => {
      const isOpen = siteHeader.classList.toggle("nav-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  function showNextSlide() {
    if (heroSlides.length <= 1) return;

    heroSlides[activeSlideIndex].classList.remove("is-active");
    activeSlideIndex = (activeSlideIndex + 1) % heroSlides.length;
    heroSlides[activeSlideIndex].classList.add("is-active");
  }

  if (heroSlides.length > 1) {
    setInterval(showNextSlide, 4500);
  }

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

  function createTextLink(item) {
    if (!item.linkUrl) return null;

    const link = document.createElement("a");
    link.className = item.featured ? "text-link" : "btn btn-outline btn-small news-button";
    link.href = item.linkUrl;
    link.textContent = `${item.linkText || "Learn More"} →`;
    return link;
  }

  function renderNews(items) {
    if (!newsGrid || !Array.isArray(items) || items.length === 0) return;

    newsGrid.innerHTML = "";

    items.forEach((item) => {
      const article = document.createElement("article");
      article.className = item.featured ? "news-card featured-news-card" : "news-card";

      const label = document.createElement("p");
      label.className = "news-date";
      label.textContent = item.label || "";
      article.appendChild(label);

      const title = document.createElement("h3");
      title.textContent = item.title || "Untitled update";
      article.appendChild(title);

      const summary = document.createElement("p");
      summary.textContent = item.summary || "";
      article.appendChild(summary);

      const link = createTextLink(item);
      if (link) {
        article.appendChild(link);
      }

      newsGrid.appendChild(article);
    });
  }

  function renderGallery(items) {
    if (!galleryGrid || !Array.isArray(items) || items.length === 0) return;

    galleryGrid.innerHTML = "";

    items.forEach((item, index) => {
      const figure = document.createElement("figure");
      const makeLarge = Boolean(item.featured) || index === 0;
      figure.className = makeLarge ? "gallery-card gallery-card-large" : "gallery-card";

      const image = document.createElement("img");
      image.src = item.image || "";
      image.alt = item.alt || item.title || "Gallery photo";
      figure.appendChild(image);

      if (item.title) {
        const caption = document.createElement("figcaption");
        caption.textContent = item.title;
        figure.appendChild(caption);
      }

      galleryGrid.appendChild(figure);
    });
  }

  async function loadSiteContent() {
    try {
      const response = await fetch("data/site-content.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`Failed to load content: ${response.status}`);

      const data = await response.json();
      renderNews(data.news);
      renderGallery(data.gallery);
    } catch (error) {
      console.warn("Using built-in page content because content JSON could not be loaded.", error);
    }
  }

  if (galleryGrid) {
    galleryGrid.addEventListener("click", (event) => {
      const image = event.target.closest("img");
      if (image) {
        openLightbox(image);
      }
    });
  }

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

  loadSiteContent();
});

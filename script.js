document.addEventListener("DOMContentLoaded", () => {
  const siteHeader = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNavLinks = document.querySelectorAll(".site-nav a");
  const heroSlides = document.querySelectorAll(".hero-slide");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxDownload = document.getElementById("lightboxDownload");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxBackdrop = document.querySelector(".lightbox-backdrop");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxCounter = document.getElementById("lightboxCounter");

  let activeSlideIndex = 0;
  let galleryItems = [];
  let activeGalleryIndex = 0;

  if (siteHeader && menuToggle) {
    menuToggle.addEventListener("click", () => {
      const isOpen = siteHeader.classList.toggle("nav-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });
  }

  siteNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (siteHeader?.classList.contains("nav-open")) {
        siteHeader.classList.remove("nav-open");
        menuToggle?.setAttribute("aria-expanded", "false");
        menuToggle?.setAttribute("aria-label", "Open navigation");
      }
    });
  });

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
    return path.split("/").pop() || "photo.jpg";
  }

  function updateLightbox(index) {
    if (!lightboxImage || !galleryItems.length) return;
    const item = galleryItems[index];
    activeGalleryIndex = index;
    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt;
    if (lightboxDownload) {
      lightboxDownload.href = item.src;
      lightboxDownload.setAttribute("download", getFileName(item.src));
    }
    if (lightboxCaption) {
      lightboxCaption.textContent = item.caption || item.alt || "Gallery photo";
    }
    if (lightboxCounter) {
      lightboxCounter.textContent = `${index + 1} of ${galleryItems.length}`;
    }
  }

  function openLightbox(index) {
    if (!lightbox || !galleryItems.length) return;
    updateLightbox(index);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImage) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    lightboxImage.src = "";
    lightboxImage.alt = "";
  }

  function moveLightbox(step) {
    if (!galleryItems.length) return;
    const nextIndex = (activeGalleryIndex + step + galleryItems.length) % galleryItems.length;
    updateLightbox(nextIndex);
  }

  function deriveLabel(item) {
    if (item.title) return item.title;
    const text = `${item.alt || ""} ${item.label || ""}`.toLowerCase();
    if (text.includes("tournament")) return "Tournament";
    if (text.includes("ceremony")) return "Ceremony";
    if (text.includes("cake") || text.includes("anniversary")) return "Celebration";
    if (text.includes("kick") || text.includes("training")) return "Training";
    if (text.includes("family")) return "Academy Family";
    return "Academy";
  }

  function createGalleryCard(item, index) {
    const figure = document.createElement("figure");
    const large = Boolean(item.featured) || index === 0;
    figure.className = large ? "gallery-card gallery-card-large" : "gallery-card";
    figure.tabIndex = 0;
    figure.dataset.index = String(index);

    const image = document.createElement("img");
    image.src = item.image || item.src || "";
    image.alt = item.alt || item.title || "Gallery photo";
    image.loading = "lazy";
    figure.appendChild(image);

    const caption = document.createElement("figcaption");
    caption.className = "gallery-overlay";

    const label = document.createElement("span");
    label.className = "gallery-label";
    label.textContent = deriveLabel(item);

    const view = document.createElement("span");
    view.className = "gallery-view";
    view.textContent = "View Photo";

    caption.append(label, view);
    figure.appendChild(caption);
    return figure;
  }

  function createNewsLink(item) {
    if (!item.linkUrl) return null;
    const link = document.createElement("a");
    link.className = item.featured ? "text-link" : "btn btn-outline";
    link.href = item.linkUrl;
    link.textContent = `${item.linkText || "Learn More"} →`;
    return link;
  }

  function createNewsCard(item) {
    const article = document.createElement("article");
    article.className = item.featured ? "news-card featured-news-card" : "news-card";

    const label = document.createElement("p");
    label.className = "news-date";
    label.textContent = item.label || "";
    article.appendChild(label);

    const title = document.createElement("h3");
    title.textContent = item.title || "Academy Update";
    article.appendChild(title);

    const summary = document.createElement("p");
    summary.textContent = item.summary || "";
    article.appendChild(summary);

    const link = createNewsLink(item);
    if (link) article.appendChild(link);
    return article;
  }

  function renderGallery(grid, items) {
    if (!grid || !Array.isArray(items) || !items.length) return;

    const limit = Number(grid.dataset.galleryLimit || 0);
    const selectedItems = limit > 0 ? items.slice(0, limit) : items;

    grid.innerHTML = "";
    selectedItems.forEach((item, index) => {
      grid.appendChild(createGalleryCard(item, index));
    });

    galleryItems = Array.from(grid.querySelectorAll(".gallery-card img")).map((img, index) => ({
      src: img.getAttribute("src") || "",
      alt: img.getAttribute("alt") || "Gallery photo",
      caption:
        grid.querySelectorAll(".gallery-label")[index]?.textContent ||
        img.getAttribute("alt") ||
        "Gallery photo"
    }));
  }

  function renderNews(grid, items) {
    if (!grid || !Array.isArray(items) || !items.length) return;
    const limit = Number(grid.dataset.newsLimit || 0);
    const selectedItems = limit > 0 ? items.slice(0, limit) : items;

    grid.innerHTML = "";
    selectedItems.forEach((item) => {
      grid.appendChild(createNewsCard(item));
    });
  }

  async function loadSiteContent() {
    const newsGrids = document.querySelectorAll("[data-news-grid]");
    const galleryGrids = document.querySelectorAll("[data-gallery-grid]");
    if (!newsGrids.length && !galleryGrids.length) return;

    try {
      const response = await fetch("data/site-content.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`Failed to load content: ${response.status}`);
      const data = await response.json();

      newsGrids.forEach((grid) => renderNews(grid, data.news || []));
      galleryGrids.forEach((grid) => renderGallery(grid, data.gallery || []));
    } catch (error) {
      console.warn("Could not load site-content.json. Using page fallback content.", error);
      const fallbackGalleryGrid = document.querySelector("[data-gallery-grid]");
      if (fallbackGalleryGrid) {
        galleryItems = Array.from(fallbackGalleryGrid.querySelectorAll(".gallery-card img")).map((img, index) => ({
          src: img.getAttribute("src") || "",
          alt: img.getAttribute("alt") || "Gallery photo",
          caption:
            fallbackGalleryGrid.querySelectorAll(".gallery-label")[index]?.textContent ||
            img.getAttribute("alt") ||
            "Gallery photo"
        }));
      }
    }
  }

  document.addEventListener("click", (event) => {
    const figure = event.target.closest(".gallery-card");
    if (figure && figure.closest("[data-gallery-grid]")) {
      openLightbox(Number(figure.dataset.index || 0));
    }
  });

  document.addEventListener("keydown", (event) => {
    const figure = document.activeElement?.closest?.(".gallery-card");
    if ((event.key === "Enter" || event.key === " ") && figure) {
      event.preventDefault();
      openLightbox(Number(figure.dataset.index || 0));
    }

    if (!lightbox?.classList.contains("is-open")) return;

    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") moveLightbox(-1);
    if (event.key === "ArrowRight") moveLightbox(1);
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightboxBackdrop?.addEventListener("click", closeLightbox);
  lightboxPrev?.addEventListener("click", () => moveLightbox(-1));
  lightboxNext?.addEventListener("click", () => moveLightbox(1));

  loadSiteContent();
});

const filterButtons = document.querySelectorAll('.filter-button');
const galleryItems = [...document.querySelectorAll('.gallery-item')];
const imageCount = document.querySelector('#image-count');
const emptyState = document.querySelector('#empty-state');
const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxTitle = document.querySelector('#lightbox-title');
const lightboxLocation = document.querySelector('#lightbox-location');
const lightboxCounter = document.querySelector('#lightbox-counter');
const lightboxError = document.querySelector('#lightbox-error');
const closeButton = document.querySelector('#lightbox-close');
const previousButton = document.querySelector('#lightbox-prev');
const nextButton = document.querySelector('#lightbox-next');

let activeFilter = 'all';
let visibleItems = galleryItems;
let activeIndex = 0;

function updateGallery(filter) {
  activeFilter = filter;
  visibleItems = galleryItems.filter((item) => filter === 'all' || item.dataset.category === filter);
  galleryItems.forEach((item) => item.classList.toggle('is-hidden', !visibleItems.includes(item)));
  imageCount.textContent = String(visibleItems.length).padStart(2, '0');
  emptyState.hidden = visibleItems.length > 0;
}

function showImage(index) {
  activeIndex = (index + visibleItems.length) % visibleItems.length;
  const item = visibleItems[activeIndex];
  const thumbnail = item.querySelector('img');
  const imageSource = thumbnail.currentSrc || thumbnail.getAttribute('src') || item.dataset.image;
  const resolvedSource = new URL(imageSource, document.baseURI).href;
  lightboxImage.hidden = true;
  lightboxError.hidden = true;
  lightboxImage.alt = thumbnail.alt;
  lightboxImage.onload = () => { lightboxImage.hidden = false; };
  lightboxImage.onerror = () => { lightboxError.hidden = false; };
  lightboxImage.src = resolvedSource;
  lightboxTitle.innerHTML = item.dataset.title;
  lightboxLocation.textContent = `${item.dataset.location} / ${item.dataset.category}`;
  lightboxCounter.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(visibleItems.length).padStart(2, '0')}`;
}

function openLightbox(item) {
  activeIndex = visibleItems.indexOf(item);
  showImage(activeIndex);
  lightbox.hidden = false;
  document.body.classList.add('is-locked');
  closeButton.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.classList.remove('is-locked');
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle('is-active', isActive);
      filterButton.setAttribute('aria-pressed', String(isActive));
    });
    updateGallery(button.dataset.filter);
  });
});

galleryItems.forEach((item) => item.querySelector('.image-button').addEventListener('click', () => openLightbox(item)));
closeButton.addEventListener('click', closeLightbox);
previousButton.addEventListener('click', () => showImage(activeIndex - 1));
nextButton.addEventListener('click', () => showImage(activeIndex + 1));
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (event) => {
  if (lightbox.hidden) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') showImage(activeIndex - 1);
  if (event.key === 'ArrowRight') showImage(activeIndex + 1);
});

updateGallery(activeFilter);

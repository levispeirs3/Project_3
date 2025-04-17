const items = document.querySelectorAll('.carousel-image');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');

let current = 0;

function showImage(index) {
  items.forEach((item, i) => {
    item.classList.remove('active');
    if (i === index) item.classList.add('active');
  });
}

let autoSlide;

function startAutoSlide() {
  clearInterval(autoSlide);
  autoSlide = setInterval(() => {
    current = (current + 1) % items.length;
    showImage(current);
  }, 6000); 
}

next.addEventListener('click', () => {
  current = (current + 1) % items.length;
  showImage(current);
  startAutoSlide();
});

prev.addEventListener('click', () => {
  current = (current - 1 + images.length) % images.length;
  showImage(current);
  startAutoSlide();
});

startAutoSlide(); 
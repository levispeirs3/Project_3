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

// --- Dark Mode --- //   
document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById('toggle-dark-mode');

  // Check if the button exists
//   if (toggleButton) {
      // Apply saved mode from localStorage
      const isDarkMode = localStorage.getItem('darkMode') === 'true';
      if (isDarkMode) {
          document.body.classList.add('dark-mode');
          toggleButton.textContent = "Dark Mode: ON";
      } else {
          toggleButton.textContent = "Dark Mode: OFF";
      }

      toggleButton.addEventListener('click', () => {
          document.body.classList.toggle('dark-mode');
          const isDark = document.body.classList.contains('dark-mode');
          localStorage.setItem('darkMode', isDark);
          toggleButton.textContent = isDark ? "Dark Mode: ON" : "Dark Mode: OFF";
      });
//   } else {
//       console.warn("Dark mode toggle button not found in the DOM.");
//   }
});
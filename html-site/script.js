// Contact form handler
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      document.getElementById('contact-success').style.display = 'block';
      contactForm.reset();
    });
  }

  // Gallery handler
  const galleryList = document.getElementById('gallery-list');
  const addImageForm = document.getElementById('add-image-form');
  if (galleryList && addImageForm) {
    // Load images from localStorage
    let images = JSON.parse(localStorage.getItem('galleryImages') || '[]');
    function renderGallery() {
      galleryList.innerHTML = '';
      images.forEach((url, idx) => {
        const div = document.createElement('div');
        div.style.position = 'relative';
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Gallery Image';
        const btn = document.createElement('button');
        btn.textContent = 'Remove';
        btn.style.position = 'absolute';
        btn.style.top = '4px';
        btn.style.right = '4px';
        btn.onclick = function() {
          images.splice(idx, 1);
          localStorage.setItem('galleryImages', JSON.stringify(images));
          renderGallery();
        };
        div.appendChild(img);
        div.appendChild(btn);
        galleryList.appendChild(div);
      });
    }
    renderGallery();
    addImageForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const url = document.getElementById('image-url').value;
      if (url) {
        images.push(url);
        localStorage.setItem('galleryImages', JSON.stringify(images));
        renderGallery();
        addImageForm.reset();
      }
    });
  }
});
console.log('js images');
const imageCards = document.querySelectorAll('.card-image');
const createImageModal = imgUrl => {
  const body = document.body;
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.classList.add('is-active');
  modal.innerHTML = `        
    <div class="modal-background"></div>
    <div class="modal-content">
      <p class="image is-4by3">
        <img src="${imgUrl}" alt="">
      </p>
    </div>
    <button class="modal-close  is-large" aria-label="close" id="modal-close-btn"></button>

  `;
  body.appendChild(modal);
  const closeModalBtn = document.querySelector('#modal-close-btn');
  closeModalBtn.addEventListener('click', e => {
    modal.remove();
  });
};
if (imageCards.length > 0) {
  imageCards.forEach(imageCard => {
    imageCard.addEventListener('click', e => {
      const imgUrl =
        imageCard.firstElementChild.firstElementChild.src;
      createImageModal(imgUrl);
    });
  });
}

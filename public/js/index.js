const postForm = document.getElementById('post-form');
if (postForm) {
  postForm.addEventListener('submit', e => {
    e.preventDefault();
    const targetElements = e.target.elements;
    const csrf = targetElements._csrf.value;
    const title = targetElements.title.value;
    const postContent = targetElements.postContent.value;
    const post = {
      title,
      postContent
    };

    fetch('/add-post', {
      method: 'POST',
      body: JSON.stringify(post),
      headers: {
        'csrf-token': csrf,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response) {
          return response.json();
        }
      })
      .then(response => {
        const { error } = response;
        if (error) {
          const errorMsg = document.createElement('div');
          errorMsg.className = 'notification is-danger';
          errorMsg.innerHTML = ` <p>${error}</p>`;
          postForm.insertBefore(errorMsg, postForm.firstElementChild), 2;
          setTimeout(() => {
            errorMsg.remove();
          }, 2000);
        } else {
          const postElement = document.createElement('div');
          postElement.className = 'card';
          postElement.innerHTML = `
        <header class="card-header">
          <p class="card-header-title">
           ${title}
          </p>
          <a href="#" class="card-header-icon" aria-label="more options">
            <span class="icon">
              <i class="fas fa-angle-down" aria-hidden="true"></i>
            </span>
          </a>
        </header>
        <div class="card-content">
          <div class="content">
            ${postContent}
            <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
          </div>
        </div>
        <footer class="card-footer">
          <a href="#" class="card-footer-item">Save</a>
          <a href="#" class="card-footer-item">Edit</a>
          <a href="#" class="card-footer-item">Delete</a>
        </footer>
      `;
          const postsContainer = document.getElementById('posts-container');
          postsContainer.insertBefore(postElement,postsContainer.firstElementChild);
          e.target.reset();
        }
      });
  });
}

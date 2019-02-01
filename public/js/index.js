const postForm = document.getElementById('post-form');
if (postForm) {
  postForm.addEventListener('submit', e => {
    e.preventDefault();
    const targetElements = e.target.elements;
    const csrf = targetElements._csrf.value;
    const title = targetElements.title.value;
    const postContent = targetElements.post.value;
    const post = {
      title,
      postContent
    };
    const postContent = `<div class="card">
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
      </div>`;
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML += postContent;

    fetch('/quiz-results', {
      method: 'POST',
      body: JSON.stringify(post),
      headers: {
        'csrf-token': csrf,
        'Content-Type': 'application/json'
      }
    });
  });
}

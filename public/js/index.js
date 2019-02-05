const postForm = document.getElementById('post-form');
const csrf = document.querySelector("[name='_csrf']").value;

const deletePost = () => {
  const deleteBtnList = document.querySelectorAll('.delete-btn');
  if (deleteBtnList.length > 0) {
    deleteBtnList.forEach(deleteBtn => {
      deleteBtn.addEventListener('click', e => {
        const postId = e.target.getAttribute('data-postId');
        fetch(`delete-post/${postId}`, {
          method: 'DELETE',
          headers: {
            'csrf-token': csrf
          }
        })
          .then(response => {
            return response.json();
          })
          .then(response => {
            if (response.msg === 'postDeleted') {
              const selectedPost = document.querySelector(`#post-${postId}`);
              selectedPost.remove();
            }
          });
      });
    });
  }
};
const editPost = () => {
  const editBtnList = document.querySelectorAll('.edit-btn');
  if (editBtnList.length > 0) {
    editBtnList.forEach(btn => {
      btn.addEventListener('click', e => {
        const postId = e.target.getAttribute('data-postId');
        fetch(`/get-edit-post/${postId}`, {
          method: 'GET',
          headers: {
            'csrf-token': csrf
          }
        })
          .then(response => {
            if (response) {
              return response.json();
            }
          })
          .then(response => {
            if (response.error) {
            } else {
              const post = response[0];
              const body = document.body;
              const modal = document.createElement('div');
              modal.className = 'modal';
              modal.classList.add('is-active');
              modal.innerHTML = `        
              <div class="modal-background"></div>
              <div class="modal-card">
                <header class="modal-card-head">
                  <p class="modal-card-title">Edit Post</p>
                  <button class="button icon" id="close-modal-btn" ><i class="fas fa-times"></i></button>
                </header>
                <section class="modal-card-body">
                <form id="edit-form">
                <div class="field">
                    <label class="label">Title</label>
                    <div class="control">
                      <input class="input" type="text" placeholder="Text input" 
                      required name="title" value="${post.title}">
                    </div>
                  </div>
              
                  <div class="field">
                    <label class="label">Post</label>
                    <div class="control">
                      <textarea class="textarea" placeholder="Textarea" required name="postContent">${
                        post.postContent
                      }</textarea>
                    </div>
                  </div>
              
                  <div class="field">
                    <div class="control">
                      <label class="radio">
                        <input type="radio" name="question">
                        Yes
                      </label>
                      <label class="radio">
                        <input type="radio" name="question">
                        No
                      </label>
                    </div>
                  </div>
                  
                  <div class="field is-grouped">
                    <div class="control">
                      <button class="button is-link">Submit</button>
                    </div>
                    <div class="control">
                      <button class="button is-text">Cancel</button>
                    </div>
                  </div>
              </div>
              </form>
                </section>
              
              </div>

            `;
              body.appendChild(modal);
              const closeModalBtn = document.getElementById('close-modal-btn');
              closeModalBtn.addEventListener('click', e => {
                modal.remove();
              });
              const editForm = document.querySelector('#edit-form');
              editForm.addEventListener('submit', e => {
                e.preventDefault();
                const targetElements = e.target.elements;
                const title = targetElements.title.value;
                const postContent = targetElements.postContent.value;
                const post = {
                  title,
                  postContent
                };

                fetch(`/post-edit-post/${postId}`, {
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
                    if (response.msg === 'updated') {
                      const postElement = document.getElementById(
                        `post-${postId}`
                      );
                      const elementTitle = document.getElementById(
                        `title-${postId}`
                      );
                      elementTitle.textContent = post.title;

                      const elementContent = document.getElementById(
                        `content-${postId}`
                      );
                      elementContent.textContent = post.postContent;
                    } else {
                      const errorMsg = document.createElement('div');
                      errorMsg.className = 'notification is-danger';
                      errorMsg.innerHTML = ` <p>${response.error}</p>`;
                      editForm.insertBefore(
                        errorMsg,
                        editForm.firstElementChild
                      );
                      setTimeout(() => {
                        errorMsg.remove();
                      }, 2000);
                    }
                  });
              });
            }
          });
      });
    });
  }
};
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
          const { postId } = response;
          const postElement = document.createElement('div');
          const fullName = document.getElementById('user-fullName').textContent;
          const email = document.getElementById('user-email').textContent;
          postElement.className = 'column is-full box  ';
          postElement.id = `post-${postId}`;
          postElement.innerHTML = `

          <article class="media">
          <figure class="media-left">
            <p class="image is-64x64">
              <img src="https://bulma.io/images/placeholders/128x128.png">
            </p>
          </figure>
          <div class="media-content">
            <div class="content">
              <p>
                <strong>${fullName}</strong> <small> ${email}</small>
                <br>
                <strong id="title-${postId}">${title}</strong>
                <br>
                <p id="content-${postId}"> ${postContent} </p>
              </p>
            </div>
            <nav class="level is-mobile">
              <div class="level-left">
                  <a href="#" class="level-item">Save</a>
                  <button  data-postId='${postId}' class="level-item edit-btn">Edit</button>
                  <button data-postId='${postId}' class="level-item delete-btn">Delete</button>
              </div>
            </nav>
          </div>
        </article>
        
      `;
          const postsContainer = document.getElementById('posts-container');
          postsContainer.insertBefore(
            postElement,
            postsContainer.firstElementChild
          );
          e.target.reset();
          deletePost();
          editPost();
        }
      });
  });
}
editPost();
deletePost();

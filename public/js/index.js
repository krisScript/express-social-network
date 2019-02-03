const postForm = document.getElementById('post-form');
const deleteBtnFunc = () => {
  const deleteBtnList = document.querySelectorAll('.delete-btn');
  if (deleteBtnList.length > 0) {
    deleteBtnList.forEach(deleteBtn => {
      deleteBtn.addEventListener('click', e => {
        const postId = e.target.getAttribute('data-postId');

        const csrf = document.querySelector("[name='_csrf']").value;
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
            console.log(response);
            if (response.msg === 'postDeleted') {
              console.log(e.target.parentElement);
              e.target.parentElement.parentElement.remove();
            }
          });
      });
    });
  }
};
const openEditModal = () => {
  const editBtnList = document.querySelectorAll('.edit-btn');
  if (editBtnList.length > 0) {
    editBtnList.forEach(btn => {
      btn.addEventListener('click', e => {
        const csrf = document.querySelector("[name='_csrf']").value;
        const postId = e.target.getAttribute('data-postId');
        console.log(e.target.parentElement);
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
              console.log(response.error);
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
              const closeModalBtn = document.getElementById('close-modal-btn')
              closeModalBtn.addEventListener('click',e => {
                modal.remove()
              })
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
                    if ((response.msg = 'updated')) {
                      const postElement = document.getElementById(
                        `post-${postId}`
                      );
                      postElement.firstElementChild.firstElementChild.textContent =
                        post.title;
                      postElement.children[1].children[0].textContent =
                        post.postContent;
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
          postElement.className = 'card';
          postElement.id = `post-${postId}`;
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
            
          </div>
        </div>
        <footer class="card-footer">
          <a href="#" class="card-footer-item">Save</a>
          <button  data-postId='${postId} class="card-footer-item edit-btn">Edit</button>
          <button data-postId='${postId}'class="card-footer-item delete-btn">Delete</button>
        </footer>
      `;
          const postsContainer = document.getElementById('posts-container');
          postsContainer.insertBefore(
            postElement,
            postsContainer.firstElementChild
          );
          e.target.reset();
          deleteBtnFunc();
          openEditModal();
        }
      });
  });
}
openEditModal();
deleteBtnFunc();

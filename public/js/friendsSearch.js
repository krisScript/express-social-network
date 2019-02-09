console.log('name');
const autocompleteForm = document.querySelector('#autocomplete-form');
const csrf = document.querySelector("[name='_csrf']").value;
if (autocompleteForm) {
  const autocompleteFormInput = document.querySelector(`[name='userName']`);
  const autocompleteDataset = document.querySelector('#userNames');
  autocompleteFormInput.addEventListener('keyup', e => {
    console.log('up');
    const { value } = e.target;
    const valueData = { value };
    fetch(`/get-autocomplete-user-names`, {
      method: 'POST',
      body: JSON.stringify(valueData),
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
        if (autocompleteDataset.children.length > 0) {
          Array.from(autocompleteDataset.children).forEach(child =>
            child.remove()
          );
        }
        const { autocompleteNames } = response;
        console.log(response);
        if (autocompleteNames) {
          autocompleteNames.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            autocompleteDataset.appendChild(option);
          });
        }
      });
  });
  autocompleteForm.addEventListener('submit', e => {
    e.preventDefault();
    const { userName } = e.target.elements;
    console.log(userName);
    fetch(`/check-user/${userName.value}`, {
      method: 'GET',
      headers: {
        'csrf-token': csrf
      }
    })
      .then(response => {
        return response.json();
      })
      .then(response => {
        if (response.userId) {
          window.location.replace(`/user-page/${response.userId}`);
        } else if (response.msg) {
          const errorMsg = document.createElement('div');
          errorMsg.className = 'notification is-danger';
          errorMsg.innerHTML = ` <p>${response.msg}</p>`;
          autocompleteForm.insertBefore(
            errorMsg,
            autocompleteForm.firstElementChild
          );
          setTimeout(() => {
            errorMsg.remove();
          }, 2000);
        }
      });
  });
}
// document.location.replace('https://developer.mozilla.org/en-US/docs/Web/API/Location.reload');

console.log('name');
const autocompleteForm = document.querySelector('#autocomplete-form');
const csrf = document.querySelector("[name='_csrf']").value;
if (autocompleteForm) {
  const autocompleteFormInput = document.querySelector(`[name='userName']`);
  const autocompleteDataset = document.querySelector('#userNames');
  autocompleteFormInput.addEventListener('keyup', e => {
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
        if (autocompleteNames) {
          autocompleteNames.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            autocompleteDataset.appendChild(option);
          });
        }
      });
  });
}

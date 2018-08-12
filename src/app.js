import { http } from './http';
import { ui } from './ui';

// Get post on DOM load 
document.addEventListener('DOMContentLoaded', getPosts);

// Listen for add post
document.querySelector('.post-submit').addEventListener('click', submitPost);

// Listen for delete
document.querySelector('#posts').addEventListener('click', deletePost);

// Listen for edit state
document.querySelector('#posts').addEventListener('click', enableEdit);

// Listen for cancel
document.querySelector('.card-form').addEventListener('click', cancelEdit);


// Get Posts
function getPosts() {
    http.get('http://localhost:3000/posts')
        .then(data => ui.showPosts(data))
        .catch(err => console.log(err));
}

// Submit Post
function submitPost() {
    const title = document.querySelector('#title').value;
    const body = document.querySelector('#body').value;
    const id = document.querySelector('#id').value;

    const data = {
        title,
        body
    }

    // Validate input
    if (title === '' || body === '') {
        ui.showAlert('Please fill in all fields', 'alert alert-danger');
    } else {
        // Check for ID  
        if (id === '') {
            // Create post
            http.post('http://localhost:3000/posts', data)
                .then(data => {
                    ui.showAlert('Post added', 'alert alert alert-success');
                    ui.clearFields();
                    getPosts();
                })
                .catch(err => console.log(err));
        } else {
            // Update Post
            http.put(`http://localhost:3000/posts/${id}`, data)
                .then(data => {
                    ui.showAlert('Post updated', 'alert alert alert-success');
                    ui.changeFormState('add');
                    getPosts();
                })
                .catch(err => console.log(err));
        }
    }
}

// Delete Post
function deletePost(evt) {
    evt.preventDefault();
    if (evt.target.parentElement.classList.contains('delete')) {
        const id = evt.target.parentElement.dataset.id;
        if (confirm('Are you sure?')) {
            http.delete(`http://localhost:3000/posts/${id}`)
                .then(data => {
                    ui.showAlert('Post Removed', 'alert alert-success');
                    getPosts();
                })
                .catch(err => console.log(err))
        }
    }
}

// Enable Edit State
function enableEdit(evt) {
    evt.preventDefault();
    if (evt.target.parentElement.classList.contains('edit')) {
        const id = evt.target.parentElement.dataset.id;
        const title = evt.target.parentElement.previousElementSibling.previousElementSibling.textContent;
        const body = evt.target.parentElement.previousElementSibling.textContent;
        const data = {
                id,
                title,
                body
            }
            // Fill form with current post
        ui.fillForm(data);
    }
}

// Cancel edit state 
function cancelEdit(evt) {
    evt.preventDefault();
    if (evt.target.classList.contains('post-cancel')) {
        ui.changeFormState('add');
    }
}
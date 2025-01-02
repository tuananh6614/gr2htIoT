document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting normally

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Dummy credentials for demonstration
    const adminUsername = 'admin';
    const adminPassword = '123';

    if (username === adminUsername && password === adminPassword) {
        // Redirect to admin dashboard or perform desired action
        alert('Login successful!');
        window.location.href = 'admin-dashboard.html';
    } else {
        // Display error message
        errorMessage.textContent = 'Invalid username or password. Please try again.';
        errorMessage.style.display = 'block';
    }
});

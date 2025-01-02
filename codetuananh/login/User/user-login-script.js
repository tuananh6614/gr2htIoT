document.getElementById('userLoginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Dummy credentials for demonstration
    const validUsername = 'dung';
    const validPassword = '123';

    if (username === validUsername && password === validPassword) {
        // Redirect to user dashboard or perform desired action
        alert('Đăng nhập thành công!');
        window.location.href = 'user-dashboard.html';
    } else {
        // Display error message
        errorMessage.textContent = 'Tài khoản hoặc mật khẩu sai';
        errorMessage.style.display = 'block';
    }
});

function showError(id, message) {
    document.getElementById(id).textContent = message;
}

function clearErrors() {
    document.querySelectorAll(".error-message").forEach(error => {
        error.textContent = "";
    });
}

function togglePassword(id, icon) {
    const input = document.getElementById(id);
    const showingPassword = input.type === "password";

    input.type = showingPassword ? "text" : "password";
    icon.classList.toggle("fa-eye", !showingPassword);
    icon.classList.toggle("fa-eye-slash", showingPassword);
}

try {
    document.getElementById("username").value =
        localStorage.getItem("daNangUsername") || "";
} catch (error) {
    showError("storageError", "Không thể đọc thông tin đăng nhập đã lưu trên thiết bị này.");
}

document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    clearErrors();
    document.getElementById("success").style.display = "none";

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username) {
        showError("usernameError", "Vui lòng nhập tên đăng nhập hoặc số điện thoại.");
    }

    if (!password) {
        showError("passwordError", "Vui lòng nhập mật khẩu.");
    }

    if (!username || !password) {
        return;
    }

    try {
        const savedUsername = localStorage.getItem("daNangUsername");
        const savedPhone = localStorage.getItem("daNangPhone");
        const savedPassword = localStorage.getItem("daNangPassword");

        if (username !== savedUsername && username !== savedPhone) {
            showError(
                "usernameError",
                "Tên đăng nhập hoặc số điện thoại không đúng, hoặc tài khoản chưa được đăng ký."
            );
            return;
        }

        if (password !== savedPassword) {
            showError("passwordError", "Bạn đã nhập sai mật khẩu, vui lòng nhập lại.");
            return;
        }

        localStorage.setItem("daNangLoggedIn", "true");
    } catch (error) {
        showError("storageError", "Không thể kiểm tra tài khoản. Hãy bật bộ nhớ trình duyệt rồi thử lại.");
        return;
    }

    document.getElementById("success").style.display = "block";
    window.setTimeout(() => {
        window.location.href = "index.html";
    }, 1200);
});

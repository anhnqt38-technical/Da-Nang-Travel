const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const successMessage = document.getElementById("success");
const storageError = document.getElementById("storageError");

try {
    usernameInput.value = localStorage.getItem("daNangUsername") || "";
} catch (error) {
    storageError.textContent = "Không thể đọc tên đăng nhập đã lưu trên thiết bị này.";
}

function togglePassword(id, icon) {
    const input = document.getElementById(id);
    const showingPassword = input.type === "password";

    input.type = showingPassword ? "text" : "password";
    icon.classList.toggle("fa-eye", !showingPassword);
    icon.classList.toggle("fa-eye-slash", showingPassword);
}

document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    document.getElementById("usernameError").textContent = "";
    document.getElementById("passwordError").textContent = "";
    storageError.textContent = "";
    successMessage.style.display = "none";

    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    let valid = true;

    if (!username) {
        document.getElementById("usernameError").textContent = "Vui lòng nhập tên đăng nhập.";
        valid = false;
    }

    if (!password) {
        document.getElementById("passwordError").textContent = "Vui lòng nhập mật khẩu.";
        valid = false;
    }

    if (!valid) {
        return;
    }

    try {
        const savedUsername = localStorage.getItem("daNangUsername");
        const savedPassword = localStorage.getItem("daNangPassword");

        if (!savedUsername || username !== savedUsername) {
            document.getElementById("usernameError").textContent =
                "Tên đăng nhập không đúng hoặc tài khoản chưa được đăng ký.";
            return;
        }

        if (password !== savedPassword) {
            document.getElementById("passwordError").textContent =
                "Bạn đã nhập sai mật khẩu, vui lòng nhập lại.";
            return;
        }
    } catch (error) {
        storageError.textContent = "Không thể kiểm tra tài khoản. Hãy bật bộ nhớ trình duyệt rồi thử lại.";
        return;
    }

    successMessage.style.display = "block";
    window.setTimeout(() => {
        window.location.href = "index.html";
    }, 1200);
});
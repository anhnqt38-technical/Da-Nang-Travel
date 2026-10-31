// HIỆN / ẨN MẬT KHẨU
function togglePassword(id, icon) {
    const input = document.getElementById(id);

    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}

// HIỂN THỊ LỖI
function showError(id, message) {
    const error = document.getElementById(id);
    error.textContent = message;
}

// XÓA LỖI
function clearErrors() {
    document.querySelectorAll(".error-message").forEach(error => {
        error.textContent = "";
    });
}

// XỬ LÝ ĐĂNG KÝ
document.getElementById("registerForm")
.addEventListener("submit", function(e) {

    e.preventDefault();
    clearErrors();
    document.getElementById("success").style.display = "none";

    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    let valid = true;

    // Kiểm tra họ tên
    if (fullname.length < 2) {
        showError("fullnameError", "Vui lòng nhập họ và tên!");
        valid = false;
    }

    // Kiểm tra email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        showError("emailError", "Email không hợp lệ!");
        valid = false;
    }

    // Kiểm tra số điện thoại
    const phoneRegex = /^[0-9]{10,11}$/;

    if (!phoneRegex.test(phone)) {
        showError("phoneError", "Số điện thoại phải có 10-11 chữ số!");
        valid = false;
    }

    // Kiểm tra mật khẩu
    if (password.length < 6) {
        showError("passwordError", "Mật khẩu phải có ít nhất 6 ký tự!");
        valid = false;
    }

    // Xác nhận mật khẩu
    if (confirmPassword !== password || !confirmPassword) {
        showError("confirmPasswordError", "Mật khẩu không khớp!");
        valid = false;
    }

    // Thành công
    if (valid) {
        try {
            localStorage.setItem("daNangUsername", fullname);
            localStorage.setItem("daNangPassword", password);
        } catch (error) {
            showError("storageError", "Không thể lưu tài khoản trên trình duyệt này.");
            return;
        }

        document.getElementById("success").style.display = "block";

        this.reset();

        window.setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);
    }
});

// GOOGLE / FACEBOOK DEMO
function socialLogin(provider) {
    alert("Chức năng đăng nhập " + provider + " cần tích hợp OAuth!");
}

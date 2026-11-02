const loginLink = document.getElementById("loginLink");
const registerLink = document.getElementById("registerLink");
const accountGreeting = document.getElementById("accountGreeting");
const logoutLink = document.getElementById("logoutLink");
const logoutForm = document.getElementById("logoutForm");
const logoutMessage = document.getElementById("logoutMessage");

try {
    const savedUsername = localStorage.getItem("daNangUsername");
    const isLoggedIn = localStorage.getItem("daNangLoggedIn") === "true";

    if (registerLink) {
        registerLink.hidden = Boolean(savedUsername);
    }

    if (loginLink) {
        loginLink.hidden = !savedUsername || isLoggedIn;
    }

    if (isLoggedIn && savedUsername) {
        if (accountGreeting) {
            accountGreeting.textContent = `Xin chào, ${savedUsername}`;
            accountGreeting.hidden = false;
        }

        if (logoutLink) {
            logoutLink.hidden = false;
        }
    }
} catch (error) {
    if (logoutMessage) {
        logoutMessage.textContent = "Không thể đọc trạng thái tài khoản trong trình duyệt.";
    }
}

if (logoutForm) {
    logoutForm.addEventListener("submit", function (event) {
        event.preventDefault();

        try {
            localStorage.removeItem("daNangLoggedIn");
        } catch (error) {
            logoutMessage.textContent =
                "Không thể đăng xuất. Vui lòng kiểm tra cài đặt bộ nhớ trình duyệt.";
            return;
        }

        logoutMessage.textContent = "Bạn đã đăng xuất thành công. Đang chuyển về trang chủ...";
        logoutForm.querySelectorAll("button").forEach(button => {
            button.disabled = true;
        });
        window.setTimeout(() => {
            window.location.href = "index.html";
        }, 800);
    });
}
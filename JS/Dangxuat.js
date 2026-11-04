const loginLink = document.getElementById("loginLink");
const registerLink = document.getElementById("registerLink");
const accountGreeting = document.getElementById("accountGreeting");
const accountMenu = document.getElementById("accountMenu");
const accountDropdown = document.getElementById("accountDropdown");
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
        if (accountGreeting && accountMenu) {
            accountGreeting.textContent = `Xin chào, ${savedUsername}`;
            accountMenu.hidden = false;
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

if (accountGreeting && accountDropdown) {
    accountGreeting.addEventListener("click", function() {
        const isExpanded = accountGreeting.getAttribute("aria-expanded") === "true";
        accountGreeting.setAttribute("aria-expanded", String(!isExpanded));
        accountDropdown.hidden = isExpanded;
    });

    document.addEventListener("click", function(event) {
        if (!event.target.closest("#accountMenu")) {
            accountDropdown.hidden = true;
            accountGreeting.setAttribute("aria-expanded", "false");
        }
    });

    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            accountDropdown.hidden = true;
            accountGreeting.setAttribute("aria-expanded", "false");
        }
    });
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
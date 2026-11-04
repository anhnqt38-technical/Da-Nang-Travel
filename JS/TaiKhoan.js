const accountDetails = document.getElementById("accountDetails");
const accountDataNote = document.getElementById("accountDataNote");

function showAccountNotice(message, includeLoginLink = false) {
    const notice = document.createElement("p");
    notice.className = "account-notice";
    notice.append(document.createTextNode(message));

    if (includeLoginLink) {
        const loginLink = document.createElement("a");
        loginLink.href = "Dangnhap.html";
        loginLink.textContent = "Đăng nhập";
        notice.append(document.createTextNode(" "), loginLink, document.createTextNode(" để xem thông tin tài khoản."));
    }

    accountDetails.replaceChildren(notice);
}

try {
    const isLoggedIn = localStorage.getItem("daNangLoggedIn") === "true";
    const username = localStorage.getItem("daNangUsername");

    if (!isLoggedIn || !username) {
        showAccountNotice("Bạn cần đăng nhập để xem thông tin tài khoản.", true);
    } else {
        const email = localStorage.getItem("daNangEmail");
        const phone = localStorage.getItem("daNangPhone");
        [
            ["Họ và tên", username],
            ["Email", email || "Chưa cập nhật"],
            ["Số điện thoại", phone || "Chưa cập nhật"]
        ].forEach(([label, value]) => {
            const line = document.createElement("p");
            line.className = "account-detail";
            const labelElement = document.createElement("strong");
            labelElement.textContent = `${label}:`;
            line.append(labelElement, document.createTextNode(value));
            accountDetails.append(line);
        });

        if (!email && accountDataNote) {
            accountDataNote.textContent =
                "Email chưa được lưu cho tài khoản đăng ký trước đây. Email sẽ được hiển thị sau khi bạn đăng ký với phiên bản hiện tại.";
            accountDataNote.hidden = false;
        }

    }
} catch (error) {
    console.error(error);
    showAccountNotice("Không thể đọc thông tin tài khoản. Vui lòng kiểm tra bộ nhớ trình duyệt và thử lại.");
}
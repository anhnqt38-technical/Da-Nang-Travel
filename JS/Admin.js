const BOOKING_KEY = "tourBookings";
const ADMIN_PASSWORD = "admin123";          // Đổi mật khẩu tại đây
const ADMIN_SESSION_KEY = "adminLoggedIn";
const priceByTour = {
    "Đà Nẵng – Bà Nà – Hội An (3 ngày 2 đêm)": { adult: 3500000, child: 1500000 },
    "Một ngày ở Đà Nẵng": { adult: 1500000, child: 700000 },
    "Hẹn hò cùng phố cổ Hội An": { adult: 1800000, child: 1000000 }
};

const loginBox = document.getElementById("adminLogin");
const loginForm = document.getElementById("adminLoginForm");
const loginMessage = document.getElementById("adminLoginMessage");
const panel = document.getElementById("adminPanel");
const logoutLink = document.getElementById("adminLogout");
const listBox = document.getElementById("adminList");
const emptyMessage = document.getElementById("adminEmpty");
const filterBox = document.getElementById("adminFilters");

let currentFilter = "Chờ xác nhận";

/* ---------- Dữ liệu ---------- */
function readBookings() {
    const raw = localStorage.getItem(BOOKING_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) throw new Error("Dữ liệu đặt tour không hợp lệ.");
    return data;
}

function saveBookings(bookings) {
    localStorage.setItem(BOOKING_KEY, JSON.stringify(bookings));
}

function formatDate(value) {
    if (!value) return "Chưa có thông tin";
    const [y, m, d] = value.split("-");
    return y && m && d ? `${d}/${m}/${y}` : value;
}

function formatMoney(booking) {
    const tourPrice = priceByTour[booking.tour] || {};
    const adultUnitPrice = Number(booking.adultUnitPrice) ||
        Number(booking.unitPrice) || tourPrice.adult || 0;
    const childUnitPrice = Number(booking.childUnitPrice) || tourPrice.child || 0;
    const adultGuests = booking.adultGuests === undefined
        ? Number(booking.guests || 1)
        : Number(booking.adultGuests);
    const childGuests = Number(booking.childGuests) || 0;
    const total = adultUnitPrice * adultGuests + childUnitPrice * childGuests;
    return total ? `${total.toLocaleString("vi-VN")} VNĐ` : "";
}

function guestSummary(booking) {
    const adults = booking.adultGuests === undefined
        ? Number(booking.guests || 0)
        : Number(booking.adultGuests) || 0;
    const children = Number(booking.childGuests) || 0;
    return `${adults} người lớn, ${children} trẻ em`;
}

function statusClass(status) {
    if (status === "Đã xác nhận") return "st-approved";
    if (status === "Từ chối") return "st-rejected";
    if (status === "Đã hủy") return "st-cancelled";
    return "st-pending";
}

/* ---------- Đăng nhập admin ---------- */
function showPanel(isLoggedIn) {
    loginBox.hidden = isLoggedIn;
    panel.hidden = !isLoggedIn;
    logoutLink.hidden = !isLoggedIn;
    if (isLoggedIn) render();
}

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (document.getElementById("adminPassword").value === ADMIN_PASSWORD) {
        sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
        loginMessage.textContent = "";
        loginForm.reset();
        showPanel(true);
    } else {
        loginMessage.textContent = "Mật khẩu không đúng. Vui lòng thử lại.";
    }
});

logoutLink.addEventListener("click", (event) => {
    event.preventDefault();
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    showPanel(false);
});

/* ---------- Hiển thị danh sách ---------- */
function makeLine(label, value) {
    const p = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = `${label}: `;
    p.append(strong, document.createTextNode(value || "Chưa có thông tin"));
    return p;
}

function makeButton(className, action, id, text) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = className;
    btn.dataset.action = action;
    btn.dataset.id = id;
    btn.textContent = text;
    return btn;
}

function updateCounts(bookings) {
    document.querySelectorAll("[data-count]").forEach((el) => {
        const key = el.dataset.count;
        el.textContent = key === "all"
            ? bookings.length
            : bookings.filter((b) => b.status === key).length;
    });
}

function render() {
    try {
        const bookings = readBookings();
        updateCounts(bookings);

        const shown = bookings
            .filter((b) => currentFilter === "all" || b.status === currentFilter)
            .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));

        listBox.replaceChildren();
        emptyMessage.hidden = shown.length > 0;

        shown.forEach((booking) => {
            const card = document.createElement("article");
            card.className = `admin-item ${statusClass(booking.status)}`;

            const details = document.createElement("div");
            details.className = "admin-item-details";
            details.append(
                makeLine("Hành trình", booking.tour),
                makeLine("Khách hàng", booking.customerName),
                makeLine("Số điện thoại", booking.phone),
                makeLine("Email", booking.email),
                makeLine("Ngày khởi hành", formatDate(booking.departureDate)),
                makeLine("Số khách", guestSummary(booking))
            );

            const money = formatMoney(booking);
            if (money) {
                const price = makeLine("Tổng tiền", money);
                price.classList.add("admin-price");
                details.append(price);
            }

            const status = document.createElement("p");
            status.className = "admin-status";
            status.textContent = `Trạng thái: ${booking.status}`;
            details.append(status);

            if (booking.status === "Từ chối" && booking.rejectReason) {
                details.append(makeLine("Lý do từ chối", booking.rejectReason));
            }

            const actions = document.createElement("div");
            actions.className = "admin-item-actions";
            if (booking.status === "Chờ xác nhận") {
                actions.append(
                    makeButton("btn-duyet", "approve", booking.id, "Duyệt đơn"),
                    makeButton("btn-tuchoi", "reject", booking.id, "Từ chối")
                );
            }
            actions.append(makeButton("btn-xoa", "delete", booking.id, "Xóa đơn"));

            card.append(details, actions);
            listBox.append(card);
        });
    } catch (error) {
        listBox.replaceChildren();
        emptyMessage.hidden = false;
        emptyMessage.textContent = "Không thể đọc danh sách đơn: " + error.message;
    }
}

filterBox.addEventListener("click", (event) => {
    const btn = event.target.closest(".filter-btn");
    if (!btn) return;
    currentFilter = btn.dataset.filter;
    filterBox.querySelectorAll(".filter-btn").forEach((b) =>
        b.classList.toggle("is-active", b === btn)
    );
    emptyMessage.textContent = "Không có đơn nào trong mục này.";
    render();
});

/* ---------- Duyệt / từ chối / xóa ---------- */
listBox.addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-action]");
    if (!btn) return;

    try {
        const bookings = readBookings();
        const booking = bookings.find((b) => b.id === btn.dataset.id);
        if (!booking) return;

        if (btn.dataset.action === "approve") {
            if (!confirm(`Duyệt đơn của ${booking.customerName}?`)) return;
            booking.status = "Đã xác nhận";
            booking.reviewedAt = new Date().toISOString();
            booking.notified = false;   // Khách sẽ nhận thông báo ở lần mở trang Đặt tour tiếp theo
            delete booking.rejectReason;
            saveBookings(bookings);
            alert(
                `✓ Đã xác nhận đơn hàng\n\n` +
                `Khách hàng: ${booking.customerName}\n` +
                `Hành trình: ${booking.tour}\n` +
                `Ngày khởi hành: ${formatDate(booking.departureDate)}\n` +
                `Số khách: ${guestSummary(booking)}`
            );
        } else if (btn.dataset.action === "reject") {
            const reason = prompt("Nhập lý do từ chối đơn (có thể để trống):");
            if (reason === null) return;    // Admin bấm Hủy
            booking.status = "Từ chối";
            booking.rejectReason = reason.trim();
            booking.reviewedAt = new Date().toISOString();
            booking.notified = false;
            saveBookings(bookings);
            alert(`Đã từ chối đơn của ${booking.customerName}.`);
        } else if (btn.dataset.action === "delete") {
            if (!confirm("Xóa đơn này? Thao tác không thể hoàn tác.")) return;
            saveBookings(bookings.filter((b) => b.id !== booking.id));
        }
        render();
    } catch (error) {
        alert("Không thể cập nhật đơn: " + error.message);
    }
});

/* Tự cập nhật khi khách đặt đơn mới ở tab khác */
window.addEventListener("storage", (event) => {
    if (event.key === BOOKING_KEY && !panel.hidden) render();
});

showPanel(sessionStorage.getItem(ADMIN_SESSION_KEY) === "1");
